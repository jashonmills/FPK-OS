/**
 * Universal Course JSON Parser
 * Detects and formats various course content JSON structures
 */

interface ParsedContent {
  type: 'course' | 'lesson' | 'generic';
  formatted: string;
  title?: string;
}

export function parseCourseJSON(jsonString: string): ParsedContent {
  try {
    const data = JSON.parse(jsonString);
    
    // Detect course content format (uploaded structure)
    if (data.courseTitle && data.units) {
      return {
        type: 'course',
        title: data.courseTitle,
        formatted: formatCourseContent(data)
      };
    }
    
    // Detect v2 manifest format
    if (data.courseId && data.lessons && data.contentVersion === 'v2') {
      return {
        type: 'course',
        title: data.title,
        formatted: formatV2Manifest(data)
      };
    }
    
    // Generic JSON with syntax highlighting
    return {
      type: 'generic',
      formatted: formatGenericJSON(data)
    };
    
  } catch (error) {
    // Not valid JSON - return error
    return {
      type: 'generic',
      formatted: `# Invalid JSON\n\nCould not parse JSON content:\n\n\`\`\`\n${error instanceof Error ? error.message : 'Unknown error'}\n\`\`\``
    };
  }
}

function formatCourseContent(data: any): string {
  let markdown = `# ${data.courseTitle}\n\n`;
  markdown += `**Course:** ${data.courseSlug}\n\n`;
  markdown += `${data.description}\n\n`;
  markdown += `**Duration:** ${data.duration} minutes\n\n`;
  markdown += `---\n\n`;
  
  // Format each unit
  data.units?.forEach((unit: any) => {
    markdown += `## ${unit.unitTitle}\n\n`;
    
    // Format each lesson in the unit
    unit.lessons?.forEach((lesson: any) => {
      markdown += `### ${lesson.lessonTitle}\n\n`;
      markdown += `**Slug:** \`${lesson.lessonSlug}\`\n\n`;
      
      // Format content sections
      lesson.contentSections?.forEach((section: any) => {
        markdown += formatContentSection(section);
      });
      
      markdown += `\n---\n\n`;
    });
  });
  
  return markdown;
}

function formatContentSection(section: any): string {
  let output = '';
  
  switch (section.type) {
    case 'heading':
      output += `#### ${section.text}\n\n`;
      break;
      
    case 'paragraph':
      output += `${section.text}\n\n`;
      break;
      
    case 'list':
      if (section.items) {
        section.items.forEach((item: string) => {
          output += `- ${item}\n`;
        });
        output += `\n`;
      }
      break;
      
    case 'richText':
      if (section.content) {
        section.content.forEach((block: any) => {
          if (block.type === 'subheading') {
            output += `**${block.text}**\n\n`;
          } else if (block.type === 'text') {
            output += `${block.text}\n\n`;
          }
        });
      }
      break;
      
    case 'quiz':
      output += `#### 📝 ${section.quizTitle}\n\n`;
      section.questions?.forEach((q: any, i: number) => {
        output += `**Question ${i + 1}:** ${q.questionText}\n\n`;
        q.options?.forEach((opt: string, j: number) => {
          const marker = opt === q.correctAnswer ? '✅' : '  ';
          output += `${marker} ${j + 1}. ${opt}\n`;
        });
        output += `\n**Points:** ${q.points}\n\n`;
      });
      
      if (section.passingScore) {
        output += `**Passing Score:** ${section.passingScore}\n\n`;
      }
      
      if (section.feedback) {
        output += `**Feedback:**\n`;
        output += `- Pass: ${section.feedback.pass}\n`;
        output += `- Fail: ${section.feedback.fail}\n\n`;
      }
      break;
  }
  
  return output;
}

function formatV2Manifest(data: any): string {
  let markdown = `# ${data.title}\n\n`;
  markdown += `**Course ID:** ${data.courseId}\n`;
  markdown += `**Slug:** ${data.courseSlug}\n`;
  markdown += `**Version:** ${data.contentVersion}\n\n`;
  markdown += `${data.description}\n\n`;
  markdown += `---\n\n`;
  
  // Format lessons
  data.lessons?.forEach((lesson: any) => {
    markdown += `## Lesson ${lesson.id}: ${lesson.title}\n\n`;
    if (lesson.description) {
      markdown += `${lesson.description}\n\n`;
    }
    if (lesson.unit) {
      markdown += `**Unit:** ${lesson.unit}\n\n`;
    }
    if (lesson.estimatedMinutes) {
      markdown += `**Duration:** ~${lesson.estimatedMinutes} minutes\n\n`;
    }
    markdown += `---\n\n`;
  });
  
  return markdown;
}

function formatGenericJSON(data: any): string {
  return `# JSON Document\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
}
