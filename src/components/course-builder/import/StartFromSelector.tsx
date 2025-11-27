import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FileUp, Edit3, FileSpreadsheet } from 'lucide-react';

export type StartFromOption = 'manual' | 'scorm' | 'json';

interface StartFromSelectorProps {
  value: StartFromOption;
  onChange: (value: StartFromOption) => void;
}

export const StartFromSelector: React.FC<StartFromSelectorProps> = ({
  value,
  onChange
}) => {
  const options = [
    {
      id: 'manual' as const,
      title: 'Build Manually',
      description: 'Create course from scratch with our interactive builder',
      icon: Edit3,
      recommended: true
    },
    {
      id: 'scorm' as const,
      title: 'Import SCORM/ZIP',
      description: 'Upload existing SCORM package and convert to interactive format',
      icon: FileUp,
      recommended: false
    },
    {
      id: 'json' as const,
      title: 'Import JSON/CSV',
      description: 'Import course structure from data files',
      icon: FileSpreadsheet,
      recommended: false,
      disabled: true // Coming soon
    }
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">How do you want to start?</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((option) => {
          const IconComponent = option.icon;
          const isSelected = value === option.id;
          const isDisabled = option.disabled;
          
          return (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-primary/50 hover:shadow-sm'
              }`}
              onClick={() => !isDisabled && onChange(option.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-sm">{option.title}</h3>
                      {option.recommended && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          Recommended
                        </span>
                      )}
                      {option.disabled && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {option.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};