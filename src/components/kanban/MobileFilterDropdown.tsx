import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileFilterDropdownProps {
  showMyTasks: boolean;
  onFilterChange: (showMyTasks: boolean) => void;
}

export const MobileFilterDropdown = ({ showMyTasks, onFilterChange }: MobileFilterDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-xs">Filter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40 z-50 bg-popover">
        <DropdownMenuItem 
          onClick={() => onFilterChange(false)}
          className="cursor-pointer"
        >
          All Tasks
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onFilterChange(true)}
          className="cursor-pointer"
        >
          My Tasks
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
