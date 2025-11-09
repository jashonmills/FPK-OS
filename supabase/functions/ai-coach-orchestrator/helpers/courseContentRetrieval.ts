/**
 * Course Content Retrieval Helper
 * Provides direct access to course content without requiring embeddings
 */

export interface CourseContent {
  slug: string;
  title: string;
  description: string;
  lessons: Array<{
    id: number;
    title: string;
    description: string;
    unit: string;
    estimatedMinutes?: number;
  }>;
}

/**
 * Detect if user message mentions any course from their active courses
 */
export function detectMentionedCourse(
  userMessage: string,
  activeCourses: Array<{ title: string; slug: string }>
): { title: string; slug: string } | null {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const course of activeCourses) {
    // Check if message mentions course title or slug
    const titleWords = course.title.toLowerCase().split(' ');
    const hasMultipleWords = titleWords.filter(w => lowerMessage.includes(w)).length >= 2;
    const hasSlug = lowerMessage.includes(course.slug.replace(/-/g, ' '));
    
    if (hasMultipleWords || hasSlug) {
      return course;
    }
  }
  
  return null;
}

/**
 * Retrieve course content from the database
 */
export async function retrieveCourseContent(
  courseSlug: string,
  supabaseClient: any
): Promise<CourseContent | null> {
  try {
    console.log('[COURSE RAG] 🎓 Loading course content for:', courseSlug);
    
    // Fetch course from database
    const { data: courseData, error } = await supabaseClient
      .from('courses')
      .select('*')
      .eq('slug', courseSlug)
      .single();
    
    if (error || !courseData) {
      console.error('[COURSE RAG] ❌ Failed to load course:', error);
      return null;
    }
    
    // For V2 courses, try to load the manifest from content_manifest
    if (courseData.content_version === 'v2' && courseData.content_manifest) {
      const manifest = courseData.content_manifest;
      
      return {
        slug: courseSlug,
        title: manifest.title || courseData.title,
        description: manifest.description || courseData.description,
        lessons: manifest.lessons || []
      };
    }
    
    // Fallback: basic course info without detailed lessons
    console.log('[COURSE RAG] ⚠️ No detailed lesson data available for', courseSlug);
    return {
      slug: courseSlug,
      title: courseData.title,
      description: courseData.description,
      lessons: []
    };
    
  } catch (error) {
    console.error('[COURSE RAG] ❌ Exception loading course:', error);
    return null;
  }
}

/**
 * Format course content for injection into system prompt
 */
export function formatCourseContentForPrompt(courseContent: CourseContent): string {
  let formatted = `# 📚 COURSE CONTENT AVAILABLE\n\n`;
  formatted += `The student is asking about: **${courseContent.title}**\n\n`;
  formatted += `**Course Description:**\n${courseContent.description}\n\n`;
  
  if (courseContent.lessons.length > 0) {
    formatted += `**Available Lessons:**\n`;
    courseContent.lessons.forEach(lesson => {
      const time = lesson.estimatedMinutes ? ` (${lesson.estimatedMinutes} min)` : '';
      formatted += `- **Lesson ${lesson.id}: ${lesson.title}**${time}\n`;
      formatted += `  ${lesson.description}\n`;
      if (lesson.unit) {
        formatted += `  Unit: ${lesson.unit}\n`;
      }
    });
    
    formatted += `\n**Your Role:**\n`;
    formatted += `You have access to this course content. When the student asks about this course:\n`;
    formatted += `- **FOR INFORMATIONAL REQUESTS** (overview, what's covered, lesson descriptions): Provide direct, comprehensive answers THEN ask a Socratic follow-up question\n`;
    formatted += `- **FOR CONCEPTUAL QUESTIONS** (why, how, what causes): Use full Socratic method with AVCQ\n`;
    formatted += `- Reference specific lessons naturally\n`;
    formatted += `- Help them understand what each lesson covers\n`;
    formatted += `- Connect their questions to relevant lessons\n`;
  }
  
  return formatted;
}
