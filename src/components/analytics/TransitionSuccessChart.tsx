import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Loader2 } from "lucide-react";

export const TransitionSuccessChart = () => {
  const { selectedFamily, selectedStudent } = useFamily();

  const { data, isLoading } = useQuery({
    queryKey: ["transition-success", selectedFamily?.id, selectedStudent?.id],
    queryFn: async () => {
      if (!selectedFamily?.id || !selectedStudent?.id) return [];
      
      const { data, error } = await supabase.rpc("get_transition_success_data", {
        p_family_id: selectedFamily.id,
        p_student_id: selectedStudent.id,
        p_days: 60
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedFamily?.id && !!selectedStudent?.id,
  });

  const getColor = (value: number) => {
    if (value >= 80) return "#10b981";
    if (value >= 60) return "#f59e0b";
    return "#ef4444";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transition Success Rates</CardTitle>
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
          <CardTitle>Transition Success Rates</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-sm text-muted-foreground">No transition data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transition Success by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="transition_type" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="success_rate" name="Success Rate (%)" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(Number(entry.success_rate))} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};