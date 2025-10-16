import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

export const AttentionSpanChart = () => {
  const { selectedFamily, selectedStudent } = useFamily();

  const { data, isLoading } = useQuery({
    queryKey: ["attention-span", selectedFamily?.id, selectedStudent?.id],
    queryFn: async () => {
      if (!selectedFamily?.id || !selectedStudent?.id) return [];
      
      const { data, error } = await supabase.rpc("get_attention_span_data", {
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
          <CardTitle>Attention Span Tracking</CardTitle>
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
          <CardTitle>Attention Span Tracking</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-sm text-muted-foreground">No attention data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attention Span by Task Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="log_date" />
            <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="avg_attention_minutes" fill="#8b5cf6" name="Avg Attention (min)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};