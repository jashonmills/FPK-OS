import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Check, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFamily } from "@/contexts/FamilyContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const IntegrationsTab = () => {
  const navigate = useNavigate();
  const { selectedFamily } = useFamily();
  const [hasGarminConnection, setHasGarminConnection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkGarminConnection = async () => {
      if (!selectedFamily) return;

      const { data, error } = await supabase
        .from("external_integrations")
        .select("*")
        .eq("family_id", selectedFamily.id)
        .eq("provider", "garmin")
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        setHasGarminConnection(true);
      }
      setIsLoading(false);
    };

    checkGarminConnection();
  }, [selectedFamily]);

  const handleConnectGarmin = () => {
    toast.info("Garmin integration coming soon! This will connect to your Garmin device for real-time biometric monitoring.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Integrations</h2>
        <p className="text-muted-foreground">
          Connect external devices and services to enhance your monitoring capabilities
        </p>
      </div>

      {/* Garmin Health */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Garmin Health</CardTitle>
                <CardDescription>Real-time biometric monitoring and sleep analysis</CardDescription>
              </div>
            </div>
            {hasGarminConnection && (
              <Badge variant="default" className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Real-Time Alerts</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Live heart rate monitoring</li>
                <li>• Stress level tracking</li>
                <li>• Predictive meltdown alerts</li>
                <li>• Battery status monitoring</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Advanced Sleep Analysis</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Detailed sleep stages (REM, Deep, Light)</li>
                <li>• Sleep score tracking</li>
                <li>• Correlation with behavior patterns</li>
                <li>• Automatic daily sync</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {hasGarminConnection ? (
              <>
                <Button onClick={() => navigate("/live-data-hub")} className="gap-2">
                  <Activity className="h-4 w-4" />
                  View Live Data
                </Button>
                <Button variant="outline">Manage Connection</Button>
              </>
            ) : (
              <>
                <Button onClick={handleConnectGarmin} className="gap-2">
                  <Activity className="h-4 w-4" />
                  Connect Garmin
                </Button>
                <Button variant="outline" onClick={() => navigate("/garmin-demo")} className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Preview Demo
                </Button>
              </>
            )}
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Pro Feature:</strong> Garmin Health integration is available on Pro plans. 
              Upgrade to unlock real-time biometric monitoring and advanced sleep analysis.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Future integrations placeholder */}
      <Card className="opacity-60">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>More Integrations Coming Soon</CardTitle>
              <CardDescription>Apple Health, Fitbit, and more...</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
