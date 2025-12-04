/**
 * Consistent PDF Download Button Component
 * Provides unified styling and accessibility for all PDF downloads
 */

import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';

interface PDFDownloadButtonProps {
  pdfUrl: string;
  fileName: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
  moduleId?: string;
  courseId?: string;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  pdfUrl,
  fileName,
  variant = 'outline',
  size = 'default',
  showIcon = true,
  showText = true,
  className,
  moduleId,
  courseId
}) => {
  const { toast } = useToast();
  const { trackPDFDownloaded } = useAnalytics({ moduleId, courseId });

  const handleDownload = async () => {
    try {
      // Create download link
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Track download
      trackPDFDownloaded(fileName);

      // Show success toast
      toast({
        title: 'Download Started',
        description: `${fileName} is downloading...`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: 'Download Failed',
        description: 'Please try again or check your connection.',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      className={className}
      aria-label={`Download ${fileName}`}
    >
      {showIcon && <Download className="h-4 w-4" />}
      {showIcon && showText && <span className="ml-2" />}
      {showText && 'Download PDF'}
    </Button>
  );
};

export default PDFDownloadButton;