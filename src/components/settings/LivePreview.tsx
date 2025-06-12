
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
  
  const getFontClass = () => {
    switch (fontFamily) {
      case 'OpenDyslexic':
        return 'font-opendyslexic';
      case 'Arial':
        return 'font-arial';
      case 'Georgia':
        return 'font-georgia';
      case 'Cursive':
        return 'font-cursive';
      case 'System':
        return 'font-system';
      default:
        return 'font-system';
    }
  };

  const getTextSize = () => {
    const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl'];
    return sizes[textSize - 1] || 'text-base';
  };

  const getLineHeight = () => {
    const heights = ['leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose'];
    return heights[lineSpacing - 1] || 'leading-normal';
  };

  const getBackgroundClasses = () => {
    switch (comfortMode) {
      case 'Low-Stimulus':
        return 'bg-gray-50 border-gray-200';
      case 'Focus Mode':
        return 'bg-blue-50 border-blue-200 shadow-lg';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getTextClasses = () => {
    switch (colorContrast) {
      case 'High':
        return 'text-black';
      default:
        return 'text-gray-800';
    }
  };

  const getTextSizeLabel = (value: number) => {
    const labels = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large'];
    return labels[value - 1] || 'Medium';
  };

  const getLineSpacingLabel = (value: number) => {
    const labels = ['Compact', 'Tight', 'Normal', 'Relaxed', 'Loose'];
    return labels[value - 1] || 'Normal';
  };

  console.log('LivePreview props:', { fontFamily, textSize, lineSpacing, colorContrast, comfortMode });
  console.log('Applied classes:', {
    font: getFontClass(),
    textSize: getTextSize(),
    lineHeight: getLineHeight(),
    background: getBackgroundClasses(),
    textColor: getTextClasses()
  });

  return (
    <Card className={`${getBackgroundClasses()} transition-all duration-300 border-2`}>
      <CardHeader>
        <CardTitle className={`${getTextSize()} ${getTextClasses()} ${getFontClass()}`}>
          {t('preview.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`${getTextSize()} ${getLineHeight()} ${getTextClasses()} ${getFontClass()} transition-all duration-300`}
        >
          <p className="mb-3">
            {t('preview.description')}
          </p>
          <p className="mb-3">
            <strong>{t('preview.fontLabel')}:</strong> {fontFamily} <br />
            <strong>{t('preview.sizeLabel')}:</strong> {getTextSizeLabel(textSize)} <br />
            <strong>{t('preview.spacingLabel')}:</strong> {getLineSpacingLabel(lineSpacing)} <br />
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
