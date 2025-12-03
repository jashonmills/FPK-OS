/**
 * PII Detection Utility
 * Scans text for common personally identifiable information patterns
 * Used to warn users before sending sensitive data to AI systems
 */

export interface PIIMatch {
  type: string;
  value: string;
  index: number;
  length: number;
}

export interface PIIDetectionResult {
  hasPII: boolean;
  matches: PIIMatch[];
  severity: 'none' | 'low' | 'medium' | 'high';
  message: string;
}

// Regex patterns for common PII types
const PII_PATTERNS = {
  // Social Security Number (US)
  ssn: {
    pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
    label: 'Social Security Number',
    severity: 'high' as const
  },
  
  // Phone numbers (various formats)
  phone: {
    pattern: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    label: 'Phone Number',
    severity: 'medium' as const
  },
  
  // Email addresses
  email: {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    label: 'Email Address',
    severity: 'medium' as const
  },
  
  // Credit card numbers (basic patterns)
  creditCard: {
    pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    label: 'Credit Card Number',
    severity: 'high' as const
  },
  
  // Date of birth patterns
  dob: {
    pattern: /\b(?:born\s+(?:on\s+)?|birthday\s+(?:is\s+)?|dob[:\s]+|date\s+of\s+birth[:\s]+)(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})\b/gi,
    label: 'Date of Birth',
    severity: 'medium' as const
  },
  
  // Home/Street addresses
  address: {
    pattern: /\b\d{1,5}\s+(?:[A-Za-z]+\s+){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Circle|Cir|Way|Place|Pl)\b\.?(?:\s*,?\s*(?:Apt|Unit|Suite|Ste|#)\.?\s*\d+)?/gi,
    label: 'Street Address',
    severity: 'high' as const
  },
  
  // ZIP codes (US)
  zipCode: {
    pattern: /\b\d{5}(?:-\d{4})?\b/g,
    label: 'ZIP Code',
    severity: 'low' as const
  },
  
  // Driver's license patterns (generic)
  driversLicense: {
    pattern: /\b(?:driver'?s?\s*license|dl|license\s*#?)[:\s]*[A-Z0-9]{5,15}\b/gi,
    label: "Driver's License",
    severity: 'high' as const
  },
  
  // Passport numbers
  passport: {
    pattern: /\b(?:passport\s*(?:number|#|no)?)[:\s]*[A-Z0-9]{6,9}\b/gi,
    label: 'Passport Number',
    severity: 'high' as const
  },
  
  // Bank account numbers
  bankAccount: {
    pattern: /\b(?:account\s*(?:number|#|no)?|acct)[:\s]*\d{8,17}\b/gi,
    label: 'Bank Account Number',
    severity: 'high' as const
  },
  
  // IP addresses
  ipAddress: {
    pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    label: 'IP Address',
    severity: 'low' as const
  },
  
  // Medical record numbers (generic pattern)
  medicalRecord: {
    pattern: /\b(?:mrn|medical\s*record\s*(?:number|#)?)[:\s]*[A-Z0-9]{6,12}\b/gi,
    label: 'Medical Record Number',
    severity: 'high' as const
  },

  // Student ID patterns
  studentId: {
    pattern: /\b(?:student\s*id|student\s*number|id\s*number)[:\s]*[A-Z0-9]{5,12}\b/gi,
    label: 'Student ID',
    severity: 'medium' as const
  }
};

// Keywords that suggest PII context
const PII_CONTEXT_KEYWORDS = [
  'my name is',
  'i am',
  'i\'m',
  'my address',
  'i live at',
  'my phone',
  'call me at',
  'my email',
  'contact me',
  'my social',
  'my ssn',
  'my password',
  'my pin',
  'my birthday',
  'i was born',
  'my age is',
  'years old',
  'my school is',
  'i go to',
  'my parents',
  'my mom',
  'my dad',
  'my teacher'
];

/**
 * Detect PII in the given text
 */
export function detectPII(text: string): PIIDetectionResult {
  const matches: PIIMatch[] = [];
  let highestSeverity: 'none' | 'low' | 'medium' | 'high' = 'none';
  
  // Check each pattern
  for (const [key, config] of Object.entries(PII_PATTERNS)) {
    const regex = new RegExp(config.pattern.source, config.pattern.flags);
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Avoid false positives for ZIP codes that might be other numbers
      if (key === 'zipCode') {
        // Skip if it looks like it's part of a larger number context
        const before = text.slice(Math.max(0, match.index - 10), match.index);
        if (/\d/.test(before.slice(-1))) continue;
      }
      
      matches.push({
        type: config.label,
        value: match[0],
        index: match.index,
        length: match[0].length
      });
      
      // Update highest severity
      if (config.severity === 'high') highestSeverity = 'high';
      else if (config.severity === 'medium' && highestSeverity !== 'high') highestSeverity = 'medium';
      else if (config.severity === 'low' && highestSeverity === 'none') highestSeverity = 'low';
    }
  }
  
  // Check for context keywords (lower confidence)
  const lowerText = text.toLowerCase();
  const hasContextKeywords = PII_CONTEXT_KEYWORDS.some(keyword => lowerText.includes(keyword));
  
  // If we found context keywords but no hard matches, it's low severity
  if (hasContextKeywords && matches.length === 0) {
    highestSeverity = 'low';
  }
  
  // Build result message
  let message = '';
  if (matches.length > 0) {
    const types = [...new Set(matches.map(m => m.type))];
    message = `Detected potential PII: ${types.join(', ')}`;
  } else if (hasContextKeywords) {
    message = 'Your message may contain personal information';
  }
  
  return {
    hasPII: matches.length > 0 || hasContextKeywords,
    matches,
    severity: highestSeverity,
    message
  };
}

/**
 * Get a user-friendly warning message based on PII detection result
 */
export function getPIIWarningMessage(result: PIIDetectionResult): string {
  if (!result.hasPII) return '';
  
  if (result.severity === 'high') {
    return '⚠️ Warning: Your message appears to contain sensitive personal information (like SSN, credit card, or address). This information will be sent to an AI service. Are you sure you want to continue?';
  }
  
  if (result.severity === 'medium') {
    return '⚠️ Heads up: Your message may contain personal information (like phone number or email). This will be sent to an AI service.';
  }
  
  return '💡 Tip: Be careful about sharing personal information with AI assistants.';
}

/**
 * Mask detected PII in text for logging/display
 */
export function maskPII(text: string, result: PIIDetectionResult): string {
  if (!result.hasPII || result.matches.length === 0) return text;
  
  let masked = text;
  // Sort matches by index descending to replace from end to start
  const sortedMatches = [...result.matches].sort((a, b) => b.index - a.index);
  
  for (const match of sortedMatches) {
    const replacement = `[${match.type.toUpperCase()} REDACTED]`;
    masked = masked.slice(0, match.index) + replacement + masked.slice(match.index + match.length);
  }
  
  return masked;
}
