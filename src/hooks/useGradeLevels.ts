import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { GradeLevel, GradeLevelDisplay } from '@/types/grade-levels';

export function useGradeLevels() {
  return useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grade_levels')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as GradeLevel[];
    },
    staleTime: Infinity, // Static reference data
  });
}

export function formatGradeLevelHeading(gradeLevel: GradeLevel): string {
  return `${gradeLevel.irish_name} (${gradeLevel.us_name})`;
}

export function useGradeLevelsDisplay() {
  const { data: gradeLevels, ...rest } = useGradeLevels();
  
  const displayLevels: GradeLevelDisplay[] | undefined = gradeLevels?.map(gl => ({
    id: gl.id,
    heading: formatGradeLevelHeading(gl),
    stage: gl.stage as any,
    display_order: gl.display_order,
  }));
  
  return { data: displayLevels, ...rest };
}
