import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-src 'self'; object-src 'none';",
};

// Content type mappings
const contentTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

// Security: Sanitize file paths to prevent directory traversal
function sanitizePath(path: string): string {
  // Remove any .. sequences and normalize slashes
  return path
    .replace(/\.\./g, '')
    .replace(/\/+/g, '/')
    .replace(/^\//, '');
}

// Get content type from file extension
function getContentType(filename: string): string {
  const ext = filename.toLowerCase().match(/\.[^.]*$/)?.[0];
  return ext ? (contentTypes[ext] || 'application/octet-stream') : 'application/octet-stream';
}

// Check if user has access to package
async function checkPackageAccess(supabaseClient: any, packageId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseClient
      .from('scorm_packages')
      .select(`
        id,
        created_by,
        is_public,
        scorm_enrollments!inner(user_id)
      `)
      .eq('id', packageId)
      .or(`created_by.eq.${userId},is_public.eq.true,scorm_enrollments.user_id.eq.${userId}`)
      .limit(1)
      .maybeSingle();

    return !error && !!data;
  } catch {
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Expected path: /scorm-content/{packageId}/{...filePath}
    if (pathParts.length < 2 || pathParts[0] !== 'scorm-content') {
      return new Response('Invalid path', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const packageId = pathParts[1];
    const filePath = pathParts.slice(2).join('/') || 'index.html';
    const sanitizedPath = sanitizePath(filePath);

    console.log(`SCORM Content Server: ${packageId}/${sanitizedPath}`);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from auth context
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    // For public packages, allow unauthenticated access
    if (!user && !authError) {
      // Check if package is public
      const { data: publicPackage } = await supabaseClient
        .from('scorm_packages')
        .select('id')
        .eq('id', packageId)
        .eq('is_public', true)
        .single();
      
      if (!publicPackage) {
        return new Response('Authentication required', { 
          status: 401, 
          headers: corsHeaders 
        });
      }
    }

    // Check access permissions for authenticated users
    if (user && !(await checkPackageAccess(supabaseClient, packageId, user.id))) {
      return new Response('Access denied', { 
        status: 403, 
        headers: corsHeaders 
      });
    }

    // Get package details
    const { data: packageData, error: packageError } = await supabaseClient
      .from('scorm_packages')
      .select('extract_path, status')
      .eq('id', packageId)
      .single();

    if (packageError || !packageData) {
      return new Response('Package not found', { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    if (packageData.status !== 'ready') {
      return new Response('Package not ready', { 
        status: 503, 
        headers: corsHeaders 
      });
    }

    // In a real implementation, you would fetch the file from storage
    // For now, we'll return a basic SCORM content wrapper
    if (sanitizedPath === 'index.html' || sanitizedPath === '') {
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SCORM Content</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .api-status {
      background: #e8f5e8;
      border: 1px solid #4caf50;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .api-error {
      background: #ffeaa7;
      border: 1px solid #fdcb6e;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    button {
      background: #007cba;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin: 5px;
    }
    button:hover {
      background: #005a8b;
    }
    #debug {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 10px;
      margin-top: 20px;
      font-family: monospace;
      font-size: 12px;
      max-height: 200px;
      overflow-y: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SCORM Test Content</h1>
    <div id="api-status" class="api-status" style="display: none;">
      ✓ SCORM API Connected
    </div>
    <div id="api-error" class="api-error" style="display: none;">
      ⚠ SCORM API Not Found
    </div>
    
    <div>
      <h3>SCORM Controls</h3>
      <button onclick="testInitialize()">Initialize</button>
      <button onclick="testSetValue()">Set Score</button>
      <button onclick="testCommit()">Commit</button>
      <button onclick="testTerminate()">Terminate</button>
    </div>
    
    <div id="debug"></div>
  </div>

  <script>
  let scormAPI = null;
  let debugLog = [];

  function log(message) {
    debugLog.push(new Date().toLocaleTimeString() + ': ' + message);
    document.getElementById('debug').innerHTML = debugLog.slice(-20).join('<br>');
  }

  // SCORM API Discovery
  function findAPI() {
    let api = null;
    
    // Check current window
    if (window.API_1484_11) {
      api = window.API_1484_11;
      log('Found SCORM 2004 API in current window');
    } else if (window.API) {
      api = window.API;
      log('Found SCORM 1.2 API in current window');
    }
    
    // Check parent windows
    let win = window.parent;
    let attempts = 0;
    while (!api && win && win !== window && attempts < 10) {
      try {
        if (win.API_1484_11) {
          api = win.API_1484_11;
          log('Found SCORM 2004 API in parent window');
          break;
        }
        if (win.API) {
          api = win.API;
          log('Found SCORM 1.2 API in parent window');
          break;
        }
        if (win.parent && win.parent !== win) {
          win = win.parent;
        } else {
          break;
        }
        attempts++;
      } catch (e) {
        log('Error accessing parent window: ' + e.message);
        break;
      }
    }
    
    return api;
  }

  function testInitialize() {
    if (!scormAPI) {
      log('ERROR: No SCORM API available');
      return;
    }
    
    const result = scormAPI.Initialize ? scormAPI.Initialize('') : scormAPI.LMSInitialize('');
    log('Initialize result: ' + result);
    
    if (result === 'true') {
      const studentName = scormAPI.GetValue ? 
        scormAPI.GetValue('cmi.learner_name') : 
        scormAPI.LMSGetValue('cmi.core.student_name');
      log('Student name: ' + studentName);
    }
  }

  function testSetValue() {
    if (!scormAPI) {
      log('ERROR: No SCORM API available');
      return;
    }
    
    const score = Math.floor(Math.random() * 100);
    const result = scormAPI.SetValue ? 
      scormAPI.SetValue('cmi.score.raw', score.toString()) :
      scormAPI.LMSSetValue('cmi.core.score.raw', score.toString());
    log('Set score ' + score + ', result: ' + result);
    
    const status = scormAPI.SetValue ? 
      scormAPI.SetValue('cmi.completion_status', 'completed') :
      scormAPI.LMSSetValue('cmi.core.lesson_status', 'completed');
    log('Set completion status, result: ' + status);
  }

  function testCommit() {
    if (!scormAPI) {
      log('ERROR: No SCORM API available');
      return;
    }
    
    const result = scormAPI.Commit ? scormAPI.Commit('') : scormAPI.LMSCommit('');
    log('Commit result: ' + result);
  }

  function testTerminate() {
    if (!scormAPI) {
      log('ERROR: No SCORM API available');
      return;
    }
    
    const result = scormAPI.Terminate ? scormAPI.Terminate('') : scormAPI.LMSFinish('');
    log('Terminate result: ' + result);
  }

  // Initialize on page load
  window.onload = function() {
    log('SCORM Test Content Loaded');
    scormAPI = findAPI();
    
    if (scormAPI) {
      document.getElementById('api-status').style.display = 'block';
      log('SCORM API Found and Ready');
    } else {
      document.getElementById('api-error').style.display = 'block';
      log('No SCORM API found - running in standalone mode');
    }
  };
  </script>
</body>
</html>`;

      return new Response(htmlContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }

    // For other file types, return appropriate response
    // In production, you would fetch from Supabase Storage
    return new Response('File not found', { 
      status: 404, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('SCORM Content Server error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});