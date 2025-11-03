import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectSelector } from '@/components/dashboard/ProjectSelector';
import { BudgetView } from '@/components/budget/BudgetView';
import { BudgetOverview } from '@/components/budget/BudgetOverview';
import { BudgetEmptyState } from '@/components/budget/BudgetEmptyState';

export default function Budget() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProject, setSelectedProject] = useState<string>('');

  useEffect(() => {
    const project = searchParams.get('project');
    if (project) {
      setSelectedProject(project);
    }
  }, [searchParams]);

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    if (value && value !== 'all') {
      setSearchParams({ project: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <ProjectSelector value={selectedProject} onChange={handleProjectChange} />
        </div>

        {!selectedProject ? (
          <BudgetEmptyState />
        ) : selectedProject === 'all' ? (
          <BudgetOverview />
        ) : (
          <BudgetView projectId={selectedProject} />
        )}
      </div>
    </AppLayout>
  );
}
