// Utility functions for processing text for speech synthesis

/**
 * Strips markdown and markup tokens from text for clean TTS output
 */
export function stripMarkdownForSpeech(text: string): string {
  if (!text) return '';

  let cleanText = text;

  // Remove markdown headers (##, ###, etc.)
  cleanText = cleanText.replace(/^#{1,6}\s+/gm, '');
  
  // Remove bold/italic markdown (**text**, *text*)
  cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleanText = cleanText.replace(/\*([^*]+)\*/g, '$1');
  
  // Remove code blocks and inline code
  cleanText = cleanText.replace(/```[\s\S]*?```/g, '');
  cleanText = cleanText.replace(/`([^`]+)`/g, '$1');
  
  // Remove links [text](url) - keep only the text
  cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove literal pause indicators
  cleanText = cleanText.replace(/\*pause\*/gi, '');
  cleanText = cleanText.replace(/\(pause\)/gi, '');
  
  // Remove various brackets and parenthetical markup
  cleanText = cleanText.replace(/\[([^\]]+)\]/g, '$1');
  
  // Remove bullet points and list markers
  cleanText = cleanText.replace(/^[-*+]\s+/gm, '');
  cleanText = cleanText.replace(/^\d+\.\s+/gm, '');
  
  // Remove extra whitespace and line breaks
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  
  return cleanText;
}

/**
 * Converts text with natural pause points to SSML for better speech synthesis
 */
export function convertToSSML(text: string): string {
  if (!text) return '';

  let ssmlText = stripMarkdownForSpeech(text);
  
  // Add natural pauses after sentences
  ssmlText = ssmlText.replace(/\.\s+/g, '. <break time="300ms"/>');
  ssmlText = ssmlText.replace(/!\s+/g, '! <break time="300ms"/>');
  ssmlText = ssmlText.replace(/\?\s+/g, '? <break time="300ms"/>');
  
  // Add pauses after colons (for lists or explanations)
  ssmlText = ssmlText.replace(/:\s+/g, ': <break time="200ms"/>');
  
  // Add emphasis for words that were likely bolded
  // This is a simple heuristic - in practice, the AI should generate SSML directly
  ssmlText = ssmlText.replace(/\b(important|key|critical|essential|remember)\b/gi, '<emphasis level="moderate">$1</emphasis>');
  
  // Wrap in SSML speak tags
  return `<speak>${ssmlText}</speak>`;
}

/**
 * Checks if the browser supports SSML
 */
export function supportsSSML(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return false;
  }
  
  // Most modern browsers support basic SSML tags
  return true;
}

/**
 * Processes AI response for optimal speech synthesis
 */
export function prepareTextForSpeech(text: string, useSSML: boolean = true): string {
  if (!text) return '';
  
  if (useSSML && supportsSSML()) {
    return convertToSSML(text);
  } else {
    return stripMarkdownForSpeech(text);
  }
}
