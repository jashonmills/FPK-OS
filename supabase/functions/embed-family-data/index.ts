import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createEmbedding, chunkText as sharedChunkText } from "../_shared/embedding-helper.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { source_table, source_id } = await req.json();

    console.log(`🔍 Embedding data from ${source_table} with ID: ${source_id}`);

    // Fetch the source record
    const { data: record, error: fetchError } = await supabase
      .from(source_table)
      .select("*")
      .eq("id", source_id)
      .maybeSingle();

    // Handle database errors
    if (fetchError) {
      throw new Error(`Database error fetching record: ${fetchError.message}`);
    }

    // Handle orphaned queue items (record was deleted from source table)
    if (!record) {
      console.warn(`⚠️ Record not found in ${source_table}:${source_id} - likely deleted. Skipping embedding.`);
      return new Response(
        JSON.stringify({ 
          message: "Record not found - skipping embedding",
          source_table,
          source_id,
          success: true  // Mark as success so queue item gets completed
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Extract relevant text based on table type
    let textContent = "";
    const metadata: any = {
      created_at: record.created_at,
      log_type: source_table,
    };

    switch (source_table) {
      case "incident_logs":
        textContent = `
          Incident Log - ${record.incident_date} at ${record.incident_time}
          Type: ${record.incident_type}
          Severity: ${record.severity}
          Location: ${record.location}
          Description: ${record.behavior_description}
          ${record.antecedent ? `Antecedent: ${record.antecedent}` : ""}
          ${record.consequence ? `Consequence: ${record.consequence}` : ""}
          ${record.intervention_used ? `Intervention: ${record.intervention_used}` : ""}
          ${record.follow_up_notes ? `Follow-up: ${record.follow_up_notes}` : ""}
        `;
        metadata.incident_date = record.incident_date;
        metadata.incident_type = record.incident_type;
        metadata.severity = record.severity;
        break;

      case "parent_logs":
        textContent = `
          Parent Log - ${record.log_date} at ${record.log_time}
          Activity: ${record.activity_type}
          Location: ${record.location}
          ${record.mood ? `Mood: ${record.mood}` : ""}
          Observation: ${record.observation}
          ${record.successes ? `Successes: ${record.successes}` : ""}
          ${record.challenges ? `Challenges: ${record.challenges}` : ""}
          ${record.strategies_used ? `Strategies: ${record.strategies_used}` : ""}
          ${record.notes ? `Notes: ${record.notes}` : ""}
        `;
        metadata.log_date = record.log_date;
        metadata.mood = record.mood;
        break;

      case "educator_logs":
        textContent = `
          Educator Log - ${record.log_date}
          Educator: ${record.educator_name} (${record.educator_role})
          Type: ${record.log_type}
          ${record.lesson_topic ? `Lesson: ${record.lesson_topic}` : ""}
          ${record.progress_notes ? `Progress: ${record.progress_notes}` : ""}
          ${record.behavioral_observations ? `Behavior: ${record.behavioral_observations}` : ""}
          ${record.challenges ? `Challenges: ${record.challenges}` : ""}
          ${record.goals_for_next_session ? `Next Goals: ${record.goals_for_next_session}` : ""}
          ${record.accuracy_percentage ? `Accuracy: ${record.accuracy_percentage}%` : ""}
        `;
        metadata.log_date = record.log_date;
        metadata.educator_role = record.educator_role;
        break;

      case "sleep_records":
        textContent = `
          Sleep Record - ${record.sleep_date}
          Bedtime: ${record.bedtime}, Wake Time: ${record.wake_time}
          Total Sleep: ${record.total_sleep_hours} hours
          Quality Rating: ${record.sleep_quality_rating}/5
          ${record.nap_taken ? `Nap Duration: ${record.nap_duration_minutes} minutes` : "No nap"}
          ${record.notes ? `Notes: ${record.notes}` : ""}
        `;
        metadata.sleep_date = record.sleep_date;
        metadata.sleep_quality = record.sleep_quality_rating;
        break;

      case "documents":
        textContent = `
          Document - ${record.file_name}
          Category: ${record.category}
          Date: ${record.document_date || "Not specified"}
          ${record.extracted_content || "No content extracted"}
        `;
        metadata.document_category = record.category;
        metadata.document_date = record.document_date;
        break;

      default:
        throw new Error(`Unknown source table: ${source_table}`);
    }

    textContent = textContent.trim();

    if (!textContent || textContent.length < 20) {
      console.warn(`⚠️ Insufficient content for embedding from ${source_table}:${source_id}`);
      return new Response(
        JSON.stringify({ message: "Insufficient content for embedding" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Chunk the text using shared helper (max ~8000 chars per chunk)
    const chunks = sharedChunkText(textContent, 8000);
    console.log(`📦 Created ${chunks.length} chunks for ${source_table}:${source_id}`);

    let embeddingsCreated = 0;
    let failedChunks = 0;
    const EMBEDDING_TIMEOUT = 25000; // 25 seconds per chunk

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        console.log(`🔄 Processing chunk ${i + 1}/${chunks.length}...`);
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Embedding API timeout')), EMBEDDING_TIMEOUT)
        );
        
        // Race between embedding generation and timeout
        const embedding = await Promise.race([
          createEmbedding(chunk, { retries: 3, retryDelay: 1000 }),
          timeoutPromise
        ]);

        // Insert embedding
        const { error: insertError } = await supabase
          .from("family_data_embeddings")
          .insert({
            family_id: record.family_id,
            student_id: record.student_id,
            source_table,
            source_id,
            chunk_text: chunk,
            embedding: JSON.stringify(embedding),
            metadata,
          });

        if (insertError) {
          console.error(`❌ Error inserting embedding for chunk ${i + 1}:`, insertError);
          failedChunks++;
        } else {
          embeddingsCreated++;
          console.log(`✅ Created embedding ${embeddingsCreated}/${chunks.length} for ${source_table}:${source_id}`);
        }

        // Rate limiting between chunks (200ms delay)
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (embeddingError) {
        console.error(`❌ Failed to create embedding for chunk ${i + 1}:`, embeddingError);
        
        // Log specific timeout errors
        if (embeddingError instanceof Error && embeddingError.message === 'Embedding API timeout') {
          console.error(`⏱️ Chunk ${i + 1} timed out after ${EMBEDDING_TIMEOUT}ms`);
        }
        
        failedChunks++;
        // Continue processing other chunks even if one fails
      }
    }

    // Return partial success if any chunks succeeded
    const success = embeddingsCreated > 0;
    const statusCode = success ? 200 : 500;
    
    console.log(`✅ Embedding completed: ${embeddingsCreated}/${chunks.length} chunks successful, ${failedChunks} failed`);
    
    return new Response(
      JSON.stringify({
        message: success 
          ? `Created ${embeddingsCreated} embeddings (${failedChunks} failed)` 
          : "All chunks failed to embed",
        chunks: chunks.length,
        embeddings_created: embeddingsCreated,
        failed: failedChunks,
        success,
      }),
      { 
        status: statusCode,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error in embed-family-data:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
