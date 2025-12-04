import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Piston API for code execution
const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

// Language configurations for Piston
const LANGUAGE_CONFIG: Record<string, { language: string; version: string }> = {
  java: { language: 'java', version: '15.0.2' },
  python: { language: 'python', version: '3.10.0' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  ruby: { language: 'ruby', version: '3.0.1' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language } = await req.json();
    
    console.log(`[run-code] Executing ${language} code`);
    
    if (!code || !language) {
      return new Response(
        JSON.stringify({ error: 'Missing code or language parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const langConfig = LANGUAGE_CONFIG[language.toLowerCase()];
    if (!langConfig) {
      return new Response(
        JSON.stringify({ error: `Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_CONFIG).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Piston API
    const pistonResponse = await fetch(PISTON_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [{ name: `main.${language}`, content: code }],
        stdin: '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
      }),
    });

    if (!pistonResponse.ok) {
      const errorText = await pistonResponse.text();
      console.error(`[run-code] Piston API error: ${pistonResponse.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Execution service error: ${pistonResponse.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await pistonResponse.json();
    console.log(`[run-code] Piston result:`, JSON.stringify(result));

    // Format output
    let output = '';
    let hasError = false;

    // Check for compile errors
    if (result.compile && result.compile.stderr) {
      output += `Compilation Error:\n${result.compile.stderr}\n`;
      hasError = true;
    }

    // Add run output
    if (result.run) {
      if (result.run.stdout) {
        output += result.run.stdout;
      }
      if (result.run.stderr) {
        output += `\nRuntime Error:\n${result.run.stderr}`;
        hasError = true;
      }
      if (result.run.signal) {
        output += `\nProcess terminated with signal: ${result.run.signal}`;
        hasError = true;
      }
    }

    if (!output.trim()) {
      output = 'Code executed successfully (no output)';
    }

    return new Response(
      JSON.stringify({ 
        output: output.trim(),
        success: !hasError,
        executionTime: result.run?.time || 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[run-code] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
