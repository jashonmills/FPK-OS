import React from 'react';
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

const QuickAccessBar = () => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      title: 'Library',
      icon: Library,
      path: '/dashboard/learner/library',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Courses',
      icon: GraduationCap,
      path: '/dashboard/learner/courses',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Notes',
      icon: FileText,
      path: '/dashboard/learner/notes',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Flashcards',
      icon: Zap,
      path: '/dashboard/learner/flashcards',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Goals',
      icon: Target,
      path: '/dashboard/learner/goals',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/dashboard/learner/analytics',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'AI Coach',
      icon: Brain,
      path: '/dashboard/learner/ai-coach',
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      title: 'Gamification',
      icon: BookOpen,
      path: '/dashboard/learner/gamification',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ];

  return (
    <div className="flex gap-1 justify-center overflow-x-auto pb-2 scrollbar-hide">
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Button
            key={item.title}
            variant="ghost"
            size="sm"
            onClick={() => navigate(item.path)}
            className="flex-col h-auto min-w-[56px] p-1.5 hover:bg-white/60 transition-all duration-200"
          >
            <div className={`w-6 h-6 rounded-md ${item.color} flex items-center justify-center mb-1 shadow-sm`}>
              <IconComponent className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-medium text-white leading-tight">{item.title}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default QuickAccessBar;