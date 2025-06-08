
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface LivePreviewProps {
  fontFamily: string;
  textSize: number;
  lineSpacing: number;
  colorContrast: string;
  comfortMode: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  fontFamily,
  textSize,
  lineSpacing,
  colorContrast,
  comfortMode
}) => {
  const { t } = useTranslation();
  
  const getFontFamily = () => {
    switch (fontFamily) {
      case 'OpenDyslexic':
        return 'OpenDyslexic, sans-serif';
      case 'Arial':
        return 'Arial, sans-serif';
      case 'Georgia':
        return 'Georgia, serif';
      default:
        return 'system-ui, sans-serif';
    }
  };

  const getTextSize = () => {
    const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
    return sizes[textSize - 1] || 'text-base';
  };

  const getLineHeight = () => {
    const heights = ['leading-tight', 'leading-normal', 'leading-relaxed', 'leading-loose'];
    return heights[lineSpacing - 1] || 'leading-normal';
  };

  const getBackgroundClasses = () => {
    if (comfortMode === 'Low-Stimulus') {
      return 'bg-gray-50 border-gray-200';
    } else if (comfortMode === 'Focus Mode') {
      return 'bg-blue-50 border-blue-200 shadow-lg';
    }
    return 'bg-white border-gray-200';
  };

  const getTextClasses = () => {
    if (colorContrast === 'High Contrast') {
      return 'text-black';
    }
    return 'text-gray-800';
  };

  return (
    <Card className={`${getBackgroundClasses()} transition-all duration-300`}>
      <CardHeader>
        <CardTitle className={`${getTextSize()} ${getTextClasses()}`}>
          {t('preview.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`${getTextSize()} ${getLineHeight()} ${getTextClasses()} transition-all duration-300`}
          style={{ fontFamily: getFontFamily() }}
        >
          <p className="mb-3">
            {t('preview.description')}
          </p>
          <p className="mb-3">
            <strong>{t('preview.fontLabel')}:</strong> {fontFamily} <br />
            <strong>{t('preview.sizeLabel')}:</strong> {textSize} <br />
            <strong>{t('preview.spacingLabel')}:</strong> {lineSpacing} <br />
            <strong>{t('preview.contrastLabel')}:</strong> {colorContrast}
          </p>
          <p>
            {t('preview.comfortLabel')}: <em>{comfortMode}</em>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePreview;
