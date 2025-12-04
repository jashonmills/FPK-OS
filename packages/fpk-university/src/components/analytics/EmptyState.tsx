
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="h-[200px] sm:h-[250px] flex items-center justify-center">
      <div className="text-center text-gray-500">
        <Icon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
        <p className="font-medium text-sm sm:text-base">{title}</p>
        <p className="text-xs sm:text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

export default EmptyState;
