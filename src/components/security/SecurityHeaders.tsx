
import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Add Content Security Policy meta tag if not already present
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!existingCSP) {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://api.openai.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https://zgcegkmqfgznbpdplscz.supabase.co https://api.openai.com https://api.stripe.com wss://zgcegkmqfgznbpdplscz.supabase.co",
        "media-src 'self' https://zgcegkmqfgznbpdplscz.supabase.co",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://api.stripe.com",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests"
      ].join('; ');
      document.head.appendChild(meta);
    }

    // Add other security headers via meta tags
    const securityHeaders = [
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'X-XSS-Protection', content: '1; mode=block' }
    ];

    securityHeaders.forEach(({ name, content }) => {
      const existing = document.querySelector(`meta[http-equiv="${name}"]`);
      if (!existing) {
        const meta = document.createElement('meta');
        meta.httpEquiv = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  }, []);

  return null;
};

export default SecurityHeaders;
