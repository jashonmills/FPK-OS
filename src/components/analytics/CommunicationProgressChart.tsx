import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

export const CommunicationProgressChart = () => {
  const { selectedFamily, selectedStudent } = useFamily();

  const { data, isLoading } = useQuery({
    queryKey: ["communication-progress", selectedFamily?.id, selectedStudent?.id],
    queryFn: async () => {
      if (!selectedFamily?.id || !selectedStudent?.id) return [];
      
      const { data, error } = await supabase.rpc("get_communication_progress_data", {
        p_family_id: selectedFamily.id,
        p_student_id: selectedStudent.id,
        p_days: 60
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
          <CardTitle>Communication/Language Progress</CardTitle>
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
          <CardTitle>Communication/Language Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-sm text-muted-foreground">No communication data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication/Language Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="measurement_date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="expressive_language" stroke="#8b5cf6" name="Expressive" />
            <Line type="monotone" dataKey="receptive_language" stroke="#3b82f6" name="Receptive" />
            <Line type="monotone" dataKey="pragmatic_skills" stroke="#10b981" name="Pragmatic" />
            <Line type="monotone" dataKey="articulation" stroke="#f59e0b" name="Articulation" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};