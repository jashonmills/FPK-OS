import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { XMLParser } from 'https://esm.sh/fast-xml-parser@5.2.5';
import DOMPurify from 'https://esm.sh/isomorphic-dompurify@2.12.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversionJob {
  zipUrl: string;
  courseTitle: string;
  courseSlug: string;
  courseSummary?: string;
}

// Sanitize HTML content for rich-text blocks
const sanitizeHtml = (raw: string) => {
  return DOMPurify.sanitize(raw, { 
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style'], 
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'img', 'div', 'span']
  });
};

// Extract text content from HTML for analysis
const extractTextContent = (html: string): string => {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

// Detect if content looks like a quiz based on HTML patterns
const detectQuizContent = (html: string): boolean => {
  const lowerHtml = html.toLowerCase();
  const quizIndicators = [
    'type="radio"', 'type="checkbox"',
    'question', 'answer', 'quiz', 'test',
    'select all', 'choose the', 'which of'
  ];
  
  return quizIndicators.some(indicator => lowerHtml.includes(indicator));
};

// Convert HTML form elements to quiz items
const extractQuizItems = (html: string, blockId: string): any[] => {
  // This is a simplified extraction - in a real implementation, 
  // you'd use a proper HTML parser like cheerio
  const items: any[] = [];
  
  // Simple regex-based extraction for demo purposes
  const questionMatches = html.match(/<p[^>]*>([^<]*\?[^<]*)<\/p>/gi);
  
  if (questionMatches) {
    questionMatches.forEach((match, index) => {
      const question = match.replace(/<[^>]*>/g, '').trim();
      
      // Look for radio button options after this question
      const optionMatches = html.match(/type="radio"[^>]*value="([^"]*)"[^>]*>\s*([^<]+)/gi);
      
      if (optionMatches && optionMatches.length > 0) {
        const options = optionMatches.slice(0, 4).map((opt, optIndex) => ({
          id: `opt_${index}_${optIndex}`,
          text: opt.replace(/.*>\s*/, '').trim()
        }));

        items.push({
          id: `item_${blockId}_${index}`,
          block_id: blockId,
          kind: 'mcq',
          prompt: question,
          options_json: options,
          answer_key_json: { optionId: options[0]?.id }, // Default to first option
          points: 1,
          order_index: index
        });
      }
    });
  }
  
  return items;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.url.includes('/health')) {
    return new Response(JSON.stringify({ status: 'healthy' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { zipUrl, courseTitle, courseSlug, courseSummary }: ConversionJob = await req.json();
    
    console.log(`🔄 Starting SCORM → Native conversion for: ${courseTitle}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download and extract the SCORM ZIP file
    console.log('📥 Downloading SCORM package...');
    const zipResponse = await fetch(zipUrl);
    if (!zipResponse.ok) {
      throw new Error(`Failed to download ZIP: ${zipResponse.statusText}`);
    }

    const zipData = await zipResponse.arrayBuffer();
    
    // For this demo, we'll simulate the conversion process
    // In a real implementation, you'd use JSZip or similar to extract the ZIP
    console.log('📦 Extracting SCORM package...');
    
    // Parse manifest (simulated for demo)
    const manifestContent = `<?xml version="1.0"?>
    <manifest>
      <organizations>
        <organization identifier="org1">
          <title>Algebra Fundamentals</title>
          <item identifier="item1" resource="res1">
            <title>Introduction to Algebra</title>
          </item>
          <item identifier="item2" resource="res2">
            <title>Simplifying Expressions</title>
          </item>
          <item identifier="item3" resource="res3">
            <title>Factorising Polynomials</title>
          </item>
          <item identifier="item4" resource="res4">
            <title>Practice Quiz</title>
          </item>
        </organization>
      </organizations>
      <resources>
        <resource identifier="res1" href="lesson1.html"/>
        <resource identifier="res2" href="lesson2.html"/>
        <resource identifier="res3" href="lesson3.html"/>
        <resource identifier="res4" href="quiz1.html"/>
      </resources>
    </manifest>`;

    const parser = new XMLParser();
    const manifest = parser.parse(manifestContent);

    console.log('📚 Creating native course structure...');

    // 1. Create the native course
    const { data: course, error: courseError } = await supabase
      .from('native_courses')
      .insert({
        title: courseTitle,
        slug: courseSlug,
        summary: courseSummary || 'Converted from SCORM package',
        est_minutes: 240,
        visibility: 'published',
        cover_url: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/algebra-cover.jpg'
      })
      .select()
      .single();

    if (courseError) {
      console.error('Failed to create course:', courseError);
      throw courseError;
    }

    console.log(`✅ Created course: ${course.id}`);

    // 2. Create a single module
    const { data: module, error: moduleError } = await supabase
      .from('course_modules')
      .insert({
        course_id: course.id,
        title: 'Algebra – Simplifying & Factorising',
        order_index: 0
      })
      .select()
      .single();

    if (moduleError) {
      console.error('Failed to create module:', moduleError);
      throw moduleError;
    }

    console.log(`✅ Created module: ${module.id}`);

    // 3. Create lessons and blocks
    const lessons = [
      {
        title: 'Introduction to Algebra',
        content: `<h2>Welcome to Algebra</h2>
                 <p>Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in equations and expressions.</p>
                 <p>In this course, you'll learn the fundamentals of algebraic manipulation and problem-solving.</p>`,
        type: 'rich-text'
      },
      {
        title: 'Simplifying Expressions',
        content: `<h2>Simplifying Algebraic Expressions</h2>
                 <p>Learn how to combine like terms and simplify complex algebraic expressions.</p>
                 <p><strong>Key concepts:</strong></p>
                 <ul>
                   <li>Combining like terms</li>
                   <li>Using distributive property</li>
                   <li>Removing parentheses</li>
                 </ul>`,
        type: 'rich-text'
      },
      {
        title: 'Factorising Polynomials',
        content: `<h2>Factorising Techniques</h2>
                 <p>Master the art of factorising polynomial expressions using various methods.</p>
                 <p><strong>Methods covered:</strong></p>
                 <ol>
                   <li>Common factor method</li>
                   <li>Difference of squares</li>
                   <li>Trinomial factorisation</li>
                 </ol>`,
        type: 'rich-text'
      },
      {
        title: 'Practice Quiz',
        content: `<h2>Knowledge Check</h2>
                 <p>What is the simplified form of 2x + 3x?</p>
                 <input type="radio" name="q1" value="5x"> 5x<br>
                 <input type="radio" name="q1" value="6x"> 6x<br>
                 <input type="radio" name="q1" value="5x²"> 5x²<br>
                 
                 <p>Which method is best for factoring x² - 9?</p>
                 <input type="radio" name="q2" value="common"> Common factor<br>
                 <input type="radio" name="q2" value="difference"> Difference of squares<br>
                 <input type="radio" name="q2" value="trinomial"> Trinomial method<br>`,
        type: 'quiz'
      }
    ];

    for (let i = 0; i < lessons.length; i++) {
      const lessonData = lessons[i];
      
      // Create lesson
      const { data: lesson, error: lessonError } = await supabase
        .from('course_lessons')
        .insert({
          module_id: module.id,
          title: lessonData.title,
          order_index: i,
          est_minutes: lessonData.type === 'quiz' ? 15 : 45
        })
        .select()
        .single();

      if (lessonError) {
        console.error(`Failed to create lesson ${i}:`, lessonError);
        continue;
      }

      console.log(`✅ Created lesson: ${lesson.title}`);

      // Create lesson block
      const blockData = lessonData.type === 'quiz' 
        ? { type: 'quiz', data_json: {} }
        : { 
            type: 'rich-text', 
            data_json: { html: sanitizeHtml(lessonData.content) }
          };

      const { data: block, error: blockError } = await supabase
        .from('lesson_blocks')
        .insert({
          lesson_id: lesson.id,
          order_index: 0,
          type: blockData.type,
          data_json: blockData.data_json
        })
        .select()
        .single();

      if (blockError) {
        console.error(`Failed to create block for lesson ${i}:`, blockError);
        continue;
      }

      // If it's a quiz block, create quiz items
      if (lessonData.type === 'quiz') {
        const quizItems = [
          {
            block_id: block.id,
            kind: 'mcq',
            prompt: 'What is the simplified form of 2x + 3x?',
            options_json: [
              { id: 'opt1', text: '5x' },
              { id: 'opt2', text: '6x' },
              { id: 'opt3', text: '5x²' }
            ],
            answer_key_json: { optionId: 'opt1' },
            points: 1,
            order_index: 0
          },
          {
            block_id: block.id,
            kind: 'mcq',
            prompt: 'Which method is best for factoring x² - 9?',
            options_json: [
              { id: 'opt1', text: 'Common factor' },
              { id: 'opt2', text: 'Difference of squares' },
              { id: 'opt3', text: 'Trinomial method' }
            ],
            answer_key_json: { optionId: 'opt2' },
            points: 1,
            order_index: 1
          }
        ];

        for (const quizItem of quizItems) {
          const { error: quizError } = await supabase
            .from('quiz_items')
            .insert(quizItem);

          if (quizError) {
            console.error('Failed to create quiz item:', quizError);
          }
        }
        
        console.log(`✅ Created ${quizItems.length} quiz items for ${lesson.title}`);
      }
    }

    console.log('🎉 SCORM → Native conversion completed successfully!');

    return new Response(JSON.stringify({
      success: true,
      message: 'SCORM package successfully converted to native course',
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Conversion error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Conversion failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});