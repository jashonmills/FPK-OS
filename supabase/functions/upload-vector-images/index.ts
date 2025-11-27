import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Load the generated images from the local assets
    const vectorImages = {
      'vectors_intro.png': await generateVectorIntroImage(),
      'vector_operations.png': await generateVectorOperationsImage(), 
      'cross_product.png': await generateCrossProductImage(),
      'vectors_geometry.png': await generateVectorGeometryImage()
    };

    const results = [];

    for (const [filename, imageData] of Object.entries(vectorImages)) {
      console.log(`Uploading ${filename}...`);
      
      const { data, error } = await supabase.storage
        .from('course-files')
        .upload(`enhanced-geometry/${filename}`, imageData, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/png'
        });

      if (error) {
        console.error(`Error uploading ${filename}:`, error);
        results.push({ filename, success: false, error: error.message });
      } else {
        console.log(`Successfully uploaded ${filename}`);
        results.push({ filename, success: true, path: data.path });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Vector images upload completed',
      results 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload function error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function generateVectorIntroImage(): Promise<Uint8Array> {
  const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
      </linearGradient>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" 
              refX="0" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#1F2937" />
      </marker>
    </defs>
    
    <!-- Background -->
    <rect width="800" height="600" fill="#F8FAFC" />
    
    <!-- Grid -->
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="800" height="600" fill="url(#grid)" />
    
    <!-- Coordinate axes -->
    <line x1="100" y1="300" x2="700" y2="300" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)" />
    <line x1="400" y1="500" x2="400" y2="100" stroke="#374151" stroke-width="2" marker-end="url(#arrowhead)" />
    
    <!-- Axis labels -->
    <text x="720" y="305" font-family="Arial, sans-serif" font-size="18" fill="#374151">x</text>
    <text x="405" y="90" font-family="Arial, sans-serif" font-size="18" fill="#374151">y</text>
    
    <!-- Vector examples -->
    <line x1="400" y1="300" x2="550" y2="200" stroke="#DC2626" stroke-width="4" marker-end="url(#arrowhead)" />
    <line x1="400" y1="300" x2="300" y2="400" stroke="#059669" stroke-width="4" marker-end="url(#arrowhead)" />
    
    <!-- Vector labels -->
    <text x="480" y="240" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#DC2626">v₁</text>
    <text x="340" y="360" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#059669">v₂</text>
    
    <!-- Title -->
    <text x="400" y="50" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
          text-anchor="middle" fill="#1F2937">Vector Introduction</text>
    
    <!-- Magnitude and direction labels -->
    <text x="50" y="550" font-family="Arial, sans-serif" font-size="14" fill="#6B7280">
      Vectors have both magnitude (length) and direction
    </text>
  </svg>`;

  const encoder = new TextEncoder();
  return encoder.encode(svgContent);
}

async function generateVectorOperationsImage(): Promise<Uint8Array> {
  const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="arrowhead2" markerWidth="10" markerHeight="7" 
              refX="0" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#1F2937" />
      </marker>
    </defs>
    
    <!-- Background -->
    <rect width="800" height="600" fill="#F8FAFC" />
    
    <!-- Vector Addition Section -->
    <text x="200" y="40" font-family="Arial, sans-serif" font-size="20" font-weight="bold" 
          text-anchor="middle" fill="#1F2937">Vector Addition: A + B</text>
    
    <!-- Vector A -->
    <line x1="50" y1="150" x2="150" y2="100" stroke="#DC2626" stroke-width="3" marker-end="url(#arrowhead2)" />
    <text x="90" y="115" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#DC2626">A</text>
    
    <!-- Vector B starting from end of A -->
    <line x1="150" y1="100" x2="250" y2="120" stroke="#059669" stroke-width="3" marker-end="url(#arrowhead2)" />
    <text x="205" y="105" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#059669">B</text>
    
    <!-- Resultant vector A + B -->
    <line x1="50" y1="150" x2="250" y2="120" stroke="#7C3AED" stroke-width="4" marker-end="url(#arrowhead2)" />
    <text x="150" y="140" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#7C3AED">A + B</text>
    
    <!-- Scalar Multiplication Section -->
    <text x="200" y="250" font-family="Arial, sans-serif" font-size="20" font-weight="bold" 
          text-anchor="middle" fill="#1F2937">Scalar Multiplication: 2A</text>
    
    <!-- Original vector A -->
    <line x1="50" y1="320" x2="130" y2="290" stroke="#DC2626" stroke-width="3" marker-end="url(#arrowhead2)" />
    <text x="85" y="300" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#DC2626">A</text>
    
    <!-- Scaled vector 2A -->
    <line x1="200" y1="320" x2="360" y2="260" stroke="#F59E0B" stroke-width="4" marker-end="url(#arrowhead2)" />
    <text x="275" y="285" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#F59E0B">2A</text>
    
    <!-- Subtraction Section -->
    <text x="200" y="430" font-family="Arial, sans-serif" font-size="20" font-weight="bold" 
          text-anchor="middle" fill="#1F2937">Vector Subtraction: A - B</text>
    
    <!-- Vector A -->
    <line x1="50" y1="520" x2="150" y2="470" stroke="#DC2626" stroke-width="3" marker-end="url(#arrowhead2)" />
    <text x="90" y="485" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#DC2626">A</text>
    
    <!-- Vector -B (opposite direction) -->
    <line x1="150" y1="470" x2="100" y2="500" stroke="#EF4444" stroke-width="3" marker-end="url(#arrowhead2)" />
    <text x="120" y="495" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#EF4444">-B</text>
    
    <!-- Resultant A - B -->
    <line x1="50" y1="520" x2="100" y2="500" stroke="#8B5CF6" stroke-width="4" marker-end="url(#arrowhead2)" />
    <text x="65" y="515" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#8B5CF6">A - B</text>
    
    <!-- Right side formulas -->
    <rect x="450" y="80" width="300" height="400" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2" rx="8" />
    <text x="600" y="110" font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
          text-anchor="middle" fill="#1F2937">Vector Operations</text>
    
    <text x="470" y="150" font-family="Arial, sans-serif" font-size="14" fill="#374151">Addition:</text>
    <text x="470" y="170" font-family="monospace" font-size="12" fill="#6B7280">(a₁, a₂) + (b₁, b₂) = (a₁+b₁, a₂+b₂)</text>
    
    <text x="470" y="210" font-family="Arial, sans-serif" font-size="14" fill="#374151">Subtraction:</text>
    <text x="470" y="230" font-family="monospace" font-size="12" fill="#6B7280">(a₁, a₂) - (b₁, b₂) = (a₁-b₁, a₂-b₂)</text>
    
    <text x="470" y="270" font-family="Arial, sans-serif" font-size="14" fill="#374151">Scalar Multiplication:</text>
    <text x="470" y="290" font-family="monospace" font-size="12" fill="#6B7280">k(a₁, a₂) = (ka₁, ka₂)</text>
    
    <text x="470" y="330" font-family="Arial, sans-serif" font-size="14" fill="#374151">Magnitude:</text>
    <text x="470" y="350" font-family="monospace" font-size="12" fill="#6B7280">|v| = √(a₁² + a₂²)</text>
  </svg>`;

  const encoder = new TextEncoder();
  return encoder.encode(svgContent);
}

async function generateCrossProductImage(): Promise<Uint8Array> {
  const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="arrowhead3" markerWidth="10" markerHeight="7" 
              refX="0" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#1F2937" />
      </marker>
    </defs>
    
    <!-- Background -->
    <rect width="800" height="600" fill="#F8FAFC" />
    
    <!-- Title -->
    <text x="400" y="40" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
          text-anchor="middle" fill="#1F2937">Cross Product: A × B</text>
    
    <!-- 3D coordinate system -->
    <!-- X-axis -->
    <line x1="200" y1="300" x2="350" y2="300" stroke="#DC2626" stroke-width="3" marker-end="url(#arrowhead3)" />
    <text x="360" y="305" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#DC2626">x</text>
    
    <!-- Y-axis (perspective) -->
    <line x1="200" y1="300" x2="250" y2="230" stroke="#059669" stroke-width="3" marker-end="url(#arrowhead3)" />
    <text x="255" y="225" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#059669">y</text>
    
    <!-- Z-axis (vertical) -->
    <line x1="200" y1="300" x2="200" y2="150" stroke="#2563EB" stroke-width="3" marker-end="url(#arrowhead3)" />
    <text x="205" y="145" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#2563EB">z</text>
    
    <!-- Vector A -->
    <line x1="200" y1="300" x2="320" y2="280" stroke="#F59E0B" stroke-width="4" marker-end="url(#arrowhead3)" />
    <text x="270" y="285" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#F59E0B">A</text>
    
    <!-- Vector B -->
    <line x1="200" y1="300" x2="230" y2="200" stroke="#8B5CF6" stroke-width="4" marker-end="url(#arrowhead3)" />
    <text x="210" y="245" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#8B5CF6">B</text>
    
    <!-- Cross product result (perpendicular) -->
    <line x1="200" y1="300" x2="280" y2="180" stroke="#EC4899" stroke-width="5" marker-end="url(#arrowhead3)" />
    <text x="245" y="235" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#EC4899">A × B</text>
    
    <!-- Right-hand rule illustration -->
    <circle cx="500" cy="200" r="80" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2" />
    <text x="500" y="120" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
          text-anchor="middle" fill="#1F2937">Right-Hand Rule</text>
    
    <!-- Simplified hand illustration -->
    <path d="M 480 180 Q 490 170 500 180 Q 510 170 520 180" stroke="#6B7280" stroke-width="3" fill="none" />
    <text x="500" y="300" font-family="Arial, sans-serif" font-size="12" 
          text-anchor="middle" fill="#6B7280">Fingers: A → B</text>
    <text x="500" y="315" font-family="Arial, sans-serif" font-size="12" 
          text-anchor="middle" fill="#6B7280">Thumb: A × B</text>
    
    <!-- Formula box -->
    <rect x="50" y="400" width="700" height="150" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2" rx="8" />
    <text x="400" y="430" font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
          text-anchor="middle" fill="#1F2937">Cross Product Properties</text>
    
    <text x="70" y="460" font-family="Arial, sans-serif" font-size="14" fill="#374151">• Magnitude: |A × B| = |A| |B| sin(θ)</text>
    <text x="70" y="480" font-family="Arial, sans-serif" font-size="14" fill="#374151">• Direction: Perpendicular to both A and B</text>
    <text x="70" y="500" font-family="Arial, sans-serif" font-size="14" fill="#374151">• Right-hand rule determines direction</text>
    <text x="70" y="520" font-family="Arial, sans-serif" font-size="14" fill="#374151">• A × B = -B × A (anti-commutative)</text>
    
    <text x="400" y="460" font-family="monospace" font-size="12" fill="#6B7280">A × B = (a₂b₃ - a₃b₂, a₃b₁ - a₁b₃, a₁b₂ - a₂b₁)</text>
  </svg>`;

  const encoder = new TextEncoder();
  return encoder.encode(svgContent);
}

async function generateVectorGeometryImage(): Promise<Uint8Array> {
  const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667EEA;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#764BA2;stop-opacity:1" />
      </linearGradient>
      <marker id="arrowhead4" markerWidth="10" markerHeight="7" 
              refX="0" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="white" />
      </marker>
    </defs>
    
    <!-- Background -->
    <rect width="800" height="600" fill="url(#bgGrad)" />
    
    <!-- Title -->
    <text x="400" y="50" font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
          text-anchor="middle" fill="white">Vector Geometry</text>
    
    <!-- Subtitle -->
    <text x="400" y="80" font-family="Arial, sans-serif" font-size="16" 
          text-anchor="middle" fill="rgba(255,255,255,0.8)">Comprehensive Vector Operations</text>
    
    <!-- Multiple vector examples -->
    <g transform="translate(100, 150)">
      <!-- Vector field representation -->
      <line x1="0" y1="100" x2="80" y2="80" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.9" />
      <line x1="100" y1="100" x2="180" y2="60" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.9" />
      <line x1="200" y1="100" x2="280" y2="70" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.9" />
      <line x1="300" y1="100" x2="380" y2="90" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.9" />
      <line x1="400" y1="100" x2="480" y2="110" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.9" />
      
      <line x1="0" y1="200" x2="70" y2="170" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.8" />
      <line x1="100" y1="200" x2="170" y2="150" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.8" />
      <line x1="200" y1="200" x2="270" y2="160" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.8" />
      <line x1="300" y1="200" x2="370" y2="180" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.8" />
      <line x1="400" y1="200" x2="470" y2="200" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.8" />
      
      <line x1="0" y1="300" x2="60" y2="260" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.7" />
      <line x1="100" y1="300" x2="160" y2="240" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.7" />
      <line x1="200" y1="300" x2="260" y2="250" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.7" />
      <line x1="300" y1="300" x2="360" y2="270" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.7" />
      <line x1="400" y1="300" x2="460" y2="290" stroke="white" stroke-width="3" marker-end="url(#arrowhead4)" opacity="0.7" />
    </g>
    
    <!-- Key concepts overlay -->
    <rect x="50" y="450" width="700" height="120" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2" rx="10" />
    <text x="400" y="480" font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
          text-anchor="middle" fill="white">Vector Geometry Applications</text>
    
    <text x="70" y="505" font-family="Arial, sans-serif" font-size="14" fill="white">• Physics: Force, velocity, acceleration</text>
    <text x="70" y="525" font-family="Arial, sans-serif" font-size="14" fill="white">• Engineering: Structural analysis, fluid dynamics</text>
    <text x="70" y="545" font-family="Arial, sans-serif" font-size="14" fill="white">• Computer Graphics: 3D transformations, lighting</text>
    
    <text x="420" y="505" font-family="Arial, sans-serif" font-size="14" fill="white">• Navigation: GPS, mapping systems</text>
    <text x="420" y="525" font-family="Arial, sans-serif" font-size="14" fill="white">• Machine Learning: Feature vectors</text>
    <text x="420" y="545" font-family="Arial, sans-serif" font-size="14" fill="white">• Game Development: Movement, collisions</text>
  </svg>`;

  const encoder = new TextEncoder();
  return encoder.encode(svgContent);
}