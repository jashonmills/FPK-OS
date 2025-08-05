/**
 * Get the appropriate site URL based on the current environment
 * Supports multiple production domains
 */
export const getSiteUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return 'https://courses.fpkuniversity.com';
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;

  // Development environments
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }

  // Lovable preview domains
  if (hostname.includes('lovable.app')) {
    return `${protocol}//${hostname}`;
  }

  // Production domains - handle all supported domains
  const productionDomains = [
    'courses.fpkuniversity.com',
    'learner.fpkadapt.com',
    'fpkuniversity.com'
  ];

  // If current hostname is one of our production domains, use it
  if (productionDomains.includes(hostname)) {
    return `https://${hostname}`;
  }

  // Default fallback to primary production domain
  return 'https://courses.fpkuniversity.com';
};

/**
 * Get the primary production domain (for email templates, etc.)
 */
export const getPrimaryDomain = (): string => {
  return 'https://courses.fpkuniversity.com';
};

/**
 * Check if the current domain is a production domain
 */
export const isProductionDomain = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  const hostname = window.location.hostname;
  const productionDomains = [
    'courses.fpkuniversity.com',
    'learner.fpkadapt.com',
    'fpkuniversity.com'
  ];
  
  return productionDomains.includes(hostname);
};