/**
 * Utility functions for extracting readable text from course content
 */

export interface ReadableSection {
  id: string;
  title: string;
  content: string;
  type: 'heading' | 'paragraph' | 'list' | 'example';
}

/**
 * Extracts readable text from a DOM element, focusing on educational content
 */
export const extractReadableText = (element: HTMLElement): string => {
  if (!element) return '';
  
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Remove non-content elements
  const elementsToRemove = [
    'button',
    '.lucide',
    '[data-tts-ignore]',
    '.text-muted-foreground.text-xs', // Small helper text
    '.badge'
  ];
  
  elementsToRemove.forEach(selector => {
    const elements = clone.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });
  
  // Get text content and clean it up
  let text = clone.textContent || '';
  
  // Clean up whitespace and formatting
  text = text
    .replace(/\s+/g, ' ')
    .replace(/•/g, '') // Remove bullet points
    .replace(/\n\s*\n/g, '. ') // Replace double newlines with periods
    .trim();
  
  // Add natural pauses for better TTS
  text = text
    .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Ensure space after sentences
    .replace(/:\s*([A-Z])/g, ': $1') // Pause after colons
    .replace(/;\s*([A-Z])/g, '; $1'); // Pause after semicolons
  
  return text;
};

/**
 * Extracts structured readable sections from course content
 */
export const extractCourseContent = (element: HTMLElement): ReadableSection[] => {
  if (!element) return [];
  
  const sections: ReadableSection[] = [];
  
  // Extract main headings
  const headings = element.querySelectorAll('h1, h2, h3, h4');
  headings.forEach((heading, index) => {
    const title = heading.textContent?.trim() || '';
    if (title && !title.includes('Lesson') && !title.includes('Coming Up')) {
      sections.push({
        id: `heading-${index}`,
        title,
        content: title,
        type: 'heading'
      });
    }
  });
  
  // Extract content sections
  const contentSections = element.querySelectorAll('.space-y-4, .space-y-6');
  contentSections.forEach((section, index) => {
    const heading = section.querySelector('h3, h4');
    const title = heading?.textContent?.trim() || `Section ${index + 1}`;
    
    const content = extractReadableText(section as HTMLElement);
    if (content && content.length > 20) {
      sections.push({
        id: `section-${index}`,
        title,
        content,
        type: 'paragraph'
      });
    }
  });
  
  return sections;
};

/**
 * Converts mathematical expressions to readable text for TTS
 */
export const convertMathToSpeech = (text: string): string => {
  return text
    .replace(/\bx\+/g, 'x plus ')
    .replace(/\bx\-/g, 'x minus ')
    .replace(/\bx\*/g, 'x times ')
    .replace(/\bx\//g, 'x divided by ')
    .replace(/\b(\d+)x/g, '$1 times x')
    .replace(/\bx\^(\d+)/g, 'x to the power of $1')
    .replace(/\bsin\(/g, 'sine of ')
    .replace(/\bcos\(/g, 'cosine of ')
    .replace(/\btan\(/g, 'tangent of ')
    .replace(/\bπ/g, 'pi')
    .replace(/\b°/g, ' degrees')
    .replace(/\b√/g, 'square root of ')
    .replace(/\b=\s*/g, ' equals ')
    .replace(/\b≠\s*/g, ' does not equal ')
    .replace(/\b≤\s*/g, ' is less than or equal to ')
    .replace(/\b≥\s*/g, ' is greater than or equal to ')
    .replace(/\b<\s*/g, ' is less than ')
    .replace(/\b>\s*/g, ' is greater than ');
};

/**
 * Generates introduction text for lessons
 */
export const generateIntroText = (lessonTitle: string, lessonNumber: number, totalLessons: number): string => {
  return `Welcome to lesson ${lessonNumber} of ${totalLessons}: ${lessonTitle}. Let's begin learning about this topic.`;
};

/**
 * Generates summary text for lessons
 */
export const generateOutroText = (lessonTitle: string): string => {
  return `This completes the lesson on ${lessonTitle}. Great job on your learning progress!`;
};