
import { supabase } from '@/integrations/supabase/client';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const defaultRateLimit: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
};

export const checkRateLimit = (key: string, config: RateLimitConfig = defaultRateLimit): boolean => {
  const now = Date.now();
  const limit = rateLimitStore[key];

  if (!limit || now > limit.resetTime) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + config.windowMs
    };
    return true;
  }

  if (limit.count >= config.maxRequests) {
    return false;
  }

  limit.count++;
  return true;
};

export const sanitizeForDatabase = (obj: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Remove null bytes and control characters
      sanitized[key] = value.replace(/[\x00-\x1F\x7F]/g, '').trim();
    } else if (value !== null && value !== undefined) {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

export const secureSupabaseQuery = async (
  operation: () => Promise<any>,
  rateLimitKey: string,
  rateLimitConfig?: RateLimitConfig
) => {
  // Check rate limit
  if (!checkRateLimit(rateLimitKey, rateLimitConfig)) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  try {
    const result = await operation();
    
    if (result.error) {
      // Log security-relevant errors
      console.error('Database operation failed:', {
        error: result.error.message,
        rateLimitKey,
        timestamp: new Date().toISOString()
      });
    }
    
    return result;
  } catch (error) {
    console.error('Secure API operation failed:', error);
    throw error;
  }
};

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  return crypto.randomUUID();
};

export const validateCSRFToken = (token: string, expectedToken: string): boolean => {
  return token === expectedToken && token.length === 36; // UUID length
};
