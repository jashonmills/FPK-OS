import { useOrgContext } from '@/components/organizations/OrgContext';
import { Card } from '@/components/ui/card';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
export default function OrgWebsitePage() {
  const {
    currentOrg
  } = useOrgContext();
  const [iframeError, setIframeError] = useState(false);
  const websiteUrl = 'https://www.mellns.ie/';
  if (!currentOrg) {
    return null;
  }
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Organization Website</h1>
              <p className="text-muted-foreground">View your organization's website</p>
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
        </Card>
      </div>

      {/* Iframe Container - fills remaining space */}
      <div className="flex-grow relative overflow-x-hidden overflow-y-auto rounded-lg border bg-background">
        {iframeError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to load website</h3>
            <p className="text-muted-foreground mb-4">
              The website cannot be displayed in an embedded frame.
            </p>
            <Button
              onClick={() => window.open(websiteUrl, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Website Directly
            </Button>
          </div>
        ) : (
          <iframe
            src={websiteUrl}
            title="Organization Website"
            scrolling="no"
            className="absolute top-0 left-0 w-full h-full border-0"
            onError={() => setIframeError(true)}
          />
        )}
      </div>
    </div>
  );
}