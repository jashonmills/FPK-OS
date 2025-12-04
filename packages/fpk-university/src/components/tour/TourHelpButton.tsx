import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTour } from '@/contexts/TourContext';
import type { TourName } from '@/contexts/TourContext';

const tourLabels: Record<TourName, string> = {
  dashboard: 'Dashboard Tour',
  students: 'Students Page Tour',
  groups: 'Groups Page Tour',
  courses: 'Courses Page Tour',
  iep: 'IEP Builder Tour',
  goals_notes: 'Goals & Notes Tour',
  ai_assistant: 'AI Assistant Tour',
  settings: 'Settings Page Tour',
};

export const TourHelpButton: React.FC = () => {
  const { startTour, tourStatuses } = useTour();

  const handleStartTour = (tourName: TourName) => {
    startTour(tourName);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          aria-label="Help and Guided Tours"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Guided Tours</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(tourLabels) as TourName[]).map((tourName) => (
          <DropdownMenuItem
            key={tourName}
            onClick={() => handleStartTour(tourName)}
            className="cursor-pointer"
          >
            {tourLabels[tourName]}
            {tourStatuses && tourStatuses[`has_seen_${tourName}_tour` as keyof typeof tourStatuses] && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
