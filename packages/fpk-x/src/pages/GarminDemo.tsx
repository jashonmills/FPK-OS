import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Heart, Activity, Moon, TrendingUp, Sparkles, ArrowRight, Zap, Bell } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, ComposedChart } from "recharts";
import { useNavigate } from "react-router-dom";

const GarminDemo = () => {
  const navigate = useNavigate();
  const [act2Started, setAct2Started] = useState(false);
  const [heartRate, setHeartRate] = useState(85);
  const [showNotification, setShowNotification] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [timelineStep, setTimelineStep] = useState(0);

  // Act 2: Heart rate simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setHeartRate((prev) => {
        if (prev >= 115) {
          clearInterval(interval);
          setShowNotification(true);
          setTimeout(() => {
            setTimelineStep(2); // Move to sensory break
            // Gradually return to baseline
            const returnInterval = setInterval(() => {
              setHeartRate((hr) => {
                if (hr <= 85) {
                  clearInterval(returnInterval);
                  setIsSimulating(false);
                  return 85;
                }
                return hr - 2;
              });
            }, 100);
          }, 3000);
          return 115;
        }
        return prev + 3;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const sleepData = {
    score: 68,
    deep: 72,
    light: 185,
    rem: 95,
    awake: 28,
  };

  const weeklyData = [
    { day: "Mon", sleepScore: 82, incidents: 0 },
    { day: "Tue", sleepScore: 75, incidents: 1 },
    { day: "Wed", sleepScore: 88, incidents: 0 },
    { day: "Thu", sleepScore: 65, incidents: 2 },
    { day: "Fri", sleepScore: 92, incidents: 0 },
    { day: "Sat", sleepScore: 58, incidents: 3 },
    { day: "Sun", sleepScore: 68, incidents: 2 },
  ];

  const heartRateData = Array.from({ length: 30 }, (_, i) => ({
    time: i,
    bpm: heartRate - 10 + Math.random() * 20 + (i > 15 ? (heartRate - 85) : 0),
  }));

  const handleSimulateStress = () => {
    setAct2Started(true);
    setIsSimulating(true);
    setTimelineStep(1);
    setShowNotification(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <Alert className="border-orange-500 bg-orange-500/10 backdrop-blur">
            <Bell className="h-4 w-4 text-orange-500" />
            <AlertDescription className="ml-2">
              <strong>Heads Up:</strong> Jace's heart rate is elevated. A sensory break may be needed.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="container mx-auto py-12 px-4 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4" variant="outline">
            <Sparkles className="h-3 w-3 mr-1" />
            Interactive Demo
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Experience Your AI Co-Pilot
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow Jace through a 24-hour cycle and see how Garmin Health transforms data into predictive insights
          </p>
        </div>

        {/* Act 1: Morning Briefing */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Moon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Act 1: The Morning Briefing</h2>
              <p className="text-muted-foreground">The Proactive Start</p>
            </div>
          </div>

          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">☀️ Good Morning!</CardTitle>
                <Badge variant="secondary">Yesterday's Sleep Report</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-orange-500">{sleepData.score}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">Sleep Score: Fair</h3>
                    <Badge variant="outline">68/100</Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Jace had <strong>less deep sleep than usual</strong> ({sleepData.deep} min vs. 90 min average) 
                    and was <strong>restless around 2 AM</strong>. This might mean he has lower energy reserves today.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Deep Sleep</p>
                  <p className="text-2xl font-bold text-blue-500">{sleepData.deep}m</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Light Sleep</p>
                  <p className="text-2xl font-bold text-purple-500">{sleepData.light}m</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">REM Sleep</p>
                  <p className="text-2xl font-bold text-green-500">{sleepData.rem}m</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Awake</p>
                  <p className="text-2xl font-bold text-orange-500">{sleepData.awake}m</p>
                </div>
              </div>

              <Alert className="border-primary bg-primary/5">
                <Zap className="h-4 w-4 text-primary" />
                <AlertDescription className="ml-2">
                  <strong>AI Recommendation:</strong> Let's be mindful of Jace's stress levels today, 
                  especially after lunch. Consider reducing sensory demands during transitions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        {/* Act 2: Real-Time Alert */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Act 2: The Predictive Alert</h2>
              <p className="text-muted-foreground">The Real-Time Save</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex flex-col items-center">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                timelineStep >= 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <p className="text-sm mt-2">Morning Circle</p>
            </div>
            <div className="flex-1 h-1 bg-border mx-4">
              <Progress value={timelineStep >= 1 ? 100 : 0} className="h-full" />
            </div>
            <div className="flex flex-col items-center">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                timelineStep >= 1 ? 'bg-orange-500 text-white animate-pulse' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <p className="text-sm mt-2">Math Lesson</p>
            </div>
            <div className="flex-1 h-1 bg-border mx-4">
              <Progress value={timelineStep >= 2 ? 100 : 0} className="h-full" />
            </div>
            <div className="flex flex-col items-center">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                timelineStep >= 2 ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
              <p className="text-sm mt-2">Sensory Break</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Monitor */}
            <Card className="border-2 border-red-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Live Heart Rate Monitor
                  </CardTitle>
                  <Badge variant={heartRate > 100 ? "destructive" : "default"}>
                    {heartRate} bpm
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={heartRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[60, 130]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="bpm" 
                      stroke={heartRate > 100 ? "#ef4444" : "#22c55e"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                {timelineStep === 2 && (
                  <p className="text-sm text-green-500 mt-2 animate-fade-in">
                    ✓ Returning to baseline after intervention
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Control Panel */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Interactive Demo Control</CardTitle>
                <CardDescription>Experience the power of real-time monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!act2Started ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Jace is currently in his math lesson. His baseline heart rate is 85 bpm. 
                      Click below to simulate a stress event and see the system respond in real-time.
                    </p>
                    <Button 
                      onClick={handleSimulateStress} 
                      size="lg" 
                      className="w-full gap-2"
                    >
                      <Activity className="h-5 w-5" />
                      Simulate Stress Event
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    {timelineStep === 1 && (
                      <div className="p-4 bg-orange-500/10 border-2 border-orange-500 rounded-lg animate-fade-in">
                        <p className="font-semibold text-orange-500 mb-2">⚠️ Heart Rate Climbing</p>
                        <p className="text-sm">
                          The system is detecting sustained elevation. Alert will trigger at 110 bpm...
                        </p>
                      </div>
                    )}
                    {timelineStep === 2 && (
                      <div className="p-4 bg-green-500/10 border-2 border-green-500 rounded-lg animate-fade-in">
                        <p className="font-semibold text-green-500 mb-2">✓ Intervention Successful</p>
                        <p className="text-sm">
                          Teacher was alerted. Sensory break initiated. Heart rate returning to baseline.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Act 3: Evening Analysis */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Act 3: Connecting the Dots</h2>
              <p className="text-muted-foreground">The Evening Analysis</p>
            </div>
          </div>

          <Card className="border-2 border-blue-500/20 shadow-lg">
            <CardHeader>
              <CardTitle>Sleep & Behavior Correlation</CardTitle>
              <CardDescription>7-Day Pattern Analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="sleepScore" fill="hsl(var(--primary))" name="Sleep Score" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="incidents" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Stress Events"
                  />
                </ComposedChart>
              </ResponsiveContainer>

              <Alert className="border-blue-500 bg-blue-500/5">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <AlertDescription className="ml-2">
                  <p className="font-semibold mb-2">AI-Discovered Pattern:</p>
                  <p className="text-sm">
                    For Jace, a night with a Sleep Score below <strong>70</strong> increases the likelihood 
                    of a significant stress event the next day by <strong className="text-blue-500">40%</strong>. 
                    {timelineStep === 2 && (
                      <span className="block mt-2 text-blue-500">
                        The alert you just received was predicted by last night's sleep score of 68.
                      </span>
                    )}
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Stop Reacting. Start Predicting.</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                This is the power of the Pro Plan. Connect your Garmin device and turn your data into your co-pilot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Upgrade to Pro Now
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => navigate("/settings?tab=integrations")}>
                  View Integration Settings
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Compatible with Garmin vívoactive, Forerunner, fēnix, and more
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default GarminDemo;
