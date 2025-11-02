import React from 'react';
import { useAppUser } from '@/hooks/useAppUser';
import { Navigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { CommandCenterChat } from '@/components/ai-coach-v2/CommandCenterChat';
import { ContextHistoryPanel } from '@/components/ai-coach-v2/ContextHistoryPanel';
import { InsightsPanel } from '@/components/ai-coach-v2/InsightsPanel';

export default function AICoach() {
  const { user, loading: authLoading } = useAppUser();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-6 pt-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">FPK University AI Command Center</h1>
              <p className="text-muted-foreground">
                Your personalized AI study companion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Three Column Layout with Semi-Transparent Background */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="container mx-auto px-4 h-full py-6">
          {/* Semi-transparent main container */}
          <div className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg h-full p-6">
            <div className="flex gap-4 h-full">
              {/* Left Sidebar - Context & History */}
              <div className="w-[280px] flex-shrink-0 hidden lg:block">
                <ContextHistoryPanel />
              </div>

              {/* Center - Main Chat Area */}
              <div className="flex-1 flex flex-col min-w-0">
                <CommandCenterChat userId={user?.id} />
              </div>

              {/* Right Sidebar - Insights & Analytics */}
              <div className="w-[320px] flex-shrink-0 hidden lg:block">
                <InsightsPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
