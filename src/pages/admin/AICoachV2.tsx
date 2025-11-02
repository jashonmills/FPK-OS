import React, { useEffect } from 'react';
import { useAppUser } from '@/hooks/useAppUser';
import { Navigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useCoachSelection } from '@/hooks/useCoachSelection';
import { CoachSelectionModal } from '@/components/ai-coach-v2/CoachSelectionModal';
import { ContextHistoryPanel } from '@/components/ai-coach-v2/ContextHistoryPanel';
import { CommandCenterChat } from '@/components/ai-coach-v2/CommandCenterChat';
import { InsightsPanel } from '@/components/ai-coach-v2/InsightsPanel';

export default function AICoachV2() {
  const { isAdmin, loading, user } = useAppUser();
  const {
    selectedCoach,
    showSelection,
    selectCoach,
    switchCoach,
    setShowSelection
  } = useCoachSelection();

  // Show coach selection if no coach is selected
  useEffect(() => {
    if (!selectedCoach && !showSelection) {
      setShowSelection(true);
    }
  }, [selectedCoach, showSelection, setShowSelection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin || !user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background pt-4">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 pt-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Command Center (V2)</h1>
              <p className="text-sm text-muted-foreground">
                Advanced AI coaching with Betty & Al - Admin Preview
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Three-Column Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Column: Context & History */}
          <div className="lg:col-span-3 space-y-4">
            <ContextHistoryPanel />
          </div>

          {/* Center Column: AI Interaction */}
          <div className="lg:col-span-6">
            {selectedCoach ? (
              <CommandCenterChat
                userId={user.id}
                selectedCoach={selectedCoach}
                onSwitchCoach={switchCoach}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a coach to get started</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Insights & Analytics */}
          <div className="lg:col-span-3 space-y-4">
            <InsightsPanel />
          </div>
        </div>
      </div>

      {/* Coach Selection Modal */}
      <CoachSelectionModal
        open={showSelection}
        onSelect={selectCoach}
      />
    </div>
  );
}
