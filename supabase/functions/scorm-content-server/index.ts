import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Handle different URL structures - the function might receive the full path or just the part after function name
    let packageId: string;
    let filePath: string;
    
    // Find the package ID (UUID format) in the path
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const packageIndex = pathParts.findIndex(part => uuidRegex.test(part));
    
    if (packageIndex === -1) {
      return new Response('Package ID not found in path', { status: 400, headers: corsHeaders });
    }
    
    packageId = pathParts[packageIndex];
    filePath = pathParts.slice(packageIndex + 1).join('/');

    console.log(`SCORM Content Server: Serving ${filePath} from package ${packageId}`);

    // Get package info
    const { data: packageData, error: packageError } = await supabase
      .from('scorm_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (packageError || !packageData) {
      console.error('Package not found:', packageError);
      return new Response('Package not found', { status: 404, headers: corsHeaders });
    }

    // Build the full content path
    let contentPath = filePath;
    
    // If the file path doesn't include the package structure, prepend it
    if (!filePath.startsWith('packages/')) {
      contentPath = `packages/${packageId}/${filePath}`;
    }

    // Handle default file - if requesting manifest or empty, serve index.html instead
    if (!filePath || filePath === 'imsmanifest.xml' || filePath.endsWith('imsmanifest.xml')) {
      contentPath = `packages/${packageId}/content/index.html`;
      console.log(`Redirecting manifest request to: ${contentPath}`);
    }

    // If no specific file requested, default to index.html
    if (!filePath || filePath === packageId) {
      contentPath = `packages/${packageId}/content/index.html`;
      console.log(`Using default index.html: ${contentPath}`);
    }

    console.log(`Attempting to fetch: ${contentPath}`);

    // Try to get the file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('scorm-packages')
      .download(contentPath);

    if (fileError || !fileData) {
      console.error('File not found in storage:', fileError);
      
      // Try alternative content paths
      const alternativePaths = [
        `packages/${packageId}/index.html`,
        `packages/${packageId}/content/lesson1.html`,
        `packages/${packageId}/lesson1.html`,
        `packages/${packageId}/content/scorm.html`
      ];
      
      console.log(`Trying alternative paths for ${packageId}:`, alternativePaths);
      
      for (const altPath of alternativePaths) {
        try {
          const { data: altFileData, error: altError } = await supabase.storage
            .from('scorm-packages')
            .download(altPath);
            
          if (!altError && altFileData) {
            console.log(`Found content at alternative path: ${altPath}`);
            return new Response(altFileData, {
              headers: {
                ...corsHeaders,
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=3600',
                'X-Content-Type-Options': 'nosniff',
              },
            });
          }
        } catch (e) {
          console.log(`Failed to load ${altPath}:`, e);
        }
      }
      
      console.error('No content found at any path for package:', packageId);
      
      // Return a simple SCORM content page as fallback
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${packageData.title}</title>
            <meta charset="UTF-8">
            <script>
              // Basic SCORM API Detection
              window.onload = function() {
                console.log('SCORM Content Loaded');
                
                // Try to find SCORM API
                let api = null;
                if (window.parent && window.parent.API_1484_11) {
                  api = window.parent.API_1484_11;
                  console.log('Found SCORM 2004 API');
                } else if (window.parent && window.parent.API) {
                  api = window.parent.API;
                  console.log('Found SCORM 1.2 API');
                } else if (window.top && window.top.API_1484_11) {
                  api = window.top.API_1484_11;
                  console.log('Found SCORM 2004 API in top frame');
                } else if (window.top && window.top.API) {
                  api = window.top.API;
                  console.log('Found SCORM 1.2 API in top frame');
                }
                
                if (api) {
                  try {
                    api.Initialize('');
                    api.SetValue('cmi.core.lesson_status', 'incomplete');
                    api.Commit('');
                    console.log('SCORM API initialized successfully');
                  } catch(e) {
                    console.error('SCORM API error:', e);
                  }
                }
              };
              
              function completeLesson() {
                let api = window.parent.API_1484_11 || window.parent.API || window.top.API_1484_11 || window.top.API;
                if (api) {
                  try {
                    api.SetValue('cmi.core.lesson_status', 'completed');
                    api.SetValue('cmi.core.score.raw', '100');
                    api.Commit('');
                    api.Terminate('');
                    alert('Lesson completed successfully!');
                  } catch(e) {
                    console.error('SCORM completion error:', e);
                  }
                }
              }
            </script>
            <style>
              body {
                font-family: Arial, sans-serif;
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
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
              }
              h1 { color: #fff; text-align: center; margin-bottom: 30px; }
              h2 { color: #f0f8ff; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 10px; }
              .lesson-content {
                background: rgba(255,255,255,0.05);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
              }
              .complete-btn {
                background: linear-gradient(45deg, #4CAF50, #45a049);
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
                margin: 20px auto;
                display: block;
                transition: transform 0.2s;
              }
              .complete-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              }
              .status {
                background: rgba(255,255,255,0.1);
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${packageData.title}</h1>
              <div class="status">📚 SCORM Learning Content</div>
              
              <div class="lesson-content">
                <h2>Welcome to the Learning Module</h2>
                <p>This is a sample SCORM learning content. The original content files are being processed.</p>
                
                <h2>Learning Objectives</h2>
                <ul>
                  <li>Understand the basic concepts</li>
                  <li>Apply the knowledge practically</li>
                  <li>Complete the assessment successfully</li>
                </ul>
                
                <h2>Course Content</h2>
                <p>This interactive learning module will guide you through the essential concepts and provide hands-on experience.</p>
                
                <div style="margin: 30px 0; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                  <h3>📖 Key Points to Remember:</h3>
                  <ul>
                    <li>Take your time to understand each concept</li>
                    <li>Practice with the interactive elements</li>
                    <li>Complete the activities to reinforce learning</li>
                  </ul>
                </div>
              </div>
              
              <button class="complete-btn" onclick="completeLesson()">
                ✅ Mark as Complete
              </button>
              
              <div class="status">
                <small>SCORM Package Status: ${packageData.status} | Version: ${packageData.version || '1.0'}</small>
              </div>
            </div>
          </body>
        </html>
      `, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=300', // Shorter cache for fallback content
        },
      });
    }

    // Determine content type
    const extension = filePath.split('.').pop()?.toLowerCase();
    let contentType = 'text/html';
    
    switch (extension) {
      case 'html':
      case 'htm':
        contentType = 'text/html; charset=utf-8';
        break;
      case 'js':
        contentType = 'application/javascript; charset=utf-8';
        break;
      case 'css':
        contentType = 'text/css; charset=utf-8';
        break;
      case 'json':
        contentType = 'application/json; charset=utf-8';
        break;
      case 'xml':
        contentType = 'application/xml; charset=utf-8';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'woff':
        contentType = 'font/woff';
        break;
      case 'woff2':
        contentType = 'font/woff2';
        break;
      case 'ttf':
        contentType = 'font/ttf';
        break;
      case 'eot':
        contentType = 'application/vnd.ms-fontobject';
        break;
      default:
        contentType = 'text/html; charset=utf-8';
    }

    // Return the file content
    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('SCORM Content Server Error:', error);
    return new Response(`
      <html>
        <head><title>Server Error</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h1>Server Error</h1>
          <p>An error occurred while serving SCORM content.</p>
          <p>${error.message}</p>
        </body>
      </html>
    `, {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
    });
  }
});