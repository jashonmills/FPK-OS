import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCoachAnalytics } from '@/hooks/useCoachAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Brain, Clock, BookOpen, Flame, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AnalyticsDashboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLORS = ['hsl(var(--primary))', '#38BDF8', '#10B981', '#F59E0B', '#EF4444'];

export function AnalyticsDashboardModal({ open, onOpenChange }: AnalyticsDashboardModalProps) {
  const { analytics, loading } = useCoachAnalytics();
  const [timeRange, setTimeRange] = useState<'7' | '30' | 'all'>('30');

  if (!analytics) return null;

  // Mock data for charts - in production, this would come from detailed analytics queries
  const masteryOverTime = [
    { date: 'Week 1', score: 0.5 },
    { date: 'Week 2', score: 1.2 },
    { date: 'Week 3', score: 1.8 },
    { date: 'Week 4', score: analytics.masteryScore },
  ];

  const topicTimeDistribution = analytics.topicsExplored.slice(0, 5).map((topic, idx) => ({
    topic: topic.length > 20 ? topic.substring(0, 20) + '...' : topic,
    minutes: Math.floor(Math.random() * 120) + 30, // Mock data
  }));

  const learningStyleData = [
    { style: 'Socratic', value: analytics.modeRatio.socratic },
    { style: 'Free Chat', value: analytics.modeRatio.freeChat },
  ];

  const radarData = [
    { subject: 'Engagement', A: Math.min(100, analytics.sessionStreak * 20) },
    { subject: 'Mastery', A: (analytics.masteryScore / 3) * 100 },
    { subject: 'Consistency', A: Math.min(100, analytics.sessionStreak * 15) },
    { subject: 'Diversity', A: Math.min(100, analytics.topicsExplored.length * 5) },
    { subject: 'Time Invested', A: Math.min(100, (analytics.learningTimeMinutes / 600) * 100) },
  ];

  const learningHours = Math.floor(analytics.learningTimeMinutes / 60);
  const learningMinutes = analytics.learningTimeMinutes % 60;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="h-6 w-6 text-primary" />
            Learning Analytics Dashboard
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Mastery Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.masteryScore}/3.0</div>
                    <p className="text-xs text-muted-foreground mt-1">Average understanding</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Active Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{learningHours}h {learningMinutes}m</div>
                    <p className="text-xs text-muted-foreground mt-1">Total study time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-green-500" />
                      Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.topicsExplored.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Subjects explored</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.sessionStreak} days</div>
                    <p className="text-xs text-muted-foreground mt-1">Consecutive sessions</p>
                  </CardContent>
                </Card>
              </div>

              {/* Learning Style Distribution */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Style Distribution</CardTitle>
                    <CardDescription>Socratic vs Free Chat sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={learningStyleData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {learningStyleData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Profile</CardTitle>
                    <CardDescription>Your strengths across different dimensions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Performance"
                          dataKey="A"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mastery Score Over Time</CardTitle>
                  <CardDescription>Track your understanding progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={masteryOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 3]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Mastery Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="topics" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Time Spent per Topic</CardTitle>
                  <CardDescription>Your focus areas by study time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topicTimeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topic" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="minutes" fill="hsl(var(--primary))" name="Minutes" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Topics Explored</CardTitle>
                  <CardDescription>Complete list of subjects you've studied</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analytics.topicsExplored.map((topic, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {topic}
                      </Badge>
                    ))}
                    {analytics.topicsExplored.length === 0 && (
                      <p className="text-sm text-muted-foreground">No topics explored yet. Start a session to begin!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Insights</CardTitle>
                  <CardDescription>Personalized recommendations based on your activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h4 className="font-semibold mb-1">Session Consistency</h4>
                    <p className="text-sm text-muted-foreground">
                      {analytics.sessionStreak > 0
                        ? `Great job! You've maintained a ${analytics.sessionStreak}-day streak. Keep it going!`
                        : 'Start building a learning habit by studying consistently each day.'}
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold mb-1">Learning Style</h4>
                    <p className="text-sm text-muted-foreground">
                      You prefer {analytics.modeRatio.socraticPercent >= 50 ? 'Socratic' : 'Free Chat'} mode 
                      ({analytics.modeRatio.socraticPercent}%). 
                      {analytics.modeRatio.socraticPercent >= 50
                        ? ' Structured learning helps you build deep understanding.'
                        : ' Conversational learning keeps you engaged and curious.'}
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-semibold mb-1">Topic Diversity</h4>
                    <p className="text-sm text-muted-foreground">
                      {analytics.topicsExplored.length > 5
                        ? `You've explored ${analytics.topicsExplored.length} different topics. Your curiosity is impressive!`
                        : 'Try exploring different subjects to broaden your knowledge base.'}
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h4 className="font-semibold mb-1">Mastery Progress</h4>
                    <p className="text-sm text-muted-foreground">
                      {analytics.masteryScore >= 2.0
                        ? 'Excellent mastery! You demonstrate strong understanding of the material.'
                        : 'Continue practicing to deepen your understanding. Aim for a mastery score above 2.0.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
