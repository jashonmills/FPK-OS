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
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { source_table, source_id } = await req.json();

    console.log(`Embedding data from ${source_table} with ID: ${source_id}`);

    // Fetch the source record
    const { data: record, error: fetchError } = await supabase
      .from(source_table)
      .select("*")
      .eq("id", source_id)
      .single();

    if (fetchError || !record) {
      throw new Error(`Failed to fetch record: ${fetchError?.message}`);
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
          ${record.nighttime_awakenings ? `Awakenings: ${record.nighttime_awakenings}` : ""}
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
      console.warn(`Insufficient content for embedding from ${source_table}:${source_id}`);
      return new Response(
        JSON.stringify({ message: "Insufficient content for embedding" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Chunk the text
    const chunks = chunkText(textContent, 500);
    console.log(`Created ${chunks.length} chunks for ${source_table}:${source_id}`);

    let embeddingsCreated = 0;

    for (const chunk of chunks) {
      // Generate embedding
      const embeddingResponse = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: chunk,
          model: "text-embedding-3-small",
        }),
      });

      if (!embeddingResponse.ok) {
        console.error(`Embedding API error for ${source_table}:${source_id}`);
        continue;
      }

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data[0].embedding;

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
        console.error(`Error inserting embedding:`, insertError);
      } else {
        embeddingsCreated++;
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return new Response(
      JSON.stringify({
        message: "Family data embedded successfully",
        chunks: chunks.length,
        embeddings_created: embeddingsCreated,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in embed-family-data:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function chunkText(text: string, maxTokens: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+\s+/);
  let currentChunk = "";
  let currentTokens = 0;

  for (const sentence of sentences) {
    const sentenceTokens = Math.ceil(sentence.length / 4);

    if (currentTokens + sentenceTokens > maxTokens && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
      currentTokens = 0;
    }

    currentChunk += sentence + ". ";
    currentTokens += sentenceTokens;
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text];
}
