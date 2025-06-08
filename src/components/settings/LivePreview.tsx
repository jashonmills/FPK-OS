
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface UserProfile {
  font_family: string;
  color_contrast: string;
  comfort_mode: string;
  text_size: number;
  line_spacing: number;
  primary_language: string;
  dual_language_enabled: boolean;
}

interface LivePreviewProps {
  profile: UserProfile;
}

const LivePreview: React.FC<LivePreviewProps> = ({ profile }) => {
  const getTextSizeClass = (size: number) => {
    switch (size) {
      case 1: return 'text-sm';
      case 2: return 'text-base';
      case 3: return 'text-lg';
      default: return 'text-base';
    }
  };

  const getLineSpacingClass = (spacing: number) => {
    switch (spacing) {
      case 1: return 'leading-tight';
      case 2: return 'leading-relaxed';
      case 3: return 'leading-loose';
      default: return 'leading-relaxed';
    }
  };

  const getFontClass = (font: string) => {
    return font === 'OpenDyslexic' ? 'font-mono' : 'font-sans';
  };

  const getContrastClass = (contrast: string) => {
    return contrast === 'High' ? 'bg-black text-white' : 'bg-white text-gray-900';
  };

  const getComfortModeClass = (mode: string) => {
    switch (mode) {
      case 'Low-Stimulus': return 'bg-gray-50 border-gray-200';
      case 'Focus': return 'bg-blue-50 border-blue-200 ring-2 ring-blue-100';
      default: return 'bg-white border-gray-200';
    }
  };

  const sampleText = "Welcome to FPK University! This is how your text will appear with your current settings. You can adjust font size, line spacing, and contrast to match your preferences.";
  const translatedText = profile.primary_language !== 'English' ? "¡Bienvenido a la Universidad FPK!" : "";

  return (
    <Card className="fpk-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="h-4 w-4 text-purple-600" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className={`
            p-4 rounded-lg border transition-all duration-200
            ${getFontClass(profile.font_family)}
            ${getTextSizeClass(profile.text_size)}
            ${getLineSpacingClass(profile.line_spacing)}
            ${getContrastClass(profile.color_contrast)}
            ${getComfortModeClass(profile.comfort_mode)}
          `}
        >
          <h3 className="font-semibold mb-2">Sample Content</h3>
          
          {profile.dual_language_enabled && translatedText && (
            <p className="mb-2 text-sm opacity-75">{translatedText}</p>
          )}
          
          <p>{sampleText}</p>
          
          <div className="mt-3 pt-3 border-t border-current border-opacity-20">
            <p className="text-sm opacity-75">
              Font: {profile.font_family} • 
              Size: {['Small', 'Medium', 'Large'][profile.text_size - 1]} • 
              Spacing: {['Compact', 'Comfortable', 'Airy'][profile.line_spacing - 1]}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Language:</span>
            <span>{profile.primary_language}</span>
          </div>
          <div className="flex justify-between">
            <span>Dual-Language:</span>
            <span>{profile.dual_language_enabled ? 'On' : 'Off'}</span>
          </div>
          <div className="flex justify-between">
            <span>Contrast:</span>
            <span>{profile.color_contrast}</span>
          </div>
          <div className="flex justify-between">
            <span>Comfort Mode:</span>
            <span>{profile.comfort_mode}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePreview;
