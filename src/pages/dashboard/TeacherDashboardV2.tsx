import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Wrench, Users, Activity, MessageSquare } from 'lucide-react';
import TeacherPanel, { type TeacherTabId } from '@/components/teacher/TeacherPanel';

const TeacherDashboardV2: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TeacherTabId>('overview');
  const isLoading = false;

  const tabs = [
    { id: 'overview' as TeacherTabId, label: 'Overview', icon: LayoutDashboard },
    { id: 'tools' as TeacherTabId, label: 'AI Tools', icon: Wrench },
    { id: 'students' as TeacherTabId, label: 'Students', icon: Users },
    { id: 'activity' as TeacherTabId, label: 'Activity', icon: Activity },
    { id: 'requests' as TeacherTabId, label: 'Requests', icon: MessageSquare },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl font-bold text-foreground">
                Teacher Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                AI-powered tools for modern educators
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-6 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors rounded-t-lg ${
                    isActive
                      ? 'text-primary bg-background border border-border border-b-background -mb-px'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={false}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TeacherPanel activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default TeacherDashboardV2;
