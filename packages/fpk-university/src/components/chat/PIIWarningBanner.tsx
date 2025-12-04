import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldAlert, X, Eye, EyeOff } from 'lucide-react';
import { PIIDetectionResult, maskPII } from '@/utils/piiDetection';

interface PIIWarningBannerProps {
  result: PIIDetectionResult;
  originalText: string;
  onDismiss: () => void;
  onSendAnyway: () => void;
  showMasked?: boolean;
  onToggleMask?: () => void;
}

export const PIIWarningBanner: React.FC<PIIWarningBannerProps> = ({
  result,
  originalText,
  onDismiss,
  onSendAnyway,
  showMasked = false,
  onToggleMask
}) => {
  if (!result.hasPII) return null;

  const severityStyles = {
    high: 'border-red-300 bg-red-50 text-red-800',
    medium: 'border-amber-300 bg-amber-50 text-amber-800',
    low: 'border-blue-300 bg-blue-50 text-blue-800',
    none: ''
  };

  const severityIcons = {
    high: 'text-red-600',
    medium: 'text-amber-600',
    low: 'text-blue-600',
    none: ''
  };

  const maskedText = maskPII(originalText, result);

  return (
    <Alert className={`relative ${severityStyles[result.severity]} animate-in slide-in-from-top-2`}>
      <ShieldAlert className={`h-4 w-4 ${severityIcons[result.severity]}`} />
      <AlertDescription className="pr-8">
        <div className="space-y-2">
          <p className="font-medium">
            {result.severity === 'high' && '⚠️ Sensitive Information Detected'}
            {result.severity === 'medium' && '⚠️ Personal Information Detected'}
            {result.severity === 'low' && '💡 Privacy Reminder'}
          </p>
          
          <p className="text-sm">
            {result.severity === 'high' && (
              <>Your message appears to contain sensitive personal information that will be sent to an AI service. We recommend removing it before sending.</>
            )}
            {result.severity === 'medium' && (
              <>Your message may contain personal information. Be mindful of what you share with AI assistants.</>
            )}
            {result.severity === 'low' && (
              <>Remember to be careful about sharing personal details with AI systems.</>
            )}
          </p>

          {result.matches.length > 0 && (
            <div className="text-xs opacity-80">
              <span className="font-medium">Detected: </span>
              {[...new Set(result.matches.map(m => m.type))].join(', ')}
            </div>
          )}

          {result.matches.length > 0 && onToggleMask && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMask}
                className="h-7 text-xs gap-1"
              >
                {showMasked ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showMasked ? 'Show Original' : 'Preview Masked'}
              </Button>
              {showMasked && (
                <p className="mt-1 text-xs font-mono bg-white/50 p-2 rounded border">
                  {maskedText}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
              className="text-xs"
            >
              Edit Message
            </Button>
            {result.severity !== 'high' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSendAnyway}
                className="text-xs opacity-70"
              >
                Send Anyway
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
      
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Dismiss warning"
      >
        <X className="h-4 w-4" />
      </button>
    </Alert>
  );
};
