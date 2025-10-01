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
  return;
}