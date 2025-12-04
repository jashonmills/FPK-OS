import { useState, useEffect } from 'react';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AILearningCoachSettingsProps {
  orgId: string;
}

export function AILearningCoachSettings({ orgId }: AILearningCoachSettingsProps) {
  const { toast } = useToast();
  const [isFreeChatEnabled, setIsFreeChatEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current setting
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching AI settings:', error);
          return;
        }

        if (data) {
          // Use type assertion to access the new column
          const orgData = data as any;
          setIsFreeChatEnabled(orgData.is_ai_free_chat_enabled ?? true);
        }
      } catch (error) {
        console.error('Exception fetching AI settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [orgId]);

  const handleFreeChatToggle = async (newValue: boolean) => {
    setIsSaving(true);
    setIsFreeChatEnabled(newValue); // Optimistic UI update

    try {
      // Use type assertion for the update
      const { error } = await supabase
        .from('organizations')
        .update({ 
          is_ai_free_chat_enabled: newValue,
          ai_settings_updated_at: new Date().toISOString()
        } as any)
        .eq('id', orgId);

      if (error) {
        console.error('Error updating AI settings:', error);
        toast({
          title: "Error",
          description: "Failed to save AI setting. Please try again.",
          variant: "destructive",
        });
        setIsFreeChatEnabled(!newValue); // Revert on failure
      } else {
        toast({
          title: "Success",
          description: "AI Learning Coach settings have been updated.",
        });
      }
    } catch (error) {
      console.error('Exception updating AI settings:', error);
      toast({
        title: "Error",
        description: "Failed to save AI setting. Please try again.",
        variant: "destructive",
      });
      setIsFreeChatEnabled(!newValue); // Revert on failure
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <OrgCard className="bg-orange-500/65 border-orange-400/50">
      <OrgCardHeader>
        <OrgCardTitle className="text-white">AI Learning Coach Settings</OrgCardTitle>
        <OrgCardDescription className="text-white/80">
          Control how students interact with the AI Learning Coach
        </OrgCardDescription>
      </OrgCardHeader>
      <OrgCardContent className="space-y-4">
        <Alert className="bg-white/10 border-white/20">
          <Info className="h-4 w-4 text-white" />
          <AlertDescription className="text-white/90 text-sm">
            These settings apply to all students in your organization and take effect immediately.
          </AlertDescription>
        </Alert>
        
        <div className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5">
          <div className="space-y-1 flex-1 pr-4">
            <Label htmlFor="free-chat-toggle" className="text-white font-medium cursor-pointer">
              Enable "Free Chat" Mode
            </Label>
            <p className="text-sm text-white/60 leading-relaxed">
              When disabled, students can only use "Structured Learning Sessions" (Socratic method) 
              and cannot access direct Q&A modes. This ensures focused, guided learning.
            </p>
          </div>
          <Switch
            id="free-chat-toggle"
            checked={isFreeChatEnabled}
            onCheckedChange={handleFreeChatToggle}
            disabled={isSaving}
          />
        </div>
      </OrgCardContent>
    </OrgCard>
  );
}
