import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Bell, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

interface NotificationPreference {
  id: string;
  notification_type: string;
  is_enabled: boolean;
  sound_enabled: boolean;
}

const notificationTypes = [
  { type: 'MESSAGE', label: 'Messages', description: 'Get notified when someone sends you a message' },
  { type: 'POST', label: 'Posts', description: 'Get notified about new posts in your circles' },
  { type: 'COMMENT', label: 'Comments', description: 'Get notified when someone comments on your posts' },
  { type: 'SUPPORT', label: 'Supports', description: 'Get notified when someone supports your posts' },
  { type: 'FOLLOW', label: 'Follows', description: 'Get notified when someone follows you' },
  { type: 'SYSTEM', label: 'System', description: 'Important system announcements and updates' },
];

const NotificationPreferences = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      // If no preferences exist, create default ones
      if (!data || data.length === 0) {
        await createDefaultPreferences();
        await fetchPreferences();
        return;
      }

      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPreferences = async () => {
    try {
      const defaultPrefs = notificationTypes.map(nt => ({
        user_id: user?.id,
        notification_type: nt.type,
        is_enabled: true,
        sound_enabled: nt.type !== 'FOLLOW',
      }));

      const { error } = await supabase
        .from('user_notification_preferences')
        .insert(defaultPrefs);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating default preferences:', error);
    }
  };

  const updatePreference = async (
    type: string,
    field: 'is_enabled' | 'sound_enabled',
    value: boolean
  ) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .update({ [field]: value })
        .eq('user_id', user?.id)
        .eq('notification_type', type);

      if (error) throw error;

      setPreferences(prev =>
        prev.map(p =>
          p.notification_type === type ? { ...p, [field]: value } : p
        )
      );

      toast.success('Preferences updated');
    } catch (error) {
      console.error('Error updating preference:', error);
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const getPreference = (type: string) => {
    return preferences.find(p => p.notification_type === type) || {
      id: '',
      notification_type: type,
      is_enabled: true,
      sound_enabled: true,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Notification Preferences</h1>
          <p className="text-muted-foreground">
            Customize how you want to be notified about activity
          </p>
        </div>

        <div className="space-y-4">
          {notificationTypes.map((notifType) => {
            const pref = getPreference(notifType.type);
            return (
              <Card key={notifType.type}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{notifType.label}</CardTitle>
                      <CardDescription>{notifType.description}</CardDescription>
                    </div>
                    <Switch
                      checked={pref.is_enabled}
                      onCheckedChange={(checked) =>
                        updatePreference(notifType.type, 'is_enabled', checked)
                      }
                      disabled={saving}
                    />
                  </div>
                </CardHeader>
                {pref.is_enabled && (
                  <>
                    <Separator />
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {pref.sound_enabled ? (
                            <Volume2 className="w-5 h-5 text-primary" />
                          ) : (
                            <VolumeX className="w-5 h-5 text-muted-foreground" />
                          )}
                          <div>
                            <Label htmlFor={`sound-${notifType.type}`} className="cursor-pointer">
                              Notification Sound
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Play a sound when you receive this notification
                            </p>
                          </div>
                        </div>
                        <Switch
                          id={`sound-${notifType.type}`}
                          checked={pref.sound_enabled}
                          onCheckedChange={(checked) =>
                            updatePreference(notifType.type, 'sound_enabled', checked)
                          }
                          disabled={saving}
                        />
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">About Notifications</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              • Notification sounds only play when you're actively using the app
            </p>
            <p>
              • You can disable specific notification types without affecting others
            </p>
            <p>
              • System notifications are important and should remain enabled
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationPreferences;