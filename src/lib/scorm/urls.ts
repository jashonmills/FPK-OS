/**
 * Centralized URL builders for SCORM functions
 * Ensures consistent URL generation and avoids React routing conflicts
 */

export const functionsBase = import.meta.env.VITE_FUNCTIONS_BASE || import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;

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