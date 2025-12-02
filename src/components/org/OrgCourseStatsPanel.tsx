import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Activity, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ChevronDown,
  BarChart3
} from 'lucide-react';
import type { OrgCourseStats } from '@/hooks/useOrgCourseStats';
import { cn } from '@/lib/utils';

interface OrgCourseStatsPanelProps {
  stats: OrgCourseStats | undefined;
  isLoading: boolean;
}

export function OrgCourseStatsPanel({ stats, isLoading }: OrgCourseStatsPanelProps) {
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-white/10 border-white/20 animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-white/10 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { summary, byCourse } = stats;

  // Get trend indicator based on sessions
  const getTrendIcon = (sessions7: number, sessions30: number) => {
    const avgPer7Days = sessions30 / 4.3; // ~4.3 weeks in 30 days
    if (sessions7 > avgPer7Days * 1.1) return '↑';
    if (sessions7 < avgPer7Days * 0.9) return '↓';
    return '→';
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <Card className="bg-blue-500/20 border-blue-400/30">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-blue-200 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-white/80 truncate">Sessions (7d)</p>
                <p className="text-lg md:text-2xl font-semibold text-white">{summary.totalSessions7Days}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/20 border-green-400/30">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-green-200 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-white/80 truncate">Active Students</p>
                <p className="text-lg md:text-2xl font-semibold text-white">{summary.uniqueActiveStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/20 border-purple-400/30">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-purple-200 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-white/80 truncate">Avg Completion</p>
                <p className="text-lg md:text-2xl font-semibold text-white">{summary.avgCompletionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/20 border-amber-400/30">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-amber-200 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-white/80 truncate">Learning Time</p>
                <p className="text-lg md:text-2xl font-semibold text-white">
                  {summary.totalLearningMinutes > 60 
                    ? `${Math.round(summary.totalLearningMinutes / 60)}h` 
                    : `${summary.totalLearningMinutes}m`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-rose-500/20 border-rose-400/30 col-span-2 md:col-span-1">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-rose-200 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-white/80 truncate">Top Course</p>
                <p className="text-sm md:text-base font-semibold text-white truncate">
                  {summary.mostActiveCourse || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Activity Table - Collapsible */}
      {byCourse.length > 0 && (
        <Collapsible open={isActivityOpen} onOpenChange={setIsActivityOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full group bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-white/80" />
              <span className="text-sm font-medium text-white">Course Activity (Last 30 Days)</span>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                {byCourse.length} courses
              </Badge>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 text-white/60 transition-transform",
              isActivityOpen && "rotate-180"
            )} />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-2">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-3 text-white/80 font-medium">Course</th>
                      <th className="text-center p-3 text-white/80 font-medium">Sessions (7d)</th>
                      <th className="text-center p-3 text-white/80 font-medium hidden sm:table-cell">Sessions (30d)</th>
                      <th className="text-center p-3 text-white/80 font-medium hidden md:table-cell">Enrolled</th>
                      <th className="text-center p-3 text-white/80 font-medium">Completion</th>
                      <th className="text-center p-3 text-white/80 font-medium hidden sm:table-cell">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byCourse.slice(0, 10).map((course) => (
                      <tr key={course.courseId} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-3 text-white font-medium truncate max-w-[200px]">
                          {course.courseName}
                        </td>
                        <td className="p-3 text-center text-white">
                          <Badge variant="secondary" className="bg-blue-500/30 text-white">
                            {course.sessions7Days}
                          </Badge>
                        </td>
                        <td className="p-3 text-center text-white/80 hidden sm:table-cell">
                          {course.sessions30Days}
                        </td>
                        <td className="p-3 text-center text-white/80 hidden md:table-cell">
                          {course.enrollmentCount}
                        </td>
                        <td className="p-3 text-center">
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-white",
                              course.avgCompletion >= 70 ? "bg-green-500/30" :
                              course.avgCompletion >= 40 ? "bg-amber-500/30" :
                              "bg-red-500/30"
                            )}
                          >
                            {course.avgCompletion}%
                          </Badge>
                        </td>
                        <td className="p-3 text-center text-lg hidden sm:table-cell">
                          <span className={cn(
                            getTrendIcon(course.sessions7Days, course.sessions30Days) === '↑' ? "text-green-400" :
                            getTrendIcon(course.sessions7Days, course.sessions30Days) === '↓' ? "text-red-400" :
                            "text-white/60"
                          )}>
                            {getTrendIcon(course.sessions7Days, course.sessions30Days)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
