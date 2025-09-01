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

    // Smart path resolution: use computed launch from package metadata first
    let launchPath = '';
    
    // Priority 1: Use computed launch from package metadata (most accurate)
    const computedLaunch = scormPackage?.metadata?.computed_launch;
    if (computedLaunch) {
      launchPath = sanitizePath(computedLaunch);
      console.log(`🎯 Using computed launch from package: ${launchPath}`);
    }
    // Priority 2: Use SCO launch_href
    else if (sco.launch_href) {
      launchPath = sanitizePath(sco.launch_href);
    }
    // Priority 3: Common fallbacks
    else {
      const fallbacks = ['index.html', 'index_lms.html', 'story_html5.html', 'content/index.html'];
      launchPath = fallbacks[0];
    }
    
    // Build parameters if they exist
    const params = buildParams(sco.parameters);
    
    // Use the content proxy - it will handle intelligent path resolution
    return `${buildProxyUrl(packageId, launchPath)}${params}`;
  }, [packageId, sco, scormPackage]);
}