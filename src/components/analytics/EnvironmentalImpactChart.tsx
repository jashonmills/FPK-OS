import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

export const EnvironmentalImpactChart = () => {
  const { selectedFamily, selectedStudent } = useFamily();

  const { data, isLoading } = useQuery({
    queryKey: ["environmental-impact", selectedFamily?.id, selectedStudent?.id],
    queryFn: async () => {
      if (!selectedFamily?.id || !selectedStudent?.id) return [];
      
      const { data, error } = await supabase.rpc("get_environmental_impact_data", {
        p_family_id: selectedFamily.id,
        p_student_id: selectedStudent.id,
        p_days: 30
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedFamily?.id && !!selectedStudent?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Assessment</CardTitle>
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
          <CardTitle>Environmental Impact Assessment</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-sm text-muted-foreground">No environmental data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Factors Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="factor_category" />
            <YAxis domain={[-1, 1]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="positive_correlation" fill="#10b981" name="Positive Correlation" />
            <Bar dataKey="negative_correlation" fill="#ef4444" name="Negative Correlation" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};