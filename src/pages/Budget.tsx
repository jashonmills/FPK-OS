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
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
          <h1 className="text-2xl md:text-3xl font-bold">Budget Management</h1>
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
