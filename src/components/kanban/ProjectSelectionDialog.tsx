import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface ProjectSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectSelected: (projectId: string) => void;
}

export const ProjectSelectionDialog = ({ 
  open, 
  onOpenChange, 
  onProjectSelected 
}: ProjectSelectionDialogProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProjects();
    }
  }, [open]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, color')
      .order('name');

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Project</DialogTitle>
          <DialogDescription>
            Which project should this task be created in?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            projects.map(project => (
              <Button
                key={project.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => onProjectSelected(project.id)}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
