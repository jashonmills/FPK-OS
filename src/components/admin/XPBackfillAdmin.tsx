
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useXPBackfill } from '@/hooks/useXPBackfill';
import { Zap, Users, Play } from 'lucide-react';

const XPBackfillAdmin: React.FC = () => {
  const {
    runBackfillForAllUsers,
    isProcessing
  } = useXPBackfill();

  const handleBackfillAllUsers = async () => {
    await runBackfillForAllUsers(false);
  };

  const handleDryRunAllUsers = async () => {
    await runBackfillForAllUsers(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          XP System Initialization
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Award XP to all existing users for their historical activities
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleDryRunAllUsers}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Dry Run All Users
          </Button>
          
          <Button
            onClick={handleBackfillAllUsers}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Update All Users XP'}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Dry Run will show you what XP would be awarded without making changes</p>
          <p>• Update All Users will award XP for historical flashcards, study sessions, notes, goals, reading, and file uploads</p>
          <p>• This process is safe to run multiple times (idempotent)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default XPBackfillAdmin;
