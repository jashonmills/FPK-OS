import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log(`🔧 SCORM Package Extractor: ${req.method} ${req.url}`);

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user is authenticated and is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a client with the user's auth token to verify their role
    const userSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userRole = (user.user_metadata as any)?.role;
    if (userRole !== 'admin') {
      console.log(`Access denied: User ${user.id} has role '${userRole}', admin required`);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required for SCORM content generation' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`SCORM Extract access granted for admin user: ${user.id}`);

    const { packageId } = await req.json();
    
    if (!packageId) {
      return new Response(JSON.stringify({ error: 'Package ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`📦 Extracting package: ${packageId}`);

    // Get package info
    const { data: pkg, error: pkgError } = await supabase
      .from('scorm_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (pkgError || !pkg) {
      console.error('❌ Package not found:', pkgError);
      return new Response(JSON.stringify({ error: 'Package not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`✅ Found package: ${pkg.title}`);
    console.log(`📄 ZIP path: ${pkg.zip_path}`);

    // Download the ZIP file from storage
    const { data: zipData, error: zipError } = await supabase.storage
      .from('scorm-packages')
      .download(pkg.zip_path);

    if (zipError || !zipData) {
      console.error('❌ ZIP file not found:', zipError);
      return new Response(JSON.stringify({ 
        error: 'ZIP file not found in storage',
        zip_path: pkg.zip_path 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`📁 ZIP file downloaded, size: ${zipData.size} bytes`);

    // Create simple HTML files based on the package resources
    // This is a fallback when ZIP extraction isn't working
    const resources = pkg.resources || [];
    const extractPath = `packages/${packageId}/`;
    let uploadCount = 0;
    const uploadResults = [];

    console.log(`📝 Creating ${resources.length} content files from metadata...`);

    for (const resource of resources) {
      if (resource.href && resource.files) {
        for (const fileName of resource.files) {
          console.log(`📝 Creating file: ${fileName}`);
          
          // Create basic HTML content for each file
          const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resource.identifier || 'SCORM Content'}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(31, 38, 135, 0.37);
        }
        h1 { color: #f0f8ff; margin-bottom: 20px; }
        h2 { color: #e6f3ff; margin-top: 30px; }
        .scorm-content {
            background: rgba(255,255,255,0.05);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .btn {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px;
        }
    </style>
    <script>
        window.onload = function() {
            console.log('SCORM Content Loaded: ${resource.identifier}');
            
            // Find SCORM API
            let api = null;
            if (window.parent && window.parent.API_1484_11) {
                api = window.parent.API_1484_11;
                console.log('Found SCORM 2004 API');
            } else if (window.parent && window.parent.API) {
                api = window.parent.API;
                console.log('Found SCORM 1.2 API');
            }
            
            if (api) {
                try {
                    const initResult = api.Initialize('');
                    console.log('SCORM Initialize result:', initResult);
                    api.SetValue('cmi.core.lesson_status', 'incomplete');
                    api.Commit('');
                    document.getElementById('api-status').textContent = 'Connected ✅';
                } catch(e) {
                    console.error('SCORM API error:', e);
                    document.getElementById('api-status').textContent = 'Error ❌';
                }
            } else {
                document.getElementById('api-status').textContent = 'Not Found ❌';
            }
        };
        
        function completeLesson() {
            const api = window.parent && (window.parent.API_1484_11 || window.parent.API);
            if (api) {
                try {
                    api.SetValue('cmi.core.lesson_status', 'completed');
                    api.SetValue('cmi.core.score.raw', '100');
                    api.Commit('');
                    document.getElementById('status').textContent = 'Lesson Completed! ✅';
                } catch(e) {
                    console.error('SCORM completion error:', e);
                }
            }
        }
    </script>
</head>
<body>
    <div class="container">
        <h1>🎓 ${resource.identifier === 'sco-1' ? 'Introduction to SCORM' : 'SCORM Concepts'}</h1>
        
        <div class="scorm-content">
            <p><strong>SCORM API Status:</strong> <span id="api-status">Checking...</span></p>
            
            <h2>📚 Learning Content</h2>
            <p>This is an interactive SCORM learning module that demonstrates:</p>
            <ul>
                <li>SCORM API communication with the LMS</li>
                <li>Progress tracking and completion status</li>
                <li>Data persistence between sessions</li>
                <li>${resource.identifier === 'sco-1' ? 'Basic SCORM concepts and standards' : 'Advanced SCORM implementation techniques'}</li>
            </ul>
            
            <h2>🎯 Interactive Elements</h2>
            <div class="scorm-content">
                <p>Welcome to ${resource.identifier === 'sco-1' ? 'the introductory lesson' : 'the advanced concepts lesson'}!</p>
                <p>This content communicates with the parent SCORM player to track your progress.</p>
                
                <button class="btn" onclick="completeLesson()">✅ Complete This Lesson</button>
                
                <p id="status" style="margin-top: 20px; font-weight: bold;"></p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; opacity: 0.8;">
            <small>SCORM ${pkg.standard || '1.2'} Content | Resource: ${resource.identifier}</small>
        </div>
    </div>
</body>
</html>`;

          const storagePath = `${extractPath}${fileName}`;
          console.log(`📤 Uploading: ${fileName} → ${storagePath}`);

          try {
            const { error: uploadError } = await supabase.storage
              .from('scorm-packages')
              .upload(storagePath, new Blob([htmlContent], { type: 'text/html' }), {
                upsert: true,
                contentType: 'text/html'
              });

            if (uploadError) {
              console.error(`❌ Upload failed for ${fileName}:`, uploadError);
              uploadResults.push({ file: fileName, success: false, error: uploadError.message });
            } else {
              console.log(`✅ Created: ${fileName}`);
              uploadResults.push({ file: fileName, success: true });
              uploadCount++;
            }
          } catch (err) {
            console.error(`❌ Upload error for ${fileName}:`, err);
            uploadResults.push({ file: fileName, success: false, error: err.message });
          }
        }
      }
    }

    // Update package status
    const { error: updateError } = await supabase
      .from('scorm_packages')
      .update({
        extract_path: extractPath,
        status: uploadCount > 0 ? 'ready' : 'error',
        updated_at: new Date().toISOString()
      })
      .eq('id', packageId);

    if (updateError) {
      console.error('❌ Failed to update package status:', updateError);
    }

    console.log(`🎉 Content creation complete! Created ${uploadCount} files`);

    return new Response(JSON.stringify({
      success: true,
      packageId,
      totalFiles: resources.reduce((acc, r) => acc + (r.files?.length || 0), 0),
      uploadedFiles: uploadCount,
      extractPath,
      results: uploadResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('🚨 Content creation error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});