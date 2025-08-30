import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

/**
 * Same-origin proxy for SCORM content to resolve cross-origin issues
 * This component fetches content from the Supabase edge function and serves it
 * as if it's coming from the same origin, enabling proper HTML rendering and SCORM API access
 */
export const ScormContentProxy = () => {
  const { packageId, '*': filePath } = useParams();
  const location = useLocation();

  useEffect(() => {
    const proxyContent = async () => {
      if (!packageId || !filePath) {
        document.write('Bad Request: Missing packageId or filePath');
        return;
      }

      try {
        // Construct the Supabase edge function URL
        const supabaseUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/scorm-content-proxy/${packageId}/${filePath}`;
        
        // Add any query parameters from the original request
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.toString()) {
          const separator = supabaseUrl.includes('?') ? '&' : '?';
          const finalUrl = `${supabaseUrl}${separator}${searchParams.toString()}`;
        }

        // Fetch content from Supabase edge function
        const response = await fetch(supabaseUrl, {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'User-Agent': navigator.userAgent,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Get content type and body
        const contentType = response.headers.get('content-type') || 'text/html';
        const content = await response.arrayBuffer();

        // Set document content type if it's HTML
        if (contentType.includes('text/html')) {
          document.open();
          document.write(new TextDecoder().decode(content));
          document.close();
        } else {
          // For non-HTML content, create a blob URL and redirect
          const blob = new Blob([content], { type: contentType });
          const blobUrl = URL.createObjectURL(blob);
          window.location.href = blobUrl;
        }

      } catch (error) {
        console.error('SCORM Content Proxy Error:', error);
        document.write(`
          <html>
            <head><title>Content Error</title></head>
            <body>
              <div style="padding: 20px; font-family: Arial, sans-serif;">
                <h2>Content Loading Error</h2>
                <p>Failed to load SCORM content: ${error.message}</p>
                <p><strong>Package ID:</strong> ${packageId}</p>
                <p><strong>File Path:</strong> ${filePath}</p>
              </div>
            </body>
          </html>
        `);
      }
    };

    proxyContent();
  }, [packageId, filePath, location.search]);

  // Return minimal loading content
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <div>Loading SCORM content...</div>
      <div style={{ 
        marginTop: '10px', 
        width: '200px', 
        height: '4px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '2px',
        overflow: 'hidden',
        margin: '10px auto'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#0066cc',
          animation: 'loading 1.5s infinite'
        }}></div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};