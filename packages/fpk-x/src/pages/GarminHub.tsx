import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Heart, Battery, Bluetooth, AlertTriangle } from "lucide-react";
import { garminSimulator, BiometricState } from "@/lib/garmin-simulator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Garmin Hub App
 * 
 * This is the lightweight app that runs on a classroom tablet.
 * It streams biometric data from the Garmin watch to the cloud.
 * 
 * In development mode, it uses the simulator. In production,
 * it will connect to the real Garmin Health SDK.
 */
const GarminHub = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentState, setCurrentState] = useState<BiometricState>('resting');
  const [currentData, setCurrentData] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null);

  // Family/Student selection would come from login in production
  const familyId = "demo-family-id";

  useEffect(() => {
    if (!isStreaming) return;

    // Set up Supabase Realtime channel
    const newChannel = supabase.channel(`family:${familyId}:biometrics`);
    setChannel(newChannel);

    newChannel
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to realtime channel');
          newChannel.send({
            type: 'broadcast',
            event: 'connection_status',
            payload: { connected: true }
          });
        }
      });

    // Start streaming data every second
    const interval = setInterval(() => {
      const data = garminSimulator.getLiveStreamData();
      setCurrentData(data);

      // Broadcast to all connected clients
      newChannel.send({
        type: 'broadcast',
        event: 'biometric_update',
        payload: data
      });

      // Check for alerts (simplified version)
      if (data.heartRate > 100 && currentState === 'stressed') {
        triggerAlert('heart_rate_elevated', data.heartRate);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      newChannel.unsubscribe();
    };
  }, [isStreaming, familyId, currentState]);

  const triggerAlert = async (alertType: string, value: number) => {
    try {
      await supabase.functions.invoke('trigger-biometric-alert', {
        body: {
          familyId,
          studentId: 'demo-student-id',
          alertType,
          triggerValue: value,
          baselineValue: 78
        }
      });
      toast.success('Alert triggered');
    } catch (error) {
      console.error('Alert error:', error);
    }
  };

  const handleStateChange = (newState: BiometricState) => {
    setCurrentState(newState);
    garminSimulator.setState(newState);
    toast.success(`Simulator state: ${newState}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Garmin Hub</h1>
          <p className="text-muted-foreground">Classroom Tablet Streaming App</p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bluetooth className={`h-8 w-8 ${isStreaming ? 'text-green-500' : 'text-muted-foreground'}`} />
                <div>
                  <CardTitle>Connection Status</CardTitle>
                  <CardDescription>
                    {isStreaming ? 'Streaming data to cloud' : 'Not connected'}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={isStreaming ? "default" : "secondary"}>
                {isStreaming ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Manage data streaming and simulator state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => setIsStreaming(!isStreaming)}
                variant={isStreaming ? "destructive" : "default"}
                className="w-full"
              >
                {isStreaming ? "Stop Streaming" : "Start Streaming"}
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Simulator State (Development Mode)</label>
              <Select value={currentState} onValueChange={(value: BiometricState) => handleStateChange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resting">Resting (Normal)</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="stressed">Stressed (Triggers Alerts)</SelectItem>
                  <SelectItem value="sleeping">Sleeping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Live Data Display */}
        {isStreaming && currentData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{currentData.heartRate}</div>
                <p className="text-xs text-muted-foreground">bpm</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
                <Activity className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{currentData.stressLevel}</div>
                <p className="text-xs text-muted-foreground">%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Battery</CardTitle>
                <Battery className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{currentData.batteryLevel}</div>
                <p className="text-xs text-muted-foreground">%</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <CardTitle>Development Mode</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              This is the simulated Hub App. In production, this would run on a classroom tablet and connect 
              to a real Garmin device via Bluetooth using the Garmin Health SDK.
            </p>
            <p>
              <strong>To test alerts:</strong> Set the simulator to "Stressed" state and start streaming. 
              The system will trigger alerts that family members will receive.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GarminHub;
