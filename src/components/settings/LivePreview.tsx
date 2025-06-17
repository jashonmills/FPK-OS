
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Eye, Settings } from 'lucide-react';

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
  const { t } = useTranslation('settings');

  const getTextSizeLabel = (value: number) => {
    const labels = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large'];
    return labels[value - 1] || 'Medium';
  };

  const getLineSpacingLabel = (value: number) => {
    const labels = ['Compact', 'Tight', 'Normal', 'Relaxed', 'Loose'];
    return labels[value - 1] || 'Normal';
  };

  return (
    <Card className="border-2 border-purple-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Eye className="h-5 w-5" />
          {t('preview.title')}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {t('preview.description')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sample content that shows accessibility settings in action */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Sample Content</h3>
          
          <p className="text-base">
            This text demonstrates how your accessibility settings affect readability. 
            You can see the font family, size, and spacing changes applied in real-time.
          </p>
          
          <div className="flex gap-2">
            <Button size="sm" variant="default">
              <Settings className="h-4 w-4 mr-2" />
              Sample Button
            </Button>
            <Button size="sm" variant="outline">
              Secondary Action
            </Button>
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium mb-2">Current Settings:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span><strong>{t('preview.fontLabel')}:</strong> {fontFamily}</span>
              <span><strong>{t('preview.sizeLabel')}:</strong> {getTextSizeLabel(textSize)}</span>
              <span><strong>{t('preview.spacingLabel')}:</strong> {getLineSpacingLabel(lineSpacing)}</span>
              <span><strong>{t('preview.contrastLabel')}:</strong> {colorContrast}</span>
              <span><strong>{t('preview.comfortLabel')}:</strong> {comfortMode}</span>
            </div>
          </div>
          
          <div className="border-l-4 border-amber-400 bg-amber-50 p-3 rounded-r">
            <p className="text-amber-800 font-medium text-sm">
              💡 {t('preview.tip')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePreview;
