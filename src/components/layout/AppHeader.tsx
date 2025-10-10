import { SidebarTrigger } from '@/components/ui/sidebar';
import { FamilyStudentSelector } from '@/components/FamilyStudentSelector';
import { useLocation } from 'react-router-dom';

export const AppHeader = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Progress Dashboard';
      case '/activity-log':
        return 'Activity Logs';
      case '/documents':
        return 'Documents';
      case '/analytics':
        return 'Analytics';
      case '/settings':
        return 'Settings';
      default:
        return 'Progress Hub';
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <div className="flex items-center justify-between flex-1">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        <FamilyStudentSelector />
      </div>
    </header>
  );
};
