/**
 * Get the appropriate site URL based on the current environment
 * Supports multiple production domains
 */
export const getSiteUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return 'https://fpkuniversity.com';
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
    'fpkuniversity.com',
    'courses.fpkuniversity.com',
    'learner.fpkadapt.com'
  ];

  // Always redirect to primary domain for consistency
  if (productionDomains.includes(hostname)) {
    return 'https://fpkuniversity.com';
  }

  // Default fallback to primary production domain
  return 'https://fpkuniversity.com';
};

/**
 * Get the primary production domain (for email templates, etc.)
 */
export const getPrimaryDomain = (): string => {
  return 'https://fpkuniversity.com';
};

/**
 * Check if the current domain is a production domain
 */
export const isProductionDomain = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  const hostname = window.location.hostname;
  const productionDomains = [
    'fpkuniversity.com',
    'courses.fpkuniversity.com',
    'learner.fpkadapt.com'
  ];
  
  return productionDomains.includes(hostname);
};