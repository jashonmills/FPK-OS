/**
 * Centralized URL builders for SCORM functions
 * Ensures consistent URL generation and avoids React routing conflicts
 */

// Use the direct Supabase functions URL - VITE_ env vars are not supported in Lovable
export const functionsBase = "https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1";

/**
 * Build URL for SCORM content proxy
 */
export function buildProxyUrl(packageId: string, path: string): string {
  return `${functionsBase}/scorm-content-proxy?pkg=${encodeURIComponent(packageId)}&path=${encodeURIComponent(path)}`;
}

/**
 * Build URL for SCORM content generation
 */
export function buildGenerateUrl(): string {
  return `${functionsBase}/scorm-generate-content`;
}

/**
 * Build health check URLs for debugging
 */
export function buildProxyHealthUrl(): string {
  return `${functionsBase}/scorm-content-proxy?health=1`;
}

export function buildGenerateHealthUrl(): string {
  return `${functionsBase}/scorm-generate-content?health=1`;
}