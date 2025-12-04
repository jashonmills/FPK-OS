export interface ExtractedLesson {
  id: number;
  filename: string;
  content: string;
  title: string;
}

export const getExtractedLessonContent = (lessonId: number): ExtractedLesson | null => {
  try {
    const storedContent = localStorage.getItem('algebra-lessons-content');
    if (!storedContent) return null;
    
    const lessons: ExtractedLesson[] = JSON.parse(storedContent);
    return lessons.find(lesson => lesson.id === lessonId) || null;
  } catch (error) {
    console.error('Error retrieving lesson content:', error);
    return null;
  }
};

export const parseContentForDisplay = (content: string): string => {
  // Clean up and format the content for display
  let cleanContent = content;
  
  // Remove any JSX imports or exports that might be in the content
  cleanContent = cleanContent.replace(/^import.*$/gm, '');
  cleanContent = cleanContent.replace(/^export.*$/gm, '');
  
  // Convert markdown-style headers to HTML
  cleanContent = cleanContent.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  cleanContent = cleanContent.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  cleanContent = cleanContent.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  
  // Convert markdown-style bold and italic
  cleanContent = cleanContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  cleanContent = cleanContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert code blocks
  cleanContent = cleanContent.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
  cleanContent = cleanContent.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Clean up extra whitespace
  cleanContent = cleanContent.replace(/\n\s*\n/g, '\n\n');
  
  return cleanContent.trim();
};

export const extractTitleFromContent = (content: string): string | null => {
  // Try to extract title from various formats
  const titlePatterns = [
    /^#\s+(.+)$/m,           // Markdown H1
    /^##\s+(.+)$/m,          // Markdown H2
    /title:\s*['"](.+)['"]/i, // YAML frontmatter
    /Title:\s*(.+)$/m,       // Plain title format
  ];
  
  for (const pattern of titlePatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
};