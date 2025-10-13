import React from 'react';
import StandaloneAIStudyCoachChat from '@/components/StandaloneAIStudyCoachChat';
import { FeatureHighlightsCard } from '@/components/portal/FeatureHighlightsCard';
import { StudyTipsCard } from '@/components/portal/StudyTipsCard';
import { Brain } from 'lucide-react';

/**
 * Phase 1: Isolated AI Study Coach Portal
 * 
 * This is a standalone, self-contained version of the AI Study Coach
 * that operates independently from the main platform.
 * 
 * Key Features:
 * - No authentication required (anonymous mode)
 * - Uses existing StandaloneAIStudyCoachChat component
 * - Enhanced UI with feature highlights and study tips
 * - Completely isolated from platform data and user context
 * 
 * Access: Direct URL only (/portal/ai-study-coach)
 * No navigation links to this page exist in the platform
 */
const StandaloneAICoachPortal: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      {/* Header Section */}
      <div className="flex-shrink-0 w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Study Coach Portal
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Your intelligent learning companion powered by advanced AI. Get personalized study guidance, 
              explore topics, and enhance your learning journey.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:grid lg:grid-cols-3 lg:gap-6">
          
          {/* Chat Interface - 2 columns on desktop */}
          <div className="flex-1 flex flex-col lg:col-span-2 mb-6 lg:mb-0 min-h-0">
            <div className="flex-1 bg-card rounded-xl border border-border shadow-lg overflow-hidden flex flex-col">
              <StandaloneAIStudyCoachChat />
            </div>
          </div>

          {/* Info Sidebar - 1 column on desktop */}
          <div className="w-full lg:col-span-1 space-y-4 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <FeatureHighlightsCard />
            <StudyTipsCard />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 py-4 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            AI Study Coach Portal • Powered by Advanced AI • Your Learning Journey Starts Here
          </p>
        </div>
      </div>
    </div>
  );
};

export default StandaloneAICoachPortal;
