/**
 * Parse transcript JSON and convert to markdown format
 */

interface TranscriptBlock {
  type: string;
  content?: string;
  level?: number;
  items?: string[];
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  style?: string;
}

export function parseTranscript(transcript: string): string {
  try {
    const blocks: TranscriptBlock[] = JSON.parse(transcript);
    
    return blocks.map(block => {
      switch (block.type) {
        case 'heading':
          const level = block.level || 2;
          return `${'#'.repeat(level)} ${block.content}\n`;
        
        case 'paragraph':
          return `${block.content}\n`;
        
        case 'list':
          if (block.items) {
            return block.items.map(item => `- ${item}`).join('\n') + '\n';
          }
          return '';
        
        case 'callout':
          // Render callout as blockquote
          return `> **${block.style === 'teaching' ? '📚 Teaching Point' : 'Note'}**\n>\n> ${block.content?.replace(/\n/g, '\n> ')}\n`;
        
        case 'quiz':
          // Render quiz as a formatted section
          let quiz = `\n---\n\n**Knowledge Check**\n\n`;
          quiz += `**Q: ${block.question}**\n\n`;
          if (block.options) {
            quiz += block.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n') + '\n\n';
          }
          quiz += `<details>\n<summary>Show Answer</summary>\n\n`;
          quiz += `**Answer:** ${block.correctAnswer}\n\n`;
          quiz += `**Explanation:** ${block.explanation}\n`;
          quiz += `</details>\n\n---\n`;
          return quiz;
        
        default:
          return '';
      }
    }).join('\n');
  } catch (error) {
    console.error('Failed to parse transcript:', error);
    return transcript; // Return raw transcript if parsing fails
  }
}
