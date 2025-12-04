import { useState, useEffect } from "react";
import { useFamily } from "@/contexts/FamilyContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Battery, Heart, Wifi, WifiOff, Settings } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface LiveBiometrics {
  heartRate: number;
  stressLevel: number;
  batteryLevel: number;
  timestamp: Date;
}

const LiveDataHub = () => {
  const { selectedStudent, selectedFamily } = useFamily();
  const [isConnected, setIsConnected] = useState(false);
  const [liveBiometrics, setLiveBiometrics] = useState<LiveBiometrics | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [alertConfig, setAlertConfig] = useState({
    heartRateThreshold: 20,
    heartRateDuration: 60,
    stressLevelThreshold: 75,
  });
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    if (!selectedFamily || !selectedStudent) return;

    // Subscribe to realtime channel for live biometric data
    const channel = supabase.channel(`family:${selectedFamily.id}:biometrics`);

    channel
      .on('broadcast', { event: 'biometric_update' }, (payload) => {
        const data = payload.payload as LiveBiometrics;
        setLiveBiometrics(data);
        setIsConnected(true);
        
        // Add to historical data (keep last 5 minutes)
        setHistoricalData(prev => {
          const updated = [...prev, { time: new Date(data.timestamp).toLocaleTimeString(), ...data }];
          return updated.slice(-60); // Keep last 60 data points (5 min at 1/sec)
        });
      })
      .on('broadcast', { event: 'connection_status' }, (payload) => {
        setIsConnected(payload.payload.connected);
      })
      .subscribe();

    // Fetch current alert configuration
    const fetchAlertConfig = async () => {
      const { data } = await supabase
        .from("alert_configurations")
        .select("*")
        .eq("family_id", selectedFamily.id)
        .eq("student_id", selectedStudent.id)
        .maybeSingle();

      if (data) {
        setAlertConfig({
          heartRateThreshold: data.heart_rate_threshold_percent,
          heartRateDuration: data.heart_rate_duration_seconds,
          stressLevelThreshold: data.stress_level_threshold,
        });
      }
    };

    fetchAlertConfig();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedFamily, selectedStudent]);

  const saveAlertConfig = async () => {
    if (!selectedFamily || !selectedStudent) return;

    const { error } = await supabase
      .from("alert_configurations")
      .upsert({
        family_id: selectedFamily.id,
        student_id: selectedStudent.id,
        heart_rate_threshold_percent: alertConfig.heartRateThreshold,
        heart_rate_duration_seconds: alertConfig.heartRateDuration,
        stress_level_threshold: alertConfig.stressLevelThreshold,
        is_active: true,
      });

    if (error) {
      toast.error("Failed to save configuration");
    } else {
      toast.success("Alert configuration saved");
      setShowConfig(false);
    }
  };

  if (!selectedStudent) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertDescription>Please select a student to view live biometric data.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Live Data Hub</h1>
          <p className="text-muted-foreground">Real-time biometric monitoring for {selectedStudent.student_name}</p>
        </div>
        <Button variant="outline" onClick={() => setShowConfig(!showConfig)}>
          <Settings className="h-4 w-4 mr-2" />
          Alert Settings
        </Button>
      </div>

      {showConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Alert Configuration</CardTitle>
            <CardDescription>Customize when you receive biometric alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Heart Rate Threshold (%)</Label>
                <Input
                  type="number"
                  value={alertConfig.heartRateThreshold}
                  onChange={(e) => setAlertConfig({ ...alertConfig, heartRateThreshold: parseInt(e.target.value) })}
                />
                <p className="text-sm text-muted-foreground">Alert when HR exceeds baseline by this %</p>
              </div>
              <div className="space-y-2">
                <Label>Duration (seconds)</Label>
                <Input
                  type="number"
                  value={alertConfig.heartRateDuration}
                  onChange={(e) => setAlertConfig({ ...alertConfig, heartRateDuration: parseInt(e.target.value) })}
                />
                <p className="text-sm text-muted-foreground">Must be sustained for this long</p>
              </div>
              <div className="space-y-2">
                <Label>Stress Level Threshold (%)</Label>
                <Input
                  type="number"
                  value={alertConfig.stressLevelThreshold}
                  onChange={(e) => setAlertConfig({ ...alertConfig, stressLevelThreshold: parseInt(e.target.value) })}
                />
                <p className="text-sm text-muted-foreground">Alert when stress exceeds this level</p>
              </div>
            </div>
            <Button onClick={saveAlertConfig}>Save Configuration</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Connection Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
            {isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isConnected ? "Receiving live data" : "Waiting for connection..."}
            </p>
          </CardContent>
        </Card>

        {/* Heart Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {liveBiometrics?.heartRate || '--'} <span className="text-sm font-normal text-muted-foreground">bpm</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {liveBiometrics ? new Date(liveBiometrics.timestamp).toLocaleTimeString() : 'No data'}
            </p>
          </CardContent>
        </Card>

        {/* Stress Level */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {liveBiometrics?.stressLevel || '--'} <span className="text-sm font-normal text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Battery: {liveBiometrics?.batteryLevel || '--'}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Historical Chart */}
      <Card>
        <CardHeader>
          <CardTitle>5-Minute Historical View</CardTitle>
          <CardDescription>Live biometric trends</CardDescription>
        </CardHeader>
        <CardContent>
          {historicalData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke="#ef4444" name="Heart Rate (bpm)" />
                <Line yAxisId="right" type="monotone" dataKey="stressLevel" stroke="#f97316" name="Stress Level (%)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Waiting for live data stream...
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <Battery className="h-4 w-4" />
        <AlertDescription>
          <strong>Development Mode:</strong> This page is displaying simulated data. Once Garmin API keys are configured, 
          it will display real-time data from the connected Garmin device.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LiveDataHub;
