
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

  const getTextSizeLabel = (value: number) => {
    const labels = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large'];
    return labels[value - 1] || 'Medium';
  };

  const getLineSpacingLabel = (value: number) => {
    const labels = ['Compact', 'Tight', 'Normal', 'Relaxed', 'Loose'];
    return labels[value - 1] || 'Normal';
  };

  console.log('LivePreview props:', { fontFamily, textSize, lineSpacing, colorContrast, comfortMode });

  return (
    <Card className="fpk-card border-2 border-purple-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-purple-700">
          {t('preview.title')} - Live Preview
        </CardTitle>
        <p className="text-sm text-gray-600">
          This preview shows how your accessibility settings affect the actual interface. 
          Changes apply globally across the entire application.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-base">
            {t('preview.description')}
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="font-semibold">Current Settings:</p>
            <p><strong>{t('preview.fontLabel')}:</strong> {fontFamily}</p>
            <p><strong>{t('preview.sizeLabel')}:</strong> {getTextSizeLabel(textSize)}</p>
            <p><strong>{t('preview.spacingLabel')}:</strong> {getLineSpacingLabel(lineSpacing)}</p>
            <p><strong>{t('preview.contrastLabel')}:</strong> {colorContrast}</p>
            <p><strong>{t('preview.comfortLabel')}:</strong> <em>{comfortMode}</em></p>
          </div>
          
          <div className="border-l-4 border-amber-400 bg-amber-50 p-3">
            <p className="text-amber-800 font-medium">
              💡 Pro Tip: These settings apply to the entire application immediately. 
              Navigate to other pages to see the global effect!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePreview;
