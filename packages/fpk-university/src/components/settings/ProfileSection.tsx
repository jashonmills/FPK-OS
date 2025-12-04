
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from 'lucide-react';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { useAccessibility } from '@/hooks/useAccessibility';
import EnhancedAvatarUpload from './EnhancedAvatarUpload';
import LearningStyleTags from './LearningStyleTags';

interface ProfileSectionProps {
  formData: {
    full_name: string;
    display_name: string;
    bio: string;
    avatar_url: string;
    learning_styles: string[];
  };
  userEmail: string;
  onFormChange: (key: string, value: string | number | boolean | string[]) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  formData,
  userEmail,
  onFormChange
}) => {
  const { t, renderText } = useGlobalTranslation('settings');
  const { getAccessibilityClasses } = useAccessibility();
  const textClasses = getAccessibilityClasses('text');
  const cardClasses = getAccessibilityClasses('card');

  return (
    <Card className={`fpk-card border-0 shadow-lg ${cardClasses}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
          <User className="h-5 w-5 text-purple-600" />
          {renderText(t('profile.title'))}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EnhancedAvatarUpload
          currentUrl={formData.avatar_url}
          onUpload={(url) => onFormChange('avatar_url', url)}
          userName={formData.full_name || formData.display_name || 'User'}
        />

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className={textClasses}>{renderText(t('profile.fullName'))}</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => onFormChange('full_name', e.target.value)}
              placeholder="Enter your full name"
              className={textClasses}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="display_name" className={textClasses}>{renderText(t('profile.displayName'))}</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => onFormChange('display_name', e.target.value)}
              placeholder="Choose a display name"
              className={textClasses}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className={textClasses}>{renderText(t('profile.email'))}</Label>
          <Input
            id="email"
            value={userEmail}
            readOnly
            className={`bg-gray-50 ${textClasses}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className={textClasses}>{renderText(t('profile.bio'))}</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => onFormChange('bio', e.target.value)}
            placeholder="Tell us about yourself"
            rows={3}
            className={textClasses}
          />
        </div>

        <LearningStyleTags
          selectedStyles={formData.learning_styles}
          onChange={(styles) => onFormChange('learning_styles', styles)}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
