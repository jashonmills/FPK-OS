import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PerformanceAnalyzerProps {
  onBack: () => void;
}

const PerformanceAnalyzer: React.FC<PerformanceAnalyzerProps> = ({ onBack }) => {
  return (
    <div className="h-full p-6 bg-card rounded-xl border border-border shadow-sm flex flex-col">
       <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
          <h2 className="text-xl font-bold text-foreground">Student Performance Analysis</h2>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          <div className="lg:col-span-2 space-y-6">
             {/* Mock Chart Area */}
             <div className="bg-muted/50 rounded-xl border border-border p-8 flex items-center justify-center h-80 relative overflow-hidden">
                <div className="absolute inset-0 flex items-end justify-between px-8 pb-8 opacity-50">
                   {[40, 60, 45, 70, 85, 65, 75, 90].map((h, i) => (
                      <div key={i} className="w-12 bg-primary rounded-t-md" style={{ height: `${h}%` }}></div>
                   ))}
                </div>
                <div className="relative z-10 text-center">
                   <BarChart3 className="h-12 w-12 text-primary/40 mx-auto mb-2" />
                   <p className="text-muted-foreground font-medium">Class Average Trend (Last 8 Weeks)</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-green-500/10 border-green-500/20">
                   <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h4 className="font-bold text-green-800 dark:text-green-400">Top Performing</h4>
                   </div>
                   <p className="text-sm text-green-700 dark:text-green-500">Unit 3: Ancient History saw a <strong>15% increase</strong> in average scores compared to previous units.</p>
                </div>
                <div className="p-4 border rounded-lg bg-orange-500/10 border-orange-500/20">
                   <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h4 className="font-bold text-orange-800 dark:text-orange-400">Needs Attention</h4>
                   </div>
                   <p className="text-sm text-orange-700 dark:text-orange-500">5 students are falling behind in <strong>Essay Writing</strong> assignments.</p>
                </div>
             </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 border border-border">
             <h3 className="font-bold text-foreground mb-4">AI Insights</h3>
             <div className="space-y-4">
                <div className="p-3 bg-card rounded shadow-sm border border-border text-sm text-muted-foreground">
                   "Based on recent quiz results, consider reviewing <strong className="text-foreground">Quadratic Equations</strong> before the final exam. 40% of students missed related questions."
                </div>
                <div className="p-3 bg-card rounded shadow-sm border border-border text-sm text-muted-foreground">
                   "Student <strong className="text-foreground">Alex Turner</strong> has shown significant improvement. Consider assigning advanced reading material."
                </div>
             </div>
             <Button className="w-full mt-6 bg-primary">Generate Full Report</Button>
          </div>
       </div>
    </div>
  );
};

export default PerformanceAnalyzer;
