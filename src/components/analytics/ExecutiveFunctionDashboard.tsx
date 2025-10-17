import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const ExecutiveFunctionDashboard = () => {
  const { selectedFamily, selectedStudent } = useFamily();

  const { data, isLoading } = useQuery({
    queryKey: ["executive-function", selectedFamily?.id, selectedStudent?.id],
    queryFn: async () => {
      if (!selectedFamily?.id || !selectedStudent?.id) return [];
      
      const { data, error } = await supabase.rpc("get_executive_function_data", {
        p_family_id: selectedFamily.id,
        p_student_id: selectedStudent.id,
        p_days: null // All time
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedFamily?.id && !!selectedStudent?.id,
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executive Function Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executive Function Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-sm text-muted-foreground">No executive function data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Executive Function Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((skill) => (
          <div key={skill.skill_area} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{skill.skill_area}</span>
                {getTrendIcon(skill.trend)}
              </div>
              <Badge variant="outline" className="text-xs">
                {skill.data_points} data points
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={Number(skill.current_score) * 10} className="flex-1" />
              <span className="text-sm font-medium min-w-12 text-right">
                {Number(skill.current_score).toFixed(1)}/10
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};