import { useOrgContext } from '@/components/organizations/OrgContext';
import { Card } from '@/components/ui/card';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function OrgWebsitePage() {
  const { currentOrg } = useOrgContext();
  const [iframeError, setIframeError] = useState(false);
  const websiteUrl = 'https://www.mellns.ie/';

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
      <div className="lg:ml-64">
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
            className="relative w-full overflow-hidden"
            style={{ 
              height: 'calc(100vh - 120px)',
              minHeight: '600px'
            }}
          >
            <iframe
              src={websiteUrl}
              className="absolute top-0 left-0 w-full h-full border-0"
              title="Organization Website"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              onError={() => setIframeError(true)}
            >
              <p>Your browser does not support iframes. Please <a href={websiteUrl} target="_blank" rel="noopener noreferrer">visit the site directly</a>.</p>
            </iframe>
          </div>
        )}
      </div>
    </div>
  );
}
