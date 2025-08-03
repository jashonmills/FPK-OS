import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Target, BookOpen, MessageCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface UATWelcomeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const testingGoals = [
  {
    icon: BookOpen,
    title: 'Enroll in a Course',
    description: 'Browse available courses and enroll in at least one',
    steps: ['Navigate to course catalog', 'Select a course', 'Complete enrollment']
  },
  {
    icon: Target,
    title: 'Complete Modules',
    description: 'Complete at least 2 course modules',
    steps: ['Start a module', 'Follow the content', 'Mark as complete']
  },
  {
    icon: CheckCircle,
    title: 'Create & Complete Goals',
    description: 'Set up and achieve at least 1 personal goal',
    steps: ['Go to Goals section', 'Create a new goal', 'Track progress to completion']
  },
  {
    icon: MessageCircle,
    title: 'Submit Feedback',
    description: 'Share your experience and suggestions',
    steps: ['Use feedback button', 'Describe your experience', 'Submit suggestions']
  }
];

export function UATWelcomeGuide({ isOpen, onClose }: UATWelcomeGuideProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Beta Testing! 🚀</DialogTitle>
          <DialogDescription className="text-base">
            Thank you for helping us test the platform. Your feedback is invaluable for improving the experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What to Test</h3>
            <p className="text-sm text-muted-foreground">
              Please complete the following tasks during your testing session. Focus on the overall user experience, 
              ease of navigation, and any confusing or broken functionality.
            </p>
          </div>

          <div className="grid gap-4">
            {testingGoals.map((goal, index) => {
              const Icon = goal.icon;
              return (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {goal.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-center gap-2">
                              <ArrowRight className="h-3 w-3" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">How to Leave Feedback</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use the "Feedback" button available throughout the platform</li>
              <li>• Report bugs, confusing steps, or UX improvements</li>
              <li>• Include screenshots when helpful</li>
              <li>• Be specific about what you were trying to do</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">Need Help?</h3>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              If you encounter any urgent issues or have questions about the testing process, 
              please submit feedback with the "Bug Report" type or contact the development team directly.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="px-8">
              Start Testing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}