import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';

interface ConceptScreenProps {
  children: React.ReactNode;
}

export const ConceptScreen: React.FC<ConceptScreenProps> = ({ children }) => {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
};

interface TeachingMomentProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal';
}

export const TeachingMoment: React.FC<TeachingMomentProps> = ({ 
  children, 
  variant = 'default' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'blue':
        return 'bg-blue-100 border-blue-400 p-3 rounded mt-3';
      case 'green':
        return 'bg-green-100 border-green-400 p-3 rounded mt-3';
      case 'purple':
        return 'bg-purple-100 border-purple-400 p-3 rounded mt-3';
      case 'red':
        return 'bg-red-100 border-red-400 p-3 rounded mt-3';
      case 'orange':
        return 'bg-orange-100 border-orange-400 p-3 rounded mt-3';
      case 'teal':
        return 'bg-teal-100 border-teal-400 p-3 rounded mt-3';
      default:
        return 'bg-amber-50 border-l-4 border-amber-400 p-4';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'blue': return 'text-blue-700';
      case 'green': return 'text-green-700';
      case 'purple': return 'text-purple-700';
      case 'red': return 'text-red-700';
      case 'orange': return 'text-orange-700';
      case 'teal': return 'text-teal-700';
      default: return 'text-amber-700';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      case 'red': return 'text-red-600';
      case 'orange': return 'text-orange-600';
      case 'teal': return 'text-teal-600';
      default: return 'text-amber-400';
    }
  };

  return (
    <div className={getVariantClasses()}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Lightbulb className={`h-4 w-4 ${getIconColor()}`} />
        </div>
        <div className="ml-3">
          <p className={`text-xs ${getTextColor()} font-medium mb-1`}>Teaching Moment:</p>
          <div className={`text-xs ${getTextColor()}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ConceptSectionProps {
  title: string;
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal';
}

export const ConceptSection: React.FC<ConceptSectionProps> = ({ 
  title, 
  children, 
  variant = 'blue' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'blue':
        return 'border-l-4 border-blue-400 bg-blue-50';
      case 'green':
        return 'border-l-4 border-green-400 bg-green-50';
      case 'purple':
        return 'border-l-4 border-purple-400 bg-purple-50';
      case 'red':
        return 'border-l-4 border-red-400 bg-red-50';
      case 'orange':
        return 'border-l-4 border-orange-400 bg-orange-50';
      case 'teal':
        return 'border-l-4 border-teal-400 bg-teal-50';
      default:
        return 'border-l-4 border-blue-400 bg-blue-50';
    }
  };

  const getTitleColor = () => {
    switch (variant) {
      case 'blue': return 'text-blue-800';
      case 'green': return 'text-green-800';
      case 'purple': return 'text-purple-800';
      case 'red': return 'text-red-800';
      case 'orange': return 'text-orange-800';
      case 'teal': return 'text-teal-800';
      default: return 'text-blue-800';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'blue': return 'text-blue-700';
      case 'green': return 'text-green-700';
      case 'purple': return 'text-purple-700';
      case 'red': return 'text-red-700';
      case 'orange': return 'text-orange-700';
      case 'teal': return 'text-teal-700';
      default: return 'text-blue-700';
    }
  };

  return (
    <div className={`${getVariantClasses()} p-4`}>
      <h4 className={`text-lg font-semibold ${getTitleColor()} mb-3`}>{title}</h4>
      <div className={`text-sm ${getTextColor()}`}>
        {children}
      </div>
    </div>
  );
};