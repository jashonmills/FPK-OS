import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text = "This is a test embedding" } = await req.json();
    
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Testing embedding generation...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-3-small",
      }),
    });

    if (response.status === 429) {
      throw new Error("Rate limit exceeded - please add credits to Lovable AI workspace");
    }

    if (response.status === 402) {
      throw new Error("Payment required - please add credits to Lovable AI workspace");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lovable AI API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.data?.[0]?.embedding) {
      throw new Error("Invalid embedding response format");
    }

    const embedding = data.data[0].embedding;
    const dimensions = embedding.length;

    console.log(`✓ Successfully generated embedding with ${dimensions} dimensions`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Embedding service is working correctly",
        dimensions,
        textLength: text.length,
        sample: embedding.slice(0, 5), // First 5 values
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in test-embedding:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
