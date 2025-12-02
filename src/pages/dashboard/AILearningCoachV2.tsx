import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, LayoutDashboard, BookOpen, ClipboardList } from 'lucide-react';
import StudentPanel from '@/components/student/StudentPanel';

const AILearningCoachV2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'learning', label: 'Learning Tools', icon: BookOpen },
    { id: 'requests', label: 'My Requests', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Learning Coach</h1>
                <p className="text-sm text-muted-foreground">Your personalized AI-powered learning assistant</p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-muted/50 p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 data-[state=active]:bg-background"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <StudentPanel activeTab={activeTab} />
      </div>
    </div>
  );
};

export default AILearningCoachV2;
