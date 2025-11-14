import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Parse request body FIRST to check for system triggers
    const { family_id, batch_all = false, limit = 10, system_automated_trigger } = await req.json();

    // If this is a system-automated trigger (cron job), skip authentication
    if (!system_automated_trigger) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("Missing authorization header");
      }

      // Verify user is authenticated
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        throw new Error("Unauthorized");
      }

      if (!family_id) {
        throw new Error("family_id is required");
      }

      // Verify user is member of the family
      const { data: membership, error: memberError } = await supabase
        .from("family_members")
        .select("role")
        .eq("family_id", family_id)
        .eq("user_id", user.id)
        .single();

      if (memberError || !membership) {
        throw new Error("Not authorized for this family");
      }
    }

    let processedCount = 0;
    let failedCount = 0;
    let totalQueued = 0;

    // If batch_all is true, queue all existing data (only for manual family-specific triggers)
    if (batch_all && family_id) {
      console.log(`Batch queuing all data for family ${family_id}`);
      
      // Queue all incident logs
      const { data: incidents } = await supabase
        .from("incident_logs")
        .select("id, family_id, student_id")
        .eq("family_id", family_id);

      if (incidents) {
        for (const incident of incidents) {
          await supabase.from("embedding_queue").insert({
            family_id: incident.family_id,
            student_id: incident.student_id,
            source_table: "incident_logs",
            source_id: incident.id
          });
        }
        totalQueued += incidents.length;
      }

      // Queue all parent logs
      const { data: parentLogs } = await supabase
        .from("parent_logs")
        .select("id, family_id, student_id")
        .eq("family_id", family_id);

      if (parentLogs) {
        for (const log of parentLogs) {
          await supabase.from("embedding_queue").insert({
            family_id: log.family_id,
            student_id: log.student_id,
            source_table: "parent_logs",
            source_id: log.id
          });
        }
        totalQueued += parentLogs.length;
      }

      // Queue all educator logs
      const { data: educatorLogs } = await supabase
        .from("educator_logs")
        .select("id, family_id, student_id")
        .eq("family_id", family_id);

      if (educatorLogs) {
        for (const log of educatorLogs) {
          await supabase.from("embedding_queue").insert({
            family_id: log.family_id,
            student_id: log.student_id,
            source_table: "educator_logs",
            source_id: log.id
          });
        }
        totalQueued += educatorLogs.length;
      }

      // Queue all sleep records
      const { data: sleepRecords } = await supabase
        .from("sleep_records")
        .select("id, family_id, student_id")
        .eq("family_id", family_id);

      if (sleepRecords) {
        for (const record of sleepRecords) {
          await supabase.from("embedding_queue").insert({
            family_id: record.family_id,
            student_id: record.student_id,
            source_table: "sleep_records",
            source_id: record.id
          });
        }
        totalQueued += sleepRecords.length;
      }

      // Queue all documents
      const { data: documents } = await supabase
        .from("documents")
        .select("id, family_id, student_id")
        .eq("family_id", family_id)
        .not("extracted_content", "is", null);

      if (documents) {
        for (const doc of documents) {
          await supabase.from("embedding_queue").insert({
            family_id: doc.family_id,
            student_id: doc.student_id,
            source_table: "documents",
            source_id: doc.id
          });
        }
        totalQueued += documents.length;
      }

      console.log(`Queued ${totalQueued} items for embedding`);
    }

    // Process pending items from queue
    // Build the base query
    let query = supabase
      .from("embedding_queue")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(limit);

    // Conditionally apply the family_id filter for manual triggers
    if (family_id) {
      query = query.eq("family_id", family_id);
    }

    // Execute the dynamically built query
    const { data: queueItems, error: queueError } = await query;

    if (queueError) {
      throw queueError;
    }

    console.log(`Processing ${queueItems?.length || 0} queue items`);

    for (const item of queueItems || []) {
      try {
        // Mark as processing
        await supabase
          .from("embedding_queue")
          .update({ status: "processing" })
          .eq("id", item.id);

        // Call embed-family-data function
        const { data: embedResult, error: embedError } = await supabase.functions.invoke(
          "embed-family-data",
          {
            body: {
              source_table: item.source_table,
              source_id: item.source_id,
            },
          }
        );

        if (embedError) {
          throw embedError;
        }

        // Check if embedding actually succeeded
        const success = embedResult?.success === true && embedResult?.embeddings_created > 0;
        
        if (success) {
          // Mark as completed only if embeddings were created
          await supabase
            .from("embedding_queue")
            .update({ 
              status: "completed",
              processed_at: new Date().toISOString()
            })
            .eq("id", item.id);

          processedCount++;
          console.log(`✅ Successfully processed ${item.source_table}:${item.source_id} - ${embedResult.embeddings_created} embeddings created`);
        } else {
          // Mark as failed if no embeddings were created
          throw new Error(embedResult?.message || "No embeddings created");
        }
        
        // Rate limiting - small delay between API calls
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`Failed to process queue item ${item.id}:`, error);
        
        await supabase
          .from("embedding_queue")
          .update({ 
            status: "failed",
            error_message: error instanceof Error ? error.message : "Unknown error",
            processed_at: new Date().toISOString()
          })
          .eq("id", item.id);
        
        failedCount++;
      }
    }

    // Get updated queue stats
    let statsQuery = supabase
      .from("embedding_queue")
      .select("status");
    
    // Conditionally filter by family_id for manual triggers
    if (family_id) {
      statsQuery = statsQuery.eq("family_id", family_id);
    }
    
    const { data: stats } = await statsQuery;

    const queueStats = {
      pending: stats?.filter(s => s.status === "pending").length || 0,
      processing: stats?.filter(s => s.status === "processing").length || 0,
      completed: stats?.filter(s => s.status === "completed").length || 0,
      failed: stats?.filter(s => s.status === "failed").length || 0,
    };

    // Get total embeddings count
    const { count: embeddingsCount } = await supabase
      .from("family_data_embeddings")
      .select("*", { count: "exact", head: true })
      .eq("family_id", family_id);

    return new Response(
      JSON.stringify({
        success: true,
        batch_queued: totalQueued,
        processed: processedCount,
        failed: failedCount,
        queue_stats: queueStats,
        total_embeddings: embeddingsCount || 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in process-embedding-queue:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
