import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createEmbedding } from "../_shared/embedding-helper.ts";

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

    const { question, family_id, conversation_id } = await req.json();

    console.log(`Processing question for family ${family_id}: ${question}`);

    // Generate embedding for the question using the shared helper
    let questionEmbedding: number[];
    try {
      questionEmbedding = await createEmbedding(question, { retries: 2 });
    } catch (error) {
      console.error("Failed to generate question embedding:", error);
      throw new Error("Failed to generate question embedding");
    }

    // Parallel vector searches
    const [familyDataResults, clinicalKBResults] = await Promise.all([
      // Search family-specific data
      supabase.rpc("match_family_data", {
        query_embedding: questionEmbedding,
        match_threshold: 0.7,
        match_count: 8,
        p_family_id: family_id,
      }),
      // Search clinical knowledge base
      supabase.rpc("match_kb_chunks", {
        query_embedding: questionEmbedding,
        match_threshold: 0.7,
        match_count: 5,
      }),
    ]);

    console.log("Family data results:", familyDataResults.data?.length || 0);
    console.log("Clinical KB results:", clinicalKBResults.data?.length || 0);

    // Build context from search results
    const familyContext = familyDataResults.data
      ?.map((r: any) => `[From ${r.source_table}] ${r.chunk_text}`)
      .join("\n\n") || "No specific family data found.";

    const clinicalContext = clinicalKBResults.data
      ?.map((r: any) => `[${r.source_name}] ${r.chunk_text}`)
      .join("\n\n") || "No relevant clinical knowledge found.";

    // Construct the system prompt
    const systemPrompt = `You are a specialized AI assistant for a family managing special needs. You have access to two sources of information:

1. **This Family's Private Data**: Includes all their logs (incident logs, parent logs, educator logs, sleep records), uploaded documents (IEPs, evaluations, etc.), and AI-generated insights specific to their situation.

2. **Clinical Knowledge Base**: Includes peer-reviewed research, clinical guidelines from organizations like the CDC and AAP, and evidence-based best practices.

**CRITICAL RULES:**
- You can ONLY answer questions about this specific family's data or general clinical knowledge.
- If asked about topics outside these two areas (e.g., current events, general knowledge, other families), politely decline and remind the user you are specialized for this family's data.
- Always ground your answers in the provided context. Do not make up information.
- When referencing family data, be specific (e.g., "In the incident log from September 15th...").
- When referencing clinical knowledge, cite the source (e.g., "According to CDC guidelines...").
- Be compassionate, supportive, and evidence-based.
- If you don't have enough information to answer, say so clearly.

Your goal is to help this family make informed decisions by connecting their real-world experiences with validated clinical knowledge.`;

    const userMessage = `**Family's Data Context:**
${familyContext}

**Clinical Knowledge Context:**
${clinicalContext}

**User's Question:**
${question}`;

    // Get conversation history if exists
    let conversationHistory: any[] = [];
    if (conversation_id) {
      const { data: messages } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at");

      conversationHistory = messages?.map((m) => ({
        role: m.role,
        content: m.content,
      })) || [];
    }

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const answer = aiData.choices[0].message.content;

    // Prepare sources for transparency
    const sources = [
      ...(familyDataResults.data?.map((r: any) => ({
        type: "family_data",
        source_table: r.source_table,
        source_id: r.source_id,
      })) || []),
      ...(clinicalKBResults.data?.map((r: any) => ({
        type: "clinical_kb",
        source_name: r.source_name,
        kb_id: r.kb_id,
      })) || []),
    ];

    // Store the conversation
    if (conversation_id) {
      // Store user message
      await supabase.from("chat_messages").insert({
        conversation_id,
        role: "user",
        content: question,
      });

      // Store assistant message
      await supabase.from("chat_messages").insert({
        conversation_id,
        role: "assistant",
        content: answer,
        sources,
      });
    }

    return new Response(
      JSON.stringify({
        answer,
        sources,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in chat-with-data:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
