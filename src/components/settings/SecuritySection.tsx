
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Shield } from 'lucide-react';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { useAccessibility } from '@/hooks/useAccessibility';
import PasswordChangeForm from './PasswordChangeForm';

interface SecuritySectionProps {
  formData: {
    two_factor_enabled: boolean;
  };
  onFormChange: (key: string, value: string | number | boolean) => void;
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({
  formData,
  onFormChange,
  onPasswordChange
}) => {
  const { t, renderText } = useGlobalTranslation('settings');
  const { getAccessibilityClasses } = useAccessibility();
  const textClasses = getAccessibilityClasses('text');
  const cardClasses = getAccessibilityClasses('card');

  return (
    <Card className={`fpk-card border-0 shadow-lg ${cardClasses}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
          <Shield className="h-5 w-5 text-red-600" />
          {renderText(t('security.title'))}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PasswordChangeForm onPasswordChange={onPasswordChange} />
        
        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="two_factor" className={textClasses}>{renderText(t('security.twoFactor'))}</Label>
            <p className={`text-sm text-gray-500 ${textClasses}`}>{renderText(t('security.twoFactorDesc'))}</p>
          </div>
          <Switch
            id="two_factor"
            checked={formData.two_factor_enabled}
            onCheckedChange={(checked) => onFormChange('two_factor_enabled', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySection;
