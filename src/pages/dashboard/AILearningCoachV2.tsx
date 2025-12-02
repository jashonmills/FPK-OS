import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, LayoutDashboard, BookOpen, ClipboardList } from 'lucide-react';
import StudentPanel from '@/components/student/StudentPanel';

const AILearningCoachV2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get('org');
  const isOrgContext = !!orgId;

  // Only show "My Requests" tab for organization users
  const tabs = useMemo(() => {
    const baseTabs = [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'learning', label: 'Learning Tools', icon: BookOpen },
    ];

    if (isOrgContext) {
      baseTabs.push({ id: 'requests', label: 'My Requests', icon: ClipboardList });
    }

    return baseTabs;
  }, [isOrgContext]);

  return (
    <div className="bg-background pt-16">
      {/* Sticky Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
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

          <div className="flex justify-center">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="inline-flex h-12 items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1.5 shadow-lg border border-white/20">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground hover:text-foreground"
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
      </div>

      {/* Content Area */}
      <div className="p-6 pb-12">
        <StudentPanel activeTab={activeTab} />
      </div>
    </div>
  );
};

export default AILearningCoachV2;
