import React from 'react';
import { BookOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-300 hover:bg-blue-200 transition-colors">
        <BookOpen className="w-3 h-3" />
        <span className="max-w-[200px] truncate">{course.title}</span>
        <button
          onClick={onRemove}
          className="hover:bg-blue-300 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${course.title}`}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
