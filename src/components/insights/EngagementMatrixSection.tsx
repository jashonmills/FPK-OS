import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useEngagementMatrix } from '@/hooks/useEngagementMatrix';

interface EngagementMatrixSectionProps {
  cohortId?: string;
  isCompact?: boolean;
}

export const EngagementMatrixSection: React.FC<EngagementMatrixSectionProps> = ({
  cohortId,
  isCompact = false
}) => {
  const { 
    matrix, 
    quadrants, 
    thresholds, 
    totalStudents, 
    strugglingStudents, 
    excellentStudents,
    isLoading 
  } = useEngagementMatrix({ cohort_id: cohortId, window: '7d' });

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'high_eng_high_mastery': return 'bg-green-100 border-green-300 text-green-800';
      case 'high_eng_low_mastery': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low_eng_high_mastery': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'low_eng_low_mastery': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getQuadrantLabel = (quadrant: string) => {
    switch (quadrant) {
      case 'high_eng_high_mastery': return 'Excelling';
      case 'high_eng_low_mastery': return 'Engaged but Struggling';
      case 'low_eng_high_mastery': return 'Coasting';
      case 'low_eng_low_mastery': return 'At Risk';
      default: return quadrant;
    }
  };

  const getQuadrantIcon = (quadrant: string) => {
    switch (quadrant) {
      case 'high_eng_high_mastery': return <CheckCircle className="h-4 w-4" />;
      case 'high_eng_low_mastery': return <TrendingUp className="h-4 w-4" />;
      case 'low_eng_high_mastery': return <Target className="h-4 w-4" />;
      case 'low_eng_low_mastery': return <AlertTriangle className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getQuadrantDescription = (quadrant: string) => {
    switch (quadrant) {
      case 'high_eng_high_mastery': 
        return 'Students who are highly engaged and mastering the content well.';
      case 'high_eng_low_mastery': 
        return 'Students who are engaged but struggling with content mastery.';
      case 'low_eng_high_mastery': 
        return 'Students who have mastered content but show low engagement.';
      case 'low_eng_low_mastery': 
        return 'Students with both low engagement and low mastery - highest priority.';
      default: 
        return '';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quadrants) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No engagement data available</h3>
          <p className="text-sm text-muted-foreground">
            {cohortId 
              ? 'No engagement matrix data found for this cohort. Data will appear as students become active.'
              : 'Select a cohort to view engagement insights.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  const quadrantEntries = Object.entries(quadrants);
  const maxCount = Math.max(...Object.values(quadrants));

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Excelling</p>
                <p className="text-2xl font-bold text-green-600">{excellentStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-red-600">{strugglingStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalStudents > 0 ? Math.round((excellentStudents / totalStudents) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Matrix Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Engagement vs Mastery Matrix
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Engagement threshold: {Math.round((thresholds?.engagement || 0.6) * 100)}%</span>
            <span>Mastery threshold: {Math.round((thresholds?.mastery || 0.7) * 100)}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {quadrantEntries.map(([key, count]) => {
              const percentage = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
              const relativeSize = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <Card key={key} className={`border-2 ${getQuadrantColor(key)} transition-all hover:shadow-md`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getQuadrantIcon(key)}
                        <h4 className="font-semibold text-sm">{getQuadrantLabel(key)}</h4>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {count} students
                      </Badge>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{Math.round(percentage)}% of cohort</span>
                      </div>
                      <div className="w-full bg-white/50 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-current opacity-60 transition-all duration-500"
                          style={{ width: `${relativeSize}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {!isCompact && (
                      <p className="text-xs opacity-80 leading-relaxed">
                        {getQuadrantDescription(key)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {!isCompact && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h5 className="font-medium mb-2">Matrix Interpretation</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <strong>High Priority:</strong> Focus on "At Risk" students who need both engagement and mastery support.
                </div>
                <div>
                  <strong>Engagement Focus:</strong> "Coasting" students may benefit from more challenging or varied content.
                </div>
                <div>
                  <strong>Academic Support:</strong> "Engaged but Struggling" students need targeted academic interventions.
                </div>
                <div>
                  <strong>Maintain Excellence:</strong> "Excelling" students are performing well across both dimensions.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};