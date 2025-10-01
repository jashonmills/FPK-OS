import React, { useState } from 'react';
import { GraduationCap, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AdminModeToggle, AdminMode } from './AdminModeToggle';
import { EnhancedAIStudyCoach } from '@/components/chat/EnhancedAIStudyCoach';

interface AdminAIAssistantProps {
  userId?: string;
  orgId?: string;
}

export function AdminAIAssistant({ userId, orgId }: AdminAIAssistantProps) {
  const [adminMode, setAdminMode] = useState<AdminMode>('educational');

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Mode Toggle and Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Admin AI Assistant</h3>
            <p className="text-sm text-muted-foreground">
              Your administrative and educational support tool
            </p>
          </div>
        </div>
        <AdminModeToggle 
          mode={adminMode} 
          onModeChange={setAdminMode}
        />
      </div>

      {/* Mode Description Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {adminMode === 'educational' ? (
            <>
              <strong>Educational Assistant:</strong> Access general educational knowledge, 
              curriculum development support, teaching strategies, and subject matter expertise.
            </>
          ) : (
            <>
              <strong>Org Assistant:</strong> Analyze organization data, manage students, 
              monitor progress, and get administrative insights. Answers are based on your 
              organization's actual data.
            </>
          )}
        </AlertDescription>
      </Alert>

      {/* AI Chat Interface */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardContent className="p-0 flex-1 flex flex-col min-h-0">
          <EnhancedAIStudyCoach
            userId={userId}
            orgId={orgId}
            chatMode="org_admin"
            adminMode={adminMode}
            showHeader={false}
            fixedHeight={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
