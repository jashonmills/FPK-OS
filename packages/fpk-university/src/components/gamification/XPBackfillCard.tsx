
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useXPBackfill } from '@/hooks/useXPBackfill';
import { AlertTriangle, Play, RotateCcw, FileText, Zap, Trophy, BookOpen, Target, Upload, StickyNote, Clock } from 'lucide-react';

interface XPBackfillCardProps {
  className?: string;
}

const XPBackfillCard: React.FC<XPBackfillCardProps> = ({
  className = ''
}) => {
  const {
    runBackfill,
    rollbackBackfill,
    getBackfillReport,
    backfillResult,
    backfillReport,
    isProcessing
  } = useXPBackfill();

  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    getBackfillReport();
  }, [getBackfillReport]);

  const handleDryRun = async () => {
    await runBackfill(true);
  };

  const handleBackfill = async () => {
    await runBackfill(false);
  };

  const handleRollback = async () => {
    await rollbackBackfill();
    await getBackfillReport();
  };

  const handleShowReport = async () => {
    await getBackfillReport();
    setShowReport(true);
  };

  const isDryRun = backfillResult && 'dry_run' in backfillResult;
  const isActualBackfill = backfillResult && !('dry_run' in backfillResult);

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          XP Backfill System
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Retroactively award XP for your historical activities and achievements
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Current Status */}
        {backfillReport && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Current XP</div>
                <div className="text-lg font-bold text-blue-600">{backfillReport.current_xp.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium">Current Level</div>
                <div className="text-lg font-bold text-purple-600">{backfillReport.current_level}</div>
              </div>
              <div>
                <div className="font-medium">Backfill XP</div>
                <div className="text-sm text-green-600">{backfillReport.backfill_xp.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium">Regular XP</div>
                <div className="text-sm text-blue-600">{backfillReport.regular_xp.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDryRun}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Dry Run
          </Button>
          
          <Button
            onClick={handleBackfill}
            disabled={isProcessing}
            size="sm"
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Run Backfill
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowReport}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            View Report
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRollback}
            disabled={isProcessing || !backfillReport?.backfill_events}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Rollback
          </Button>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <div className="font-medium">Important Notes:</div>
            <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
              <li>Run "Dry Run" first to preview changes</li>
              <li>Backfill is idempotent - safe to run multiple times</li>
              <li>Use "Rollback" to undo backfill changes if needed</li>
            </ul>
          </div>
        </div>

        {/* Dry Run Results */}
        {isDryRun && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-medium text-blue-900 mb-2">Dry Run Results</div>
            <div className="grid grid-cols-2 gap-3 text-sm text-blue-800">
              <div>
                <div>Current XP: {backfillResult.before_xp}</div>
                <div>Projected XP: {backfillResult.projected_after_xp}</div>
              </div>
              <div>
                <div>Current Level: {backfillResult.before_level}</div>
                <div>Projected Level: {backfillResult.projected_after_level}</div>
              </div>
            </div>
            <div className="mt-2 text-sm text-blue-800">
              Would create {backfillResult.events_to_create} XP events (+{backfillResult.backfill_xp} XP)
            </div>
          </div>
        )}

        {/* Backfill Results */}
        {isActualBackfill && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-medium text-green-900 mb-2">Backfill Complete!</div>
            <div className="grid grid-cols-2 gap-3 text-sm text-green-800">
              <div>
                <div>XP: {backfillResult.before_xp} → {backfillResult.after_xp}</div>
                <div>Level: {backfillResult.before_level} → {backfillResult.after_level}</div>
              </div>
              <div>
                <div>Events Created: {backfillResult.events_created}</div>
                <div>Badges Awarded: {backfillResult.badges_awarded.length}</div>
              </div>
            </div>
            {backfillResult.badges_awarded.length > 0 && (
              <div className="mt-2">
                <div className="text-sm font-medium text-green-900">New Badges:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {backfillResult.badges_awarded.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Trophy className="h-3 w-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed Report */}
        {showReport && backfillReport && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="font-medium">Activity Breakdown</div>
              
              {isActualBackfill && backfillResult.activities_processed && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-blue-500" />
                    <span>Flashcards: {backfillResult.activities_processed.flashcards}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span>Study Sessions: {backfillResult.activities_processed.study_sessions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span>Notes: {backfillResult.activities_processed.notes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-500" />
                    <span>Goals: {backfillResult.activities_processed.goals}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    <span>Reading: {backfillResult.activities_processed.reading_sessions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-red-500" />
                    <span>Uploads: {backfillResult.activities_processed.file_uploads}</span>
                  </div>
                </div>
              )}

              {isDryRun && backfillResult.activities_found && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-blue-500" />
                    <span>Flashcards: {backfillResult.activities_found.flashcards}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span>Study Sessions: {backfillResult.activities_found.study_sessions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span>Notes: {backfillResult.activities_found.notes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-500" />
                    <span>Goals: {backfillResult.activities_found.goals}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    <span>Reading: {backfillResult.activities_found.reading_sessions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-red-500" />
                    <span>Uploads: {backfillResult.activities_found.file_uploads}</span>
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                Total Events: {backfillReport.total_events} 
                ({backfillReport.backfill_events} backfill, {backfillReport.regular_events} regular)
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReport(false)}
                className="w-full"
              >
                Hide Report
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default XPBackfillCard;
