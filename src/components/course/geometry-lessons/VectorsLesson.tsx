import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VectorsLesson: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/courses/geometry')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Overview
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Module 8: Coming Soon</h1>
        <p className="text-lg text-muted-foreground">This module is being prepared with new content</p>
      </div>

      {/* Placeholder content */}
      <Card>
        <CardHeader>
          <CardTitle>Module 8 Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Content for this module will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};