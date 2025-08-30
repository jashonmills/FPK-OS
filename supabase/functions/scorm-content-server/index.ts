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

  console.log(`SCORM Content Server Request: ${req.method} ${req.url}`);

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

    console.log(`Package found: ${packageData.title}, Status: ${packageData.status}`);

    // Always serve interactive SCORM content with proper headers
    const interactiveContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${packageData.title}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>
      // SCORM API Implementation
      window.onload = function() {
        console.log('SCORM Content Loaded: ${packageData.title}');
        
        // Find SCORM API
        let api = null;
        if (window.parent && window.parent.API_1484_11) {
          api = window.parent.API_1484_11;
          console.log('Found SCORM 2004 API');
        } else if (window.parent && window.parent.API) {
          api = window.parent.API;
          console.log('Found SCORM 1.2 API');
        } else if (window.top && window.top.API_1484_11) {
          api = window.top.API_1484_11;
        } else if (window.top && window.top.API) {
          api = window.top.API;
        }
        
        window.scormAPI = api;
        
        if (api) {
          try {
            const initResult = api.Initialize('');
            console.log('SCORM Initialize result:', initResult);
            api.SetValue('cmi.core.lesson_status', 'incomplete');
            api.Commit('');
            
            // Update UI
            document.getElementById('api-status').textContent = 'Connected ✅';
            document.getElementById('api-status').style.color = '#4CAF50';
          } catch(e) {
            console.error('SCORM API error:', e);
            document.getElementById('api-status').textContent = 'Error ❌';
          }
        } else {
          document.getElementById('api-status').textContent = 'Not Found ❌';
        }
      };
      
      function completeLesson() {
        if (window.scormAPI) {
          try {
            window.scormAPI.SetValue('cmi.core.lesson_status', 'completed');
            window.scormAPI.SetValue('cmi.core.score.raw', '100');
            window.scormAPI.Commit('');
            window.scormAPI.Terminate('');
            
            document.getElementById('completion-status').textContent = 'Lesson Completed! ✅';
            document.getElementById('complete-btn').disabled = true;
            document.getElementById('complete-btn').textContent = 'Completed ✓';
          } catch(e) {
            console.error('SCORM completion error:', e);
            document.getElementById('completion-status').textContent = 'Error completing lesson ❌';
          }
        }
      }
      
      function restartLesson() {
        if (window.scormAPI) {
          try {
            window.scormAPI.SetValue('cmi.core.lesson_status', 'incomplete');
            window.scormAPI.Commit('');
            
            document.getElementById('completion-status').textContent = '';
            document.getElementById('complete-btn').disabled = false;
            document.getElementById('complete-btn').textContent = '✅ Complete Lesson';
          } catch(e) {
            console.error('SCORM restart error:', e);
          }
        }
      }
    </script>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        min-height: 100vh;
        padding: 20px;
      }
      .container {
        max-width: 1000px;
        margin: 0 auto;
        background: rgba(255,255,255,0.1);
        border-radius: 20px;
        padding: 40px;
        backdrop-filter: blur(10px);
        box-shadow: 0 20px 40px rgba(31, 38, 135, 0.37);
      }
      h1 {
        text-align: center;
        margin-bottom: 10px;
        font-size: 2.5em;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }
      .subtitle {
        text-align: center;
        opacity: 0.9;
        margin-bottom: 40px;
        font-size: 1.1em;
      }
      .api-status {
        background: rgba(255,255,255,0.1);
        padding: 15px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: center;
        font-weight: bold;
      }
      .lesson-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin: 40px 0;
      }
      .lesson-card {
        background: rgba(255,255,255,0.1);
        border-radius: 15px;
        padding: 25px;
        border: 2px solid rgba(255,255,255,0.2);
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .lesson-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      }
      .lesson-card h3 {
        margin-bottom: 15px;
        color: #f0f8ff;
        font-size: 1.3em;
      }
      .lesson-card p {
        line-height: 1.6;
        opacity: 0.9;
      }
      .controls {
        text-align: center;
        margin: 40px 0;
        display: flex;
        gap: 20px;
        justify-content: center;
        flex-wrap: wrap;
      }
      .btn {
        background: linear-gradient(45deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 30px;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: all 0.3s;
        text-decoration: none;
        display: inline-block;
      }
      .btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      }
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
      .btn-secondary {
        background: linear-gradient(45deg, #FF9800, #F57C00);
      }
      .progress-bar {
        width: 100%;
        height: 10px;
        background: rgba(255,255,255,0.2);
        border-radius: 10px;
        overflow: hidden;
        margin: 20px 0;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #8BC34A);
        border-radius: 10px;
        transition: width 1s ease;
        width: 0%;
      }
      #completion-status {
        text-align: center;
        font-size: 1.2em;
        font-weight: bold;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🎓 ${packageData.title}</h1>
      <p class="subtitle">Interactive SCORM Learning Module</p>
      
      <div class="api-status">
        SCORM API Status: <span id="api-status">Checking...</span>
      </div>
      
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill"></div>
      </div>
      
      <div class="lesson-grid">
        <div class="lesson-card">
          <h3>📚 Learning Objectives</h3>
          <p>Master the fundamental concepts through interactive content and practical exercises designed to enhance your understanding and retention.</p>
        </div>
        
        <div class="lesson-card">
          <h3>🎯 Key Activities</h3>
          <p>Engage with multimedia content, complete knowledge checks, and apply your learning through hands-on activities and real-world scenarios.</p>
        </div>
        
        <div class="lesson-card">
          <h3>📊 Progress Tracking</h3>
          <p>Your progress is automatically tracked and reported to the learning management system for completion and scoring records.</p>
        </div>
        
        <div class="lesson-card">
          <h3>✅ Assessment</h3>
          <p>Demonstrate your knowledge through interactive assessments that provide immediate feedback and support your learning journey.</p>
        </div>
      </div>
      
      <div id="completion-status"></div>
      
      <div class="controls">
        <button id="complete-btn" class="btn" onclick="completeLesson()">
          ✅ Complete Lesson
        </button>
        <button class="btn btn-secondary" onclick="restartLesson()">
          🔄 Restart Lesson
        </button>
      </div>
      
      <div class="api-status">
        <small>Package: ${packageData.title} | Status: ${packageData.status} | Version: ${packageData.version || '1.0'}</small>
      </div>
    </div>
    
    <script>
      // Simulate progress
      setTimeout(() => {
        document.getElementById('progress-fill').style.width = '75%';
      }, 1000);
    </script>
  </body>
</html>`;

    return new Response(interactiveContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Frame-Options': 'ALLOWALL',
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