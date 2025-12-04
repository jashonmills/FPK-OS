import { Button } from '@/components/ui/button';
import { MessageSquare, History, PlusCircle, BarChart2 } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'chat' | 'sessions';
  onTabChange: (tab: 'chat' | 'sessions') => void;
  onNewSession: () => void;
  onAnalyticsClick: () => void;
}

export function MobileBottomNav({ 
  activeTab, 
  onTabChange, 
  onNewSession,
  onAnalyticsClick 
}: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="flex items-center justify-around p-2">
        {/* Chat Tab */}
        <Button
          variant={activeTab === 'chat' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('chat')}
          className="flex-col h-auto py-2 px-3 gap-1"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs">Chat</span>
        </Button>

        {/* Sessions Tab */}
        <Button
          variant={activeTab === 'sessions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('sessions')}
          className="flex-col h-auto py-2 px-3 gap-1"
        >
          <History className="h-5 w-5" />
          <span className="text-xs">Sessions</span>
        </Button>

        {/* New Session - Prominent */}
        <Button
          variant="default"
          size="sm"
          onClick={onNewSession}
          className="flex-col h-auto py-2 px-4 gap-1 bg-primary"
        >
          <PlusCircle className="h-6 w-6" />
          <span className="text-xs font-semibold">New</span>
        </Button>

        {/* Analytics */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onAnalyticsClick}
          className="flex-col h-auto py-2 px-3 gap-1"
        >
          <BarChart2 className="h-5 w-5" />
          <span className="text-xs">Stats</span>
        </Button>
      </div>
    </div>
  );
}
