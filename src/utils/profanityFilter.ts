// Client-side profanity filter for immediate blocking of obvious offensive content
// This provides instant feedback while AI moderation handles nuanced cases

const OFFENSIVE_PATTERNS = [
  // Slurs and highly offensive terms (partial list - can be expanded)
  /\bf+u+c+k+\s*(?:shit|shite|you|off)/gi,
  /\bs+h+i+t+\s*(?:fuck|head)/gi,
  /\br+e+t+a+r+d+(?:ed|s)?\b/gi,
  /\bn+i+g+g+(?:a|er)s?\b/gi,
  /\bf+a+g+g+o+t+s?\b/gi,
  /\bc+u+n+t+s?\b/gi,
  /\bk+i+l+l+\s+yourself\b/gi,
  /\bd+i+e+\s+(?:bitch|faggot|nigger)\b/gi,
  
  // Common evasion patterns with symbols/numbers
  /f[\*\@\$]ck/gi,
  /sh[\*\@\$]t/gi,
  /r[\*\@\$]tard/gi,
  /n[\*\@\$]gg/gi,
  
  // Spaced out words (f u c k, etc)
  /\bf\s+u\s+c\s+k/gi,
  /\bs\s+h\s+i\s+t/gi,
  /\bn\s+i\s+g\s+g/gi,
];

const SEVERITY_KEYWORDS = {
  critical: [
    'kill yourself',
    'die',
    'kys',
    'end your life',
    'harm yourself',
  ],
  high: [
    'retard',
    'retarded',
    'nigger',
    'nigga',
    'faggot',
    'fag',
  ],
};

export interface ProfanityCheckResult {
  isClean: boolean;
  reason?: string;
  severity: 'none' | 'moderate' | 'high' | 'critical';
  matchedPattern?: string;
}

/**
 * Checks if content contains offensive language
 * Returns immediate feedback for client-side blocking
 */
export function checkProfanity(content: string): ProfanityCheckResult {
  if (!content || content.trim().length === 0) {
    return { isClean: true, severity: 'none' };
  }

  const lowerContent = content.toLowerCase();

  // Check for critical threats/self-harm encouragement
  for (const keyword of SEVERITY_KEYWORDS.critical) {
    if (lowerContent.includes(keyword)) {
      return {
        isClean: false,
        reason: 'Your message contains content that violates community guidelines regarding threats or harmful language.',
        severity: 'critical',
        matchedPattern: keyword,
      };
    }
  }

  // Check for high-severity slurs
  for (const keyword of SEVERITY_KEYWORDS.high) {
    if (lowerContent.includes(keyword)) {
      return {
        isClean: false,
        reason: 'Your message contains offensive language that is not allowed in our community.',
        severity: 'high',
        matchedPattern: keyword,
      };
    }
  }

  // Check offensive patterns
  for (const pattern of OFFENSIVE_PATTERNS) {
    if (pattern.test(content)) {
      return {
        isClean: false,
        reason: 'Your message contains language that violates our community guidelines. Please rephrase respectfully.',
        severity: 'high',
        matchedPattern: pattern.source,
      };
    }
  }

  return { isClean: true, severity: 'none' };
}

/**
 * Sanitizes content by masking offensive words (used for logging/display)
 */
export function sanitizeContent(content: string): string {
  let sanitized = content;
  
  for (const pattern of OFFENSIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern, (match) => {
      return '*'.repeat(Math.min(match.length, 8));
    });
  }
  
  return sanitized;
}
