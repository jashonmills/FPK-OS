
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Settings } from 'lucide-react';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';

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
  const { t, renderText } = useGlobalTranslation('settings');

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
          {renderText(t('preview.title'))}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {renderText(t('preview.description'))}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sample content that shows accessibility settings in action */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Sample Learning Content</h3>
          
          <p className="text-base">
            This is how your learning content will appear with your current settings. 
            You can adjust the font, size, spacing, and other preferences to create the most comfortable reading experience for you.
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
              <span><strong>{renderText(t('preview.fontLabel'))}:</strong> {fontFamily}</span>
              <span><strong>{renderText(t('preview.sizeLabel'))}:</strong> {getTextSizeLabel(textSize)}</span>
              <span><strong>{renderText(t('preview.spacingLabel'))}:</strong> {getLineSpacingLabel(lineSpacing)}</span>
              <span><strong>{renderText(t('preview.contrastLabel'))}:</strong> {colorContrast}</span>
              <span><strong>{renderText(t('preview.comfortLabel'))}:</strong> {comfortMode}</span>
            </div>
          </div>
          
          <div className="border-l-4 border-amber-400 bg-amber-50 p-3 rounded-r">
            <p className="text-amber-800 font-medium text-sm">
              💡 {renderText(t('preview.tip'))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePreview;
