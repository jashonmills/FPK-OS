import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface SocialInteractionFunnelProps {
  studentId: string;
  familyId: string;
  dateRange?: { from: Date; to: Date };
  mode?: "live" | "demo" | "locked";
  sampleData?: any;
}

export const SocialInteractionFunnel = ({ studentId, familyId, sampleData, mode }: SocialInteractionFunnelProps) => {
  const { data: socialData, isLoading } = useQuery({
    queryKey: ["social-skills-data", studentId, familyId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_social_skills_data", {
        p_family_id: familyId,
        p_student_id: studentId
      });
      if (error) throw error;
      return data;
    },
    enabled: !sampleData && mode !== "demo",
  });

  const funnelData = Array.isArray(sampleData || socialData)
    ? (sampleData || socialData).map((item: any) => ({
        skill: item.skill_name,
        successRate: Number(item.success_rate),
        totalAttempts: Number(item.total_attempts),
      }))
    : [];

  const getBarColor = (index: number): string => {
    const colors = [
      "from-cyan-500 to-blue-500",
      "from-purple-500 to-pink-500", 
      "from-green-500 to-emerald-500",
      "from-amber-500 to-orange-500"
    ];
    return colors[index % colors.length];
  };

  if (isLoading && !sampleData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Skeleton className="h-full w-full bg-cyan-900/20" />
      </div>
    );
  }

  if (funnelData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-sm text-cyan-300/60">No social skills data available yet</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4 space-y-3 overflow-auto">
      {funnelData.map((item, index) => {
        const maxWidth = 100;
        const barWidth = (item.successRate / 100) * maxWidth;

        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-cyan-100">{item.skill}</span>
              <span className="text-cyan-300/70">{Math.round(item.successRate)}% ({item.totalAttempts})</span>
            </div>
            <div className="w-full bg-cyan-950/30 rounded-full h-7 overflow-hidden border border-cyan-500/20">
              <div
                className={`h-full bg-gradient-to-r ${getBarColor(index)} flex items-center justify-end px-2 text-white text-xs font-semibold transition-all duration-500`}
                style={{ width: `${barWidth}%` }}
              >
                {item.successRate > 15 && `${Math.round(item.successRate)}%`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
