import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

export const SelfRegulationChart = () => {
  const { selectedFamily, selectedStudent } = useFamily();

  const { data, isLoading } = useQuery({
    queryKey: ["self-regulation", selectedFamily?.id, selectedStudent?.id],
    queryFn: async () => {
      if (!selectedFamily?.id || !selectedStudent?.id) return [];
      
      const { data, error } = await supabase.rpc("get_self_regulation_data", {
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
          <CardTitle>Self-Regulation Skills</CardTitle>
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
          <CardTitle>Self-Regulation Skills</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-sm text-muted-foreground">No self-regulation data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Self-Regulation Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="measurement_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="emotional_regulation" stroke="#8b5cf6" name="Emotional Regulation" />
            <Line type="monotone" dataKey="impulse_control" stroke="#3b82f6" name="Impulse Control" />
            <Line type="monotone" dataKey="self_calming" stroke="#10b981" name="Self-Calming" />
            <Line type="monotone" dataKey="frustration_tolerance" stroke="#f59e0b" name="Frustration Tolerance" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};