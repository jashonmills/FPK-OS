
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Zap, 
  GraduationCap, 
  Target, 
  BarChart3,
  Brain,
  Library
} from 'lucide-react';

const QuickNavigationGrid = () => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      title: 'Library',
      description: 'Browse books and resources',
      icon: Library,
      path: '/dashboard/library',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Courses',
      description: 'Continue your courses',
      icon: GraduationCap,
      path: '/dashboard/courses',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Notes',
      description: 'Manage your notes',
      icon: FileText,
      path: '/dashboard/notes',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Flashcards',
      description: 'Study with flashcards',
      icon: Zap,
      path: '/dashboard/flashcards',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Goals',
      description: 'Track your progress',
      icon: Target,
      path: '/dashboard/goals',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Analytics',
      description: 'View your stats',
      icon: BarChart3,
      path: '/dashboard/analytics',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'AI Coach',
      description: 'Get personalized help',
      icon: Brain,
      path: '/dashboard/ai-study-coach',
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      title: 'Gamification',
      description: 'View achievements',
      icon: BookOpen,
      path: '/dashboard/gamification',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ];

  return (
    <div className="mobile-nav-grid">
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Card 
            key={item.title} 
            className="mobile-hover-lift cursor-pointer border-0 shadow-sm hover:shadow-md mobile-transition" 
            onClick={() => navigate(item.path)}
          >
            <CardContent className="mobile-card-compact text-center">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${item.color} flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm mb-1 mobile-safe-text">{item.title}</h3>
              <p className="text-xs text-muted-foreground mobile-safe-text leading-tight">{item.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickNavigationGrid;
