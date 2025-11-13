import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let currentJobId: string | null = null;
  let heartbeatInterval: number | null = null;
  
  try {
    const { family_id, job_id } = await req.json();
    currentJobId = job_id;
    console.log('🚀 Queue processor starting for family:', family_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // PHASE 3: Start heartbeat mechanism to prevent timeout detection
    heartbeatInterval = setInterval(async () => {
      try {
        await supabase
          .from('analysis_jobs')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', job_id);
        console.log('💓 Heartbeat sent');
      } catch (err) {
        console.error('❌ Heartbeat failed:', err);
      }
    }, 30000); // Every 30 seconds

    // Smart batching: adjust batch size based on document complexity
    const MAX_BATCH_SIZE = 3;
    const LARGE_DOC_THRESHOLD = 5000; // tokens
    let totalProcessed = 0;
    let totalFailed = 0;
    let continueProcessing = true;
    let consecutiveRateLimits = 0;

    while (continueProcessing) {
      // Get next batch - larger batch for small docs
      const { data: queueItems, error: queueError } = await supabase
        .rpc('get_next_queue_items', {
          p_family_id: family_id,
          p_limit: MAX_BATCH_SIZE
        });

      if (queueError) {
        console.error('❌ Error fetching queue items:', queueError);
        throw queueError;
      }

      if (!queueItems || queueItems.length === 0) {
        console.log('✅ No more items in queue');
        continueProcessing = false;
        break;
      }

      // Determine batch size based on document sizes
      const avgTokens = queueItems.reduce((sum: number, item: any) => 
        sum + (item.estimated_tokens || 5000), 0) / queueItems.length;
      
      const isLargeBatch = avgTokens >= LARGE_DOC_THRESHOLD;
      const actualBatchSize = isLargeBatch ? 1 : Math.min(queueItems.length, 3); // Process up to 3 small docs in parallel
      const batchToProcess = queueItems.slice(0, actualBatchSize);

      console.log(`📦 Processing ${batchToProcess.length} document(s) - ${isLargeBatch ? 'LARGE (sequential)' : 'PARALLEL'} (avg: ${Math.round(avgTokens)} tokens)`);

      // Process based on batch type
      let batchProcessed = 0;
      let batchFailed = 0;

      if (isLargeBatch || batchToProcess.length === 1) {
        // Sequential processing for large docs
        for (const item of batchToProcess) {
          const startTime = Date.now();
          
          // Get document details
          const { data: doc } = await supabase
            .from('documents')
            .select('file_name')
            .eq('id', item.document_id)
            .single();
          
          // CRITICAL FIX #1: Handle missing documents
          if (!doc) {
            console.error(`❌ Document not found: ${item.document_id} (may have been deleted)`);
            await supabase
              .from('analysis_queue')
              .update({
                status: 'failed',
                error_message: 'Document not found (may have been deleted)',
                completed_at: new Date().toISOString()
              })
              .eq('id', item.id);
            batchFailed++;
            continue;
          }
          
          const documentName = doc.file_name;
          
          // Create status tracking record
          const { data: statusRecord } = await supabase
            .from('document_analysis_status')
            .insert({
              job_id: item.job_id,
              document_id: item.document_id,
              family_id: item.family_id,
              document_name: documentName,
              status: 'extracting',
              started_at: new Date().toISOString()
            })
            .select()
            .single();
          
          try {
            // Step 1: Extract text with vision
            console.log(`  📄 Extracting: ${item.document_id}`);
            const extractResult = await supabase.functions.invoke(
              'extract-text-with-vision',
              {
                body: { 
                  document_id: item.document_id,
                  force_re_extract: true
                }
              }
            );

            // Handle oversized documents - skip gracefully
            const errorCode = extractResult.data?.error_code || extractResult.error?.message;
            const isOversized = 
              errorCode?.includes('OVERSIZED_PDF') ||
              errorCode?.includes('OVERSIZED_FILE') ||
              errorCode?.includes('MEMORY_EXCEEDED');
              
            if (isOversized) {
              const errorMessage = extractResult.data?.message || 'Document too large to process';
              console.log(`  ⏭️ Skipping oversized document: ${documentName} (${errorCode})`);
              await Promise.all([
                supabase
                  .from('analysis_queue')
                  .update({
                    status: 'failed',
                    error_message: errorMessage,
                    completed_at: new Date().toISOString()
                  })
                  .eq('id', item.id),
                supabase
                  .from('document_analysis_status')
                  .update({
                    status: 'failed',
                    error_message: 'Document exceeds 100-page limit. Please split into smaller files.',
                    completed_at: new Date().toISOString()
                  })
                  .eq('id', statusRecord.id)
              ]);
              batchFailed++;
              continue; // Skip to next document
            }

            // Check if extraction actually completed
            if (extractResult.error || !extractResult.data?.extracted_content) {
              const errorMsg = extractResult.error?.message || 'Text extraction incomplete';
              console.log(`  ❌ Extraction failed for: ${item.document_id} - ${errorMsg}`);
              
              // Mark as failed - NEVER delete user documents
              await Promise.all([
                supabase.from('analysis_queue').update({
                  status: 'failed',
                  error_message: errorMsg,
                  completed_at: new Date().toISOString()
                }).eq('id', item.id),
                supabase.from('document_analysis_status').upsert({
                  document_id: item.document_id,
                  status: 'failed',
                  error_message: `Extraction error: ${errorMsg}`,
                  completed_at: new Date().toISOString()
                })
              ]);
              
              batchFailed++;
              continue;
            }

            // Update status to analyzing
            await supabase
              .from('document_analysis_status')
              .update({
                status: 'analyzing',
                status_message: 'Running AI analysis...'
              })
              .eq('id', statusRecord.id);

            // Step 2: Analyze document
            console.log(`  🧠 Analyzing: ${item.document_id}`);
            const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
              'analyze-document',
              {
                body: { 
                  document_id: item.document_id,
                  bypass_limit: true
                }
              }
            );

            if (analysisError) {
              // Check for rate limit (429)
              if (analysisError.message?.includes('429') || analysisError.message?.includes('rate limit')) {
                consecutiveRateLimits++;
                console.log(`⚠️ Rate limit hit (${consecutiveRateLimits} consecutive)`);
                throw new Error('Rate limit: Will retry with backoff');
              }
              throw new Error(`Analysis failed: ${analysisError.message}`);
            }

            // Reset rate limit counter on success
            consecutiveRateLimits = 0;

            // Get final metrics/insights count
            const [{ count: metricsCount }, { count: insightsCount }] = await Promise.all([
              supabase
                .from('document_metrics')
                .select('id', { count: 'exact', head: true })
                .eq('document_id', item.document_id),
              supabase
                .from('ai_insights')
                .select('id', { count: 'exact', head: true })
                .eq('document_id', item.document_id)
            ]);

            // Mark as completed
            const processingTime = Date.now() - startTime;
            await Promise.all([
              supabase
                .from('analysis_queue')
                .update({
                  status: 'completed',
                  completed_at: new Date().toISOString(),
                  processing_time_ms: processingTime
                })
                .eq('id', item.id),
              supabase
                .from('document_analysis_status')
                .update({
                  status: 'complete',
                  metrics_extracted: metricsCount || 0,
                  insights_extracted: insightsCount || 0,
                  completed_at: new Date().toISOString()
                })
                .eq('id', statusRecord.id)
            ]);

            console.log(`  ✅ Completed: ${item.document_id} (${processingTime}ms)`);
            batchProcessed++;

          } catch (error: any) {
            console.error(`  ❌ Failed: ${item.document_id}`, error.message);
            
            const processingTime = Date.now() - startTime;
            const currentRetries = item.retry_count || 0;
            const maxRetries = 3;
            const errorMessage = error.message || 'Unknown error';
            
            // Smart error categorization
            const isRetryable = 
              errorMessage.includes('rate_limit') ||
              errorMessage.includes('timeout') ||
              errorMessage.includes('network') ||
              errorMessage.includes('ECONNRESET') ||
              errorMessage.includes('503') ||
              errorMessage.includes('429');
            
            const isOversized = 
              errorMessage.includes('OVERSIZED') ||
              errorMessage.includes('too large') ||
              errorMessage.includes('exceeds 100 pages');
            
            const isPaymentRequired = 
              errorMessage.includes('insufficient_credits') ||
              errorMessage.includes('payment_required') ||
              errorMessage.includes('PAYMENT_REQUIRED');

            if (isOversized) {
              // Permanent failure - document is too large
              await Promise.all([
                supabase.from('analysis_queue').update({
                  status: 'failed',
                  error_message: 'Document exceeds size limit (>100 pages). Please split into smaller files and re-upload.',
                  completed_at: new Date().toISOString()
                }).eq('id', item.id),
                supabase.from('document_analysis_status').update({
                  status: 'failed',
                  error_message: 'Document too large. Split into smaller files and re-upload.',
                  completed_at: new Date().toISOString()
                }).eq('document_id', item.document_id)
              ]);
              batchFailed++;
              
            } else if (isPaymentRequired) {
              // Permanent failure - requires user to purchase credits
              await Promise.all([
                supabase.from('analysis_queue').update({
                  status: 'failed',
                  error_message: 'Insufficient AI credits. Please purchase more credits to continue processing.',
                  completed_at: new Date().toISOString()
                }).eq('id', item.id),
                supabase.from('document_analysis_status').update({
                  status: 'failed',
                  error_message: 'Analysis paused: Insufficient AI credits. Purchase credits to resume.',
                  completed_at: new Date().toISOString()
                }).eq('document_id', item.document_id)
              ]);
              batchFailed++;
              
            } else if (isRetryable && currentRetries < maxRetries) {
              // Temporary failure - retry with exponential backoff
              const backoffSeconds = Math.pow(2, currentRetries) * 30; // 30s, 60s, 120s
              const processAfter = new Date(Date.now() + (backoffSeconds * 1000));
              
              console.log(`🔄 Retrying in ${backoffSeconds}s (attempt ${currentRetries + 1}/${maxRetries})`);
              
              await supabase.from('analysis_queue').update({
                status: 'pending',
                retry_count: currentRetries + 1,
                error_message: `Temporary error. Auto-retry ${currentRetries + 1}/${maxRetries} scheduled.`,
                process_after: processAfter.toISOString()
              }).eq('id', item.id);
              
              await supabase.from('document_analysis_status').update({
                status: 'pending',
                status_message: `Retry scheduled in ${Math.round(backoffSeconds / 60)}min (attempt ${currentRetries + 1}/${maxRetries})`,
                error_message: `Temporary error: ${errorMessage}`
              }).eq('document_id', item.document_id);
              
              // Don't count as failed - will auto-retry
              
            } else {
              // Max retries exceeded or non-retryable error
              await Promise.all([
                supabase.from('analysis_queue').update({
                  status: 'failed',
                  error_message: `Failed after ${currentRetries} retries: ${errorMessage}`,
                  completed_at: new Date().toISOString()
                }).eq('id', item.id),
                supabase.from('document_analysis_status').update({
                  status: 'failed',
                  error_message: `Analysis failed: ${errorMessage}. Click "Retry" to try again.`,
                  completed_at: new Date().toISOString()
                }).eq('document_id', item.document_id)
              ]);
              batchFailed++;
            }

            // Skip the next batch delay
            continue;
          }
          
          // Minimal delay between documents - only use longer delays on rate limits
          if (batchToProcess.indexOf(item) < batchToProcess.length - 1) {
            const delay = consecutiveRateLimits > 0 
              ? 30000 * consecutiveRateLimits  // Backoff on rate limits: 30s, 60s, 90s
              : 2000;  // Just 2 seconds between documents normally
            console.log(`  ⏸️ Waiting ${delay/1000}s before next document...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      } else {
        // Parallel processing for small docs
        console.log(`  🚀 Processing ${batchToProcess.length} small docs in parallel`);
        
        const processingPromises = batchToProcess.map(async (item: any) => {
          const startTime = Date.now();
          
          const { data: doc } = await supabase
            .from('documents')
            .select('file_name')
            .eq('id', item.document_id)
            .single();
          
          // CRITICAL FIX #1: Handle missing documents in parallel processing
          if (!doc) {
            console.error(`❌ Document not found: ${item.document_id}`);
            await supabase
              .from('analysis_queue')
              .update({
                status: 'failed',
                error_message: 'Document not found (may have been deleted)',
                completed_at: new Date().toISOString()
              })
              .eq('id', item.id);
            return { success: false, item, error: 'Document not found' };
          }
          
          const documentName = doc.file_name;
          
          const { data: statusRecord } = await supabase
            .from('document_analysis_status')
            .insert({
              job_id: item.job_id,
              document_id: item.document_id,
              family_id: item.family_id,
              document_name: documentName,
              status: 'extracting',
              started_at: new Date().toISOString()
            })
            .select()
            .single();
          
          try {
            const extractResult = await supabase.functions.invoke(
              'extract-text-with-vision',
              {
                body: { 
                  document_id: item.document_id,
                  force_re_extract: true
                }
              }
            );

            // Handle oversized PDF in parallel processing
            const isOversizedPdf = 
              extractResult.error?.message?.includes('OVERSIZED_PDF') ||
              extractResult.data?.error_code === 'OVERSIZED_PDF';
              
            if (isOversizedPdf) {
              await Promise.all([
                supabase
                  .from('analysis_queue')
                  .update({
                    status: 'failed',
                    error_message: 'Document too large (>100 pages). Please split into smaller files.',
                    completed_at: new Date().toISOString()
                  })
                  .eq('id', item.id),
                supabase
                  .from('document_analysis_status')
                  .update({
                    status: 'failed',
                    error_message: 'Document exceeds 100-page limit. Please split into smaller files.',
                    completed_at: new Date().toISOString()
                  })
                  .eq('id', statusRecord.id)
              ]);
              return { success: false, item, error: 'OVERSIZED_PDF' };
            }

            if (extractResult.error) throw new Error(`Extraction failed: ${extractResult.error.message}`);

            await supabase
              .from('document_analysis_status')
              .update({
                status: 'analyzing',
                status_message: 'Running AI analysis...'
              })
              .eq('id', statusRecord.id);

            const { error: analysisError } = await supabase.functions.invoke(
              'analyze-document',
              {
                body: { 
                  document_id: item.document_id,
                  bypass_limit: true
                }
              }
            );

            if (analysisError) throw new Error(`Analysis failed: ${analysisError.message}`);

            const [{ count: metricsCount }, { count: insightsCount }] = await Promise.all([
              supabase
                .from('document_metrics')
                .select('id', { count: 'exact', head: true })
                .eq('document_id', item.document_id),
              supabase
                .from('ai_insights')
                .select('id', { count: 'exact', head: true })
                .eq('document_id', item.document_id)
            ]);

            const processingTime = Date.now() - startTime;
            await Promise.all([
              supabase
                .from('analysis_queue')
                .update({
                  status: 'completed',
                  completed_at: new Date().toISOString(),
                  processing_time_ms: processingTime
                })
                .eq('id', item.id),
              supabase
                .from('document_analysis_status')
                .update({
                  status: 'complete',
                  metrics_extracted: metricsCount || 0,
                  insights_extracted: insightsCount || 0,
                  completed_at: new Date().toISOString()
                })
                .eq('id', statusRecord.id)
            ]);

            return { success: true, item };
          } catch (error: any) {
            const processingTime = Date.now() - startTime;
            const retryCount = item.retry_count + 1;
            
            // Detect error types
            const isRateLimit = error.message?.includes('rate limit') || error.message?.includes('429');
            const isPaymentRequired = error.message?.includes('402') || error.message?.includes('insufficient credits');
            const isTimeout = error.message?.includes('timeout');
            
            await supabase
              .from('document_analysis_status')
              .update({
                status: 'failed',
                error_message: isRateLimit 
                  ? `Rate limited (429). Auto-retry ${retryCount}/${item.max_retries}` 
                  : isPaymentRequired 
                  ? 'Insufficient AI credits'
                  : error.message,
                completed_at: new Date().toISOString()
              })
              .eq('id', statusRecord.id);
            
            // Payment required - mark as failed
            if (isPaymentRequired) {
              await supabase
                .from('analysis_queue')
                .update({
                  status: 'failed',
                  error_message: 'Insufficient AI credits',
                  completed_at: new Date().toISOString()
                })
                .eq('id', item.id);
              return { success: false, item, error: 'Payment required', stopProcessing: true };
            }
            
            // Rate limit or timeout - retry if under limit
            if ((isRateLimit || isTimeout) && retryCount < item.max_retries) {
              await supabase
                .from('analysis_queue')
                .update({
                  status: 'pending',
                  retry_count: retryCount,
                  error_message: isRateLimit 
                    ? `Rate limited. Will auto-retry (${retryCount}/${item.max_retries})`
                    : `Timeout. Will retry (${retryCount}/${item.max_retries})`,
                  processing_time_ms: processingTime
                })
                .eq('id', item.id);
              return { success: false, item, error: error.message, willRetry: true };
            }
            
            // Permanent failure
            await supabase
              .from('analysis_queue')
              .update({
                status: 'failed',
                retry_count: retryCount,
                error_message: retryCount >= item.max_retries 
                  ? `Max retries exceeded: ${error.message}`
                  : error.message,
                completed_at: new Date().toISOString(),
                processing_time_ms: processingTime
              })
              .eq('id', item.id);

            return { success: false, item, error: error.message };
          }
        });

        const results = await Promise.allSettled(processingPromises);
        batchProcessed = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        
        // Check for payment required errors
        const hasPaymentError = results.some(r => 
          r.status === 'fulfilled' && r.value.stopProcessing
        );
        
        if (hasPaymentError) {
          console.log('💳 Payment required detected in batch - stopping job');
          continueProcessing = false;
        }
        
        // Count only permanent failures (not retries)
        batchFailed = results.filter(r => 
          r.status === 'fulfilled' && !r.value.success && !r.value.willRetry
        ).length;
      }

      totalProcessed += batchProcessed;
      totalFailed += batchFailed;

      console.log(`📊 Batch complete: ${batchProcessed} succeeded, ${batchFailed} failed`);

      // Update job progress with estimated time
      if (job_id) {
        const jobData = await supabase
          .from('analysis_jobs')
          .select('started_at, created_at, total_documents, metadata')
          .eq('id', job_id)
          .single();

        if (jobData.data) {
          const startTime = jobData.data.started_at || jobData.data.created_at;
          const elapsedMinutes = Math.floor((Date.now() - new Date(startTime).getTime()) / 60000);
          const avgTimePerDoc = totalProcessed > 0 ? elapsedMinutes / totalProcessed : 2;
          const remainingDocs = jobData.data.total_documents - totalProcessed;
          const estimatedMinutes = Math.ceil(avgTimePerDoc * remainingDocs);

          await supabase
            .from('analysis_jobs')
            .update({
              processed_documents: totalProcessed,
              failed_documents: totalFailed,
              metadata: {
                ...(jobData.data.metadata as any || {}),
                estimatedMinutes,
                avgTimePerDoc: Math.round(avgTimePerDoc * 10) / 10
              }
            })
            .eq('id', job_id);
        }
      }

      // Adaptive cooldown between batches
      if (batchToProcess.length === actualBatchSize) {
        const cooldown = consecutiveRateLimits > 0 ? 60000 : (isLargeBatch ? 10000 : 30000);
        console.log(`⏸️ Cooldown: ${cooldown/1000}s before next batch`);
        await new Promise(resolve => setTimeout(resolve, cooldown));
      }
    }

    // Mark job as complete if all items processed
    if (job_id) {
      const { data: stats } = await supabase.rpc('get_queue_stats', {
        p_family_id: family_id
      });

      const pendingCount = stats?.[0]?.pending_items || 0;
      const processingCount = stats?.[0]?.processing_items || 0;

      if (pendingCount === 0 && processingCount === 0) {
        // Get job metadata for report generation
        const { data: jobData } = await supabase
          .from('analysis_jobs')
          .select('metadata')
          .eq('id', job_id)
          .single();

        const jobMetadata = (jobData?.metadata as any) || {};
        
        // CRITICAL FIX #2: Use database-level locking to prevent race condition
        const { data: jobUpdate } = await supabase
          .from('analysis_jobs')
          .update({
            status: totalFailed > 0 ? 'completed_with_errors' : 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', job_id)
          .eq('status', 'processing') // Only update if still processing
          .select()
          .single();

        // Only proceed if WE were the one to complete the job
        if (!jobUpdate) {
          console.log('⚠️ Job already completed by another process, skipping report generation');
          return new Response(
            JSON.stringify({
              success: true,
              processed: totalProcessed,
              failed: totalFailed,
              message: 'Job already completed by another process'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('🎉 Job complete!');

        // Auto-generate comprehensive report after successful completion
        if (totalFailed === 0 && totalProcessed > 0) {
          console.log('📊 Auto-generating comprehensive report...');
          
          // CRITICAL FIX #6: Try all documents to find valid student_id
          const { data: processedDocs } = await supabase
            .from('document_analysis_status')
            .select('document_id')
            .eq('job_id', job_id)
            .eq('status', 'complete');

          if (processedDocs && processedDocs.length > 0) {
            // Try all documents to find one with valid student_id
            const { data: docsWithStudent } = await supabase
              .from('documents')
              .select('student_id')
              .in('id', processedDocs.map(d => d.document_id))
              .not('student_id', 'is', null)
              .limit(1);

            const studentId = docsWithStudent?.[0]?.student_id;

            if (studentId) {
              try {
                const reportResponse = await supabase.functions.invoke('generate-document-report', {
                  body: {
                    family_id: family_id,
                    student_id: studentId,
                    focusArea: 'comprehensive'
                  }
                });

                // CRITICAL FIX #3: Proper error handling for report generation
                if (reportResponse.error) {
                  console.error('❌ Report generation failed:', reportResponse.error);
                  // Update metadata with error info
                  await supabase
                    .from('analysis_jobs')
                    .update({
                      metadata: {
                        ...jobMetadata,
                        report_error: reportResponse.error.message || 'Report generation failed',
                        report_generated: false
                      }
                    })
                    .eq('id', job_id);
                } else if (reportResponse.data?.report_id) {
                  console.log('✅ Report generated:', reportResponse.data.report_id);
                  
                  // Update job metadata with valid report ID
                  await supabase
                    .from('analysis_jobs')
                    .update({
                      metadata: {
                        ...jobMetadata,
                        report_id: reportResponse.data.report_id,
                        report_generated: true
                      }
                    })
                    .eq('id', job_id);
                } else {
                  console.warn('⚠️ Report response missing report_id');
                  await supabase
                    .from('analysis_jobs')
                    .update({
                      metadata: {
                        ...jobMetadata,
                        report_error: 'Report generated but no ID returned',
                        report_generated: false
                      }
                    })
                    .eq('id', job_id);
                }
              } catch (reportError: any) {
                console.error('❌ Report generation exception:', reportError);
                // Update metadata with exception info
                await supabase
                  .from('analysis_jobs')
                  .update({
                    metadata: {
                      ...jobMetadata,
                      report_error: reportError.message || 'Report generation threw exception',
                      report_generated: false
                    }
                  })
                  .eq('id', job_id);
              }
            } else {
              console.warn('⚠️ No documents with valid student_id found');
            }
          }
        }
      }
    }

    // Clear heartbeat before returning
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      console.log('💓 Heartbeat stopped');
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: totalProcessed,
        failed: totalFailed,
        message: `Queue processing complete: ${totalProcessed} succeeded, ${totalFailed} failed`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Clear heartbeat on error
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    console.error('❌ FATAL ERROR in process-analysis-queue:', error);
    
    // CRITICAL: Clean up stuck items on catastrophic failure
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      console.log('🔄 Attempting cleanup of stuck items...');
      
      // Reset processing items to pending for retry
      if (currentJobId) {
        await supabase
          .from('analysis_queue')
          .update({
            status: 'pending',
            started_at: null,
            error_message: `Fatal error: ${error.message}. Reset for retry.`,
            updated_at: new Date().toISOString()
          })
          .eq('job_id', currentJobId)
          .eq('status', 'processing');

        // Mark job as failed
        await supabase
          .from('analysis_jobs')
          .update({
            status: 'failed',
            error_message: `Fatal error: ${error.message}`,
            completed_at: new Date().toISOString()
          })
          .eq('id', currentJobId);
          
        console.log('✅ Cleanup completed');
      }
    } catch (cleanupError) {
      console.error('❌ Cleanup failed:', cleanupError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
        recovery_available: true
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
