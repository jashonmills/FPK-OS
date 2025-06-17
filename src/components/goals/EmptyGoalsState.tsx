
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

interface EmptyGoalsStateProps {
  title: string;
  description: string;
  textClasses: string;
  cardClasses: string;
}

const EmptyGoalsState: React.FC<EmptyGoalsStateProps> = ({ 
  title, 
  description, 
  textClasses, 
  cardClasses 
}) => (
  <Card className={`fpk-card text-center py-12 ${cardClasses}`}>
    <CardContent>
      <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className={`text-lg font-semibold mb-2 ${textClasses}`}>{title}</h3>
      <p className={`text-gray-600 mb-4 ${textClasses}`}>{description}</p>
      <Button className={textClasses}>Create New Goal</Button>
    </CardContent>
  </Card>
);

export default EmptyGoalsState;
