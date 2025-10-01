import { useOrgContext } from '@/components/organizations/OrgContext';
import { Card } from '@/components/ui/card';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function OrgWebsitePage() {
  const { currentOrg } = useOrgContext();
  const [iframeError, setIframeError] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const websiteUrl = 'https://www.mellns.ie/';
  
  // Target width that the website naturally renders at
  const websiteNaturalWidth = 1200;

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedScale = containerWidth / websiteNaturalWidth;
        setScale(calculatedScale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  if (!currentOrg) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with navigation offset */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-border lg:ml-64">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organization Website</h1>
          <p className="text-muted-foreground mt-1">
            View your organization's website
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.open(websiteUrl, '_blank')}
          className="gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Open in New Tab
        </Button>
      </div>

      {/* Website Embed - Full Width from nav panel to screen edge */}
      <div ref={containerRef} className="lg:ml-64 overflow-hidden">
        {iframeError ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="text-lg font-semibold">Unable to Load Website</h3>
            <p className="text-muted-foreground text-center max-w-md">
              The website cannot be displayed in an embedded frame. Please use the button above to open it in a new tab.
            </p>
            <Button
              onClick={() => window.open(websiteUrl, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Website
            </Button>
          </div>
        ) : (
          <div 
            className="relative w-full origin-top-left" 
            style={{ 
              height: `calc((100vh - 120px) / ${scale})`,
              minHeight: `${600 / scale}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left'
            }}
          >
            <iframe
              src={websiteUrl}
              className="border-0 w-full h-full"
              style={{ 
                width: `${websiteNaturalWidth}px`,
                height: '100%'
              }}
              title="Organization Website"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              onError={() => setIframeError(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
