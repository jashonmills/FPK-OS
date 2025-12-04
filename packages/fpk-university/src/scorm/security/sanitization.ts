// SCORM Security Utilities

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'data:', 'blob:'];
const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.scr', '.com', '.pif', '.vbs', '.js'];

/**
 * Sanitize launch href to prevent security issues
 */
export function sanitizeLaunchHref(href: string): string {
  if (!href) return '';
  
  try {
    // Handle relative URLs
    if (!href.includes('://')) {
      // Remove any directory traversal attempts
      const cleaned = href.replace(/\.\./g, '').replace(/\/\.\//g, '/');
      // Ensure it doesn't start with / to prevent absolute path access
      return cleaned.startsWith('/') ? cleaned.substring(1) : cleaned;
    }
    
    // Handle absolute URLs
    const url = new URL(href);
    
    // Check protocol
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
      throw new Error(`Protocol ${url.protocol} not allowed`);
    }
    
    // Check for blocked extensions
    const pathname = url.pathname.toLowerCase();
    if (BLOCKED_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
      throw new Error(`File extension not allowed: ${pathname}`);
    }
    
    // For security, only allow same-origin URLs or explicitly whitelisted domains
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      if (url.origin !== currentOrigin) {
        console.warn(`External URL blocked: ${href}`);
        return ''; // Block external URLs unless explicitly whitelisted
      }
    }
    
    return url.toString();
  } catch (error) {
    console.error('Invalid launch href:', href, error);
    return ''; // Return empty string for invalid URLs
  }
}

/**
 * Sanitize SCORM parameters
 */
export function sanitizeParameters(params: string): string {
  if (!params) return '';
  
  // Remove potentially dangerous characters and scripts
  return params
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize manifest data
 */
export function sanitizeManifestData(manifest: any): any {
  if (!manifest || typeof manifest !== 'object') {
    return {};
  }
  
  const sanitized = { ...manifest };
  
  // Sanitize organizations
  if (sanitized.organizations) {
    sanitized.organizations = sanitized.organizations.map((org: any) => ({
      ...org,
      title: sanitizeText(org.title),
      items: org.items?.map((item: any) => ({
        ...item,
        title: sanitizeText(item.title),
        parameters: sanitizeParameters(item.parameters || '')
      })) || []
    }));
  }
  
  // Sanitize resources
  if (sanitized.resources) {
    sanitized.resources = sanitized.resources.map((resource: any) => ({
      ...resource,
      href: sanitizeLaunchHref(resource.href)
    }));
  }
  
  // Sanitize SCOs
  if (sanitized.scos) {
    sanitized.scos = sanitized.scos.map((sco: any) => ({
      ...sco,
      title: sanitizeText(sco.title),
      launch_href: sanitizeLaunchHref(sco.launch_href),
      parameters: sanitizeParameters(sco.parameters || '')
    }));
  }
  
  return sanitized;
}

/**
 * Sanitize text content
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&lt;script\b[^&]*(?:(?!&lt;\/script&gt;)&[^&]*)*&lt;\/script&gt;/gi, '')
    .trim();
}

/**
 * Generate Content Security Policy header value
 */
export function generateCSPHeader(allowInlineStyles = true): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // SCORM content often requires inline scripts
    allowInlineStyles ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'", // Prevent embedding in other sites
    "upgrade-insecure-requests"
  ];
  
  return directives.join('; ');
}

/**
 * Validate file upload security
 */
export function validateScormUpload(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (file.type !== 'application/zip' && !file.name.toLowerCase().endsWith('.zip')) {
    return { valid: false, error: 'Only ZIP files are allowed' };
  }
  
  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 100MB' };
  }
  
  // Check filename for malicious patterns
  const filename = file.name.toLowerCase();
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return { valid: false, error: 'Invalid filename' };
  }
  
  return { valid: true };
}

/**
 * Rate limiting utility for SCORM API calls
 */
export class ScormRateLimiter {
  private calls: Map<string, number[]> = new Map();
  private readonly maxCalls: number;
  private readonly windowMs: number;
  
  constructor(maxCalls = 100, windowMs = 1000) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
  }
  
  isAllowed(sessionId: string): boolean {
    const now = Date.now();
    const calls = this.calls.get(sessionId) || [];
    
    // Remove old calls outside the window
    const recentCalls = calls.filter(time => now - time < this.windowMs);
    
    if (recentCalls.length >= this.maxCalls) {
      return false;
    }
    
    // Add current call
    recentCalls.push(now);
    this.calls.set(sessionId, recentCalls);
    
    return true;
  }
  
  cleanup(): void {
    const now = Date.now();
    for (const [sessionId, calls] of this.calls.entries()) {
      const recentCalls = calls.filter(time => now - time < this.windowMs);
      if (recentCalls.length === 0) {
        this.calls.delete(sessionId);
      } else {
        this.calls.set(sessionId, recentCalls);
      }
    }
  }
}