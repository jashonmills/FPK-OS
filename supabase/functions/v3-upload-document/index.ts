import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get auth user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('❌ Auth error:', userError);
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📤 V3 Upload request from user: ${user.id}`);

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const familyId = formData.get('family_id') as string;
    const studentId = formData.get('student_id') as string | null;
    const category = formData.get('category') as string;

    if (!file || !familyId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`  📄 File: ${file.name} (${Math.round(file.size / 1024)}KB)`);
    console.log(`  👨‍👩‍👧 Family: ${familyId}`);

    // Verify user is a member of the family
    const { data: membership, error: membershipError } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', familyId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      console.error('❌ Not a family member');
      return new Response(
        JSON.stringify({ success: false, error: 'Not authorized for this family' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create unique file path: v3-documents/{familyId}/{timestamp}_{filename}
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${familyId}/${timestamp}_${sanitizedFilename}`;

    console.log(`  💾 Uploading to: ${filePath}`);

    // Upload to storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('v3-documents')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Storage upload failed:', uploadError);
      return new Response(
        JSON.stringify({ success: false, error: `Upload failed: ${uploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`  ✅ File uploaded successfully`);

    // Create v3_documents record with status 'uploaded'
    const { data: document, error: dbError } = await supabase
      .from('v3_documents')
      .insert({
        family_id: familyId,
        student_id: studentId,
        uploaded_by: user.id,
        file_name: file.name,
        file_path: uploadData.path,
        file_size_kb: Math.round(file.size / 1024),
        category: category || 'general',
        status: 'uploaded' // CRITICAL: Status is 'uploaded', NOT triggering any analysis
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database insert failed:', dbError);
      
      // Clean up uploaded file
      await supabase.storage.from('v3-documents').remove([filePath]);
      
      return new Response(
        JSON.stringify({ success: false, error: `Database error: ${dbError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`  📝 Document record created: ${document.id}`);
    console.log(`  ✅ V3 upload complete - NO analysis triggered`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        document: {
          id: document.id,
          file_name: document.file_name,
          status: document.status,
          created_at: document.created_at
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
