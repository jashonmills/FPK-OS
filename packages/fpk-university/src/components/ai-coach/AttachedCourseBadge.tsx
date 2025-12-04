import React from 'react';
import { BookOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface AttachedCourseBadgeProps {
  courseSlug?: string;
  onRemove: () => void;
  className?: string;
}

export const AttachedCourseBadge: React.FC<AttachedCourseBadgeProps> = ({
  courseSlug,
  onRemove,
  className
}) => {
  const isMobile = useIsMobile();
  const { data: course } = useQuery({
    queryKey: ['course', courseSlug],
    queryFn: async () => {
      if (!courseSlug) return null;
      const { data } = await supabase
        .from('courses')
        .select('title')
        .eq('slug', courseSlug)
        .single();
      return data;
    },
    enabled: !!courseSlug
  });

  if (!courseSlug || !course) return null;

  return (
    <div className={cn("flex flex-wrap gap-2 mb-2", className)}>
      <div className={cn(
        "inline-flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full border border-blue-300 hover:bg-blue-200 transition-colors",
        isMobile ? "px-3 py-2 text-sm" : "px-3 py-1.5 text-sm"
      )}>
        <BookOpen className={isMobile ? "w-4 h-4" : "w-3 h-3"} />
        <span className={cn(
          "truncate",
          isMobile ? "max-w-[180px]" : "max-w-[200px]"
        )}>{course.title}</span>
        <button
          onClick={onRemove}
          className={cn(
            "hover:bg-blue-300 rounded-full transition-colors",
            isMobile ? "p-1 min-h-[28px] min-w-[28px]" : "p-0.5"
          )}
          aria-label={`Remove ${course.title}`}
        >
          <X className={isMobile ? "w-4 h-4" : "w-3 h-3"} />
        </button>
      </div>
    </div>
  );
};
