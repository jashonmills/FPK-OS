import { useMemo } from 'react';
import { buildProxyUrl } from '@/lib/scorm/urls';

interface ScormSco {
  launch_href: string;
  parameters?: string;
}

function sanitizePath(path: string): string {
  if (!path) return 'index.html';
  
  // Remove query parameters and fragments
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // Prevent path traversal
  const normalizedPath = cleanPath.replace(/\.\.+/g, '').replace(/\/+/g, '/');
  
  // Remove leading slash
  return normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
}

function buildParams(parameters?: string): string {
  if (!parameters) return '';
  
  // Clean parameters and ensure proper format
  const cleanParams = parameters.trim();
  if (!cleanParams) return '';
  
  return cleanParams.startsWith('?') ? cleanParams : `?${cleanParams}`;
}

export function useScormLaunchUrl(
  packageId: string,
  sco: ScormSco | null
): string {
  return useMemo(() => {
    if (!packageId || !sco) {
      return '';
    }

    // Trust the database - scorm-again parser ensures accurate launch_href
    const launchPath = sanitizePath(sco.launch_href || 'index.html');
    const params = buildParams(sco.parameters);
    
    return `${buildProxyUrl(packageId, launchPath)}${params}`;
  }, [packageId, sco]);
}