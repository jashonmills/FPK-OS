
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Check, RotateCcw } from 'lucide-react';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useIsMobile } from '@/hooks/use-mobile';

interface SettingsHeaderProps {
  saving: boolean;
  hasUnsavedChanges: boolean;
  isInitializing: boolean;
  onRestoreDefaults: () => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  saving,
  hasUnsavedChanges,
  isInitializing,
  onRestoreDefaults
}) => {
  const { t, renderText } = useGlobalTranslation('settings');
  const { getAccessibilityClasses } = useAccessibility();
  const isMobile = useIsMobile();
  const textClasses = getAccessibilityClasses('text');

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-amber-600 bg-clip-text text-transparent ${textClasses}`}>
          {renderText(t('title'))}
        </h1>
        <p className={`text-gray-600 mt-1 text-sm md:text-base ${textClasses}`}>{renderText(t('subtitle'))}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
        {saving && (
          <div className={`flex items-center gap-2 text-sm text-blue-600 ${textClasses}`}>
            <Loader2 className="h-4 w-4 animate-spin" />
            {renderText(t('saving'))}
          </div>
        )}
        {!saving && hasUnsavedChanges && (
          <div className={`flex items-center gap-2 text-sm text-amber-600 ${textClasses}`}>
            <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
            {renderText(t('autoSavePending'))}
          </div>
        )}
        {!saving && !hasUnsavedChanges && !isInitializing && (
          <div className={`flex items-center gap-2 text-sm text-green-600 ${textClasses}`}>
            <Check className="h-4 w-4" />
            {renderText(t('allChangesSaved'))}
          </div>
        )}
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"}
          onClick={onRestoreDefaults}
          className={`gap-2 w-full sm:w-auto ${textClasses}`}
        >
          <RotateCcw className="h-4 w-4" />
          {renderText(t('restoreDefaults'))}
        </Button>
      </div>
    </div>
  );
};

export default SettingsHeader;
