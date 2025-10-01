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
    <div className="min-h-screen bg-background py-6 lg:ml-64">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6">
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

        {/* Website Embed */}
        <Card className="overflow-hidden mx-0 rounded-none border-x-0">
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
            <iframe
              src={websiteUrl}
              className="w-full border-0"
              style={{ height: 'calc(100vh - 240px)', minHeight: '600px' }}
              title="Organization Website"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              onError={() => setIframeError(true)}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
