import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PerformanceAnalyzerProps {
  onBack: () => void;
}

const PerformanceAnalyzer: React.FC<PerformanceAnalyzerProps> = ({ onBack }) => {
  const [insights, setInsights] = useState<string[]>([
    '"Based on recent quiz results, consider reviewing Quadratic Equations before the final exam. 40% of students missed related questions."',
    '"Student Alex Turner has shown significant improvement. Consider assigning advanced reading material."'
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fullReport, setFullReport] = useState<string | null>(null);

  // Mock performance data - in production, this would come from useTeacherAnalytics hook
  const mockPerformanceData = {
    classAverage: [40, 60, 45, 70, 85, 65, 75, 90],
    topPerforming: {
      topic: 'Unit 3: Ancient History',
      improvement: 15
    },
    needsAttention: {
      topic: 'Essay Writing',
      studentCount: 5
    },
    recentActivity: [
      { student: 'Sarah M.', action: 'Completed Unit 4 Quiz', score: 92 },
      { student: 'James L.', action: 'Started Essay Assignment', score: null },
      { student: 'Emma K.', action: 'Completed Reading', score: null }
    ]
  };

  const generateFullReport = async () => {
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('teacher-ai-tools', {
        body: {
          toolType: 'performance-insights',
          data: {
            classAverageOverTime: mockPerformanceData.classAverage,
            topPerformingUnit: mockPerformanceData.topPerforming,
            areasNeedingAttention: mockPerformanceData.needsAttention,
            recentStudentActivity: mockPerformanceData.recentActivity,
            totalStudents: 28,
            averageCompletionRate: 73
          }
        }
      });

      if (error) throw error;

      if (data?.result) {
        setFullReport(data.result);
        toast.success('Report generated!');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full p-6 bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
        <h2 className="text-xl font-bold text-foreground">Student Performance Analysis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-2 space-y-6 overflow-y-auto">
          {/* Chart Area */}
          <div className="bg-muted/50 rounded-xl border border-border p-8 flex items-center justify-center h-80 relative overflow-hidden">
            <div className="absolute inset-0 flex items-end justify-between px-8 pb-8 opacity-50">
              {mockPerformanceData.classAverage.map((h, i) => (
                <div key={i} className="w-12 bg-primary rounded-t-md transition-all hover:bg-primary/80" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="relative z-10 text-center">
              <BarChart3 className="h-12 w-12 text-primary/40 mx-auto mb-2" />
              <p className="text-muted-foreground font-medium">Class Average Trend (Last 8 Weeks)</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-green-500/10 border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-bold text-green-800 dark:text-green-400">Top Performing</h4>
              </div>
              <p className="text-sm text-green-700 dark:text-green-500">
                {mockPerformanceData.topPerforming.topic} saw a <strong>{mockPerformanceData.topPerforming.improvement}% increase</strong> in average scores compared to previous units.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-orange-500/10 border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h4 className="font-bold text-orange-800 dark:text-orange-400">Needs Attention</h4>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-500">
                {mockPerformanceData.needsAttention.studentCount} students are falling behind in <strong>{mockPerformanceData.needsAttention.topic}</strong> assignments.
              </p>
            </div>
          </div>

          {/* Full Report */}
          {fullReport && (
            <div className="bg-muted/50 rounded-xl p-6 border border-border">
              <h3 className="font-bold text-foreground mb-4">AI-Generated Report</h3>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
                {fullReport}
              </pre>
            </div>
          )}
        </div>

        {/* AI Insights Panel */}
        <div className="bg-muted/50 rounded-xl p-6 border border-border flex flex-col">
          <h3 className="font-bold text-foreground mb-4">AI Insights</h3>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {insights.map((insight, idx) => (
              <div key={idx} className="p-3 bg-card rounded shadow-sm border border-border text-sm text-muted-foreground">
                <span dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
              </div>
            ))}
          </div>
          <Button 
            className="w-full mt-6 bg-primary"
            onClick={generateFullReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" /> Generate Full Report
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyzer;
