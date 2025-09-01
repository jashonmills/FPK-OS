import { useMemo } from 'react';
import { useScormPackage } from '@/hooks/useScormPackages';
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
  const { package: scormPackage } = useScormPackage(packageId);
  
  return useMemo(() => {
    if (!packageId || !sco) {
      return '';
    }

    // Try the provided launch_href first
    let launchPath = sanitizePath(sco.launch_href);
    
    // If no valid launch_href, try common fallbacks
    if (!launchPath || launchPath === 'index.html') {
      const fallbacks = ['index.html', 'index_lms.html', 'story_html5.html', 'content/index.html'];
      launchPath = fallbacks[0]; // Default to first fallback
    }
    
    // Build parameters if they exist
    const params = buildParams(sco.parameters);
    
    // Use the content proxy with the extracted package structure
    return `${buildProxyUrl(packageId, launchPath)}${params}`;
  }, [packageId, sco, scormPackage]);
}