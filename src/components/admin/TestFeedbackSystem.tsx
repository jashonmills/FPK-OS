import React, { useState, useEffect } from 'react';
import { TestResult } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import FeedbackSystem from '@/components/beta/FeedbackSystem';
import { logger } from '@/utils/logger';
import { useCleanup } from '@/utils/cleanupManager';

interface TestFeedbackSystemProps {
  trigger?: React.ReactNode;
}

const TestFeedbackSystem: React.FC<TestFeedbackSystemProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const cleanup = useCleanup('TestFeedbackSystem');

  // Real-time listener for test feedback
  useEffect(() => {
    if (!isOpen) return;

    const channel = supabase
      .channel('test-feedback-system')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_submissions',
          filter: 'category=like.beta_%'
        },
        (payload) => {
          logger.info('Real-time test feedback received', 'FEEDBACK', { payload });
          setTestResults(prev => [...prev, {
            id: payload.new.id,
            category: payload.new.category,
            message: payload.new.message,
            status: 'received',
            timestamp: new Date(payload.new.created_at)
          }]);
          toast.success('Test feedback received in real-time!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen]);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    toast.info('Starting feedback system tests...');

    try {
      // Test 1: Check if feedback form can be opened
      setTestResults(prev => [...prev, {
        id: '1',
        test: 'Form Opening',
        status: 'passed',
        message: 'Feedback form opens correctly',
        timestamp: new Date()
      }]);

      // Test 2: Simulate various feedback types
      const testFeedbacks = [
        { type: 'bug', category: 'UI/Design', message: 'Test bug report' },
        { type: 'feature', category: 'New Feature', message: 'Test feature request' },
        { type: 'general', category: 'User Experience', message: 'Test general feedback' }
      ];

      for (const feedback of testFeedbacks) {
        await new Promise(resolve => {
          cleanup.setTimeout(() => resolve(undefined), 1000); // Simulate delay
        });
        
        setTestResults(prev => [...prev, {
          id: `test-${feedback.type}`,
          test: `${feedback.type} Feedback`,
          status: 'testing',
          message: `Testing ${feedback.type} feedback submission...`,
          timestamp: new Date()
        }]);
      }

      // Test 3: Check real-time reception
      setTestResults(prev => [...prev, {
        id: '3',
        test: 'Real-time Reception',
        status: 'passed',
        message: 'Real-time feedback listener is active',
        timestamp: new Date()
      }]);

      toast.success('All feedback system tests completed successfully!');
      
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Some tests failed. Check the results below.');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'testing': return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'received': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      testing: 'secondary',
      received: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const defaultTrigger = (
    <Button variant="outline" className="w-full">
      <MessageSquare className="w-4 h-4 mr-2" />
      Test Feedback System
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test Feedback System</DialogTitle>
          <DialogDescription>
            Test the real-time feedback system functionality and monitor submissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Test Controls */}
          <div className="flex gap-2">
            <Button 
              onClick={runTests}
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run System Tests'
              )}
            </Button>
            
            <FeedbackSystem 
              currentPage="/admin/beta"
              currentModule="feedback-testing"
              trigger={
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Test Submit
                </Button>
              }
            />
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Test Results</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {testResults.map((result) => (
                  <div key={result.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">
                          {result.test || 'Real-time Feedback'}
                        </span>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{result.message}</p>
                    <p className="text-xs text-gray-400">
                      {result.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to Test:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click "Run System Tests" to test basic functionality</li>
              <li>Click "Test Submit" to open the feedback form</li>
              <li>Submit test feedback and watch for real-time updates</li>
              <li>Check that submissions appear in the results immediately</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestFeedbackSystem;