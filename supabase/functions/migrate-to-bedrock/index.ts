import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { familyId } = await req.json();

    if (!familyId) {
      throw new Error('familyId is required');
    }

    console.log(`Starting migration for family ${familyId}`);

    // Fetch all documents from legacy system for this family
    const { data: legacyDocs, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('family_id', familyId);

    if (fetchError) {
      console.error('Error fetching legacy documents:', fetchError);
      throw fetchError;
    }

    if (!legacyDocs || legacyDocs.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No documents to migrate',
          migrated: 0,
          skipped: 0,
          failed: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${legacyDocs.length} documents to migrate`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;
    const errors: any[] = [];

    for (const doc of legacyDocs) {
      try {
        // Check if document already exists in bedrock_documents
        const { data: existing } = await supabase
          .from('bedrock_documents')
          .select('id')
          .eq('family_id', doc.family_id)
          .eq('file_name', doc.file_name)
          .single();

        if (existing) {
          console.log(`Skipping ${doc.file_name} - already migrated`);
          skipped++;
          continue;
        }

        // Determine status based on analysis state
        let status = 'uploaded';
        if (doc.last_analyzed_at) {
          status = 'completed';
        }

        // Map legacy document to bedrock format
        const bedrockDoc = {
          family_id: doc.family_id,
          student_id: doc.student_id,
          file_name: doc.file_name,
          file_path: doc.file_path,
          file_size_kb: doc.file_size_kb,
          category: doc.category || 'general',
          status: status,
          extracted_content: doc.extracted_content,
          analysis_data: doc.metadata || null,
          analyzed_at: doc.last_analyzed_at,
          created_at: doc.created_at,
        };

        // Insert into bedrock_documents
        const { error: insertError } = await supabase
          .from('bedrock_documents')
          .insert(bedrockDoc);

        if (insertError) {
          console.error(`Error migrating ${doc.file_name}:`, insertError);
          errors.push({ file_name: doc.file_name, error: insertError.message });
          failed++;
        } else {
          console.log(`Successfully migrated ${doc.file_name}`);
          migrated++;
        }
      } catch (error) {
        console.error(`Error processing ${doc.file_name}:`, error);
        errors.push({ file_name: doc.file_name, error: error instanceof Error ? error.message : 'Unknown error' });
        failed++;
      }
    }

    const summary = {
      success: true,
      message: `Migration complete: ${migrated} migrated, ${skipped} skipped, ${failed} failed`,
      migrated,
      skipped,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log('Migration summary:', summary);

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Migration error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
