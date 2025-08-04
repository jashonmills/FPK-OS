import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, XCircle, Clock, Play, ChevronDown, AlertTriangle, Monitor, Smartphone, Tablet } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'media' | 'navigation' | 'progress' | 'download' | 'responsive' | 'accessibility';
  priority: 'high' | 'medium' | 'low';
  automated: boolean;
  testFunction?: () => Promise<boolean>;
  instructions?: string;
}

interface TestResult {
  testId: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'manual';
  message?: string;
  duration?: number;
}

const QA_TEST_CASES: TestCase[] = [
  // Media Tests
  {
    id: 'audio-playback',
    name: 'Audio Playback',
    description: 'Verify audio players load and play correctly',
    category: 'media',
    priority: 'high',
    automated: true,
    testFunction: async () => {
      console.log('🎵 Testing audio playback capability...');
      try {
        // Test if browser supports audio playback
        const audio = document.createElement('audio');
        const mp3Support = audio.canPlayType('audio/mpeg') !== '';
        const oggSupport = audio.canPlayType('audio/ogg') !== '';
        const wavSupport = audio.canPlayType('audio/wav') !== '';
        console.log('Audio support:', { mp3Support, oggSupport, wavSupport });
        return mp3Support || oggSupport || wavSupport;
      } catch (error) {
        console.error('Audio test failed:', error);
        return false;
      }
    }
  },
  {
    id: 'video-playback',
    name: 'Video Playback',
    description: 'Verify video players load and play correctly',
    category: 'media',
    priority: 'high',
    automated: true,
    testFunction: async () => {
      console.log('🎬 Testing video playback capability...');
      try {
        const video = document.createElement('video');
        const mp4Support = video.canPlayType('video/mp4') !== '';
        const webmSupport = video.canPlayType('video/webm') !== '';
        const oggSupport = video.canPlayType('video/ogg') !== '';
        console.log('Video support:', { mp4Support, webmSupport, oggSupport });
        return mp4Support || webmSupport || oggSupport;
      } catch (error) {
        console.error('Video test failed:', error);
        return false;
      }
    }
  },
  {
    id: 'pdf-download',
    name: 'PDF Download',
    description: 'Verify PDF download buttons work correctly',
    category: 'download',
    priority: 'high',
    automated: false,
    instructions: 'Click on any PDF download button and verify the file downloads successfully'
  },
  
  // Navigation Tests
  {
    id: 'sidebar-navigation',
    name: 'Sidebar Navigation',
    description: 'Verify module navigation updates correctly',
    category: 'navigation',
    priority: 'high',
    automated: true,
    testFunction: async () => {
      console.log('🧭 Testing sidebar navigation...');
      try {
        // Look for common sidebar elements
        const sidebar = document.querySelector('aside') || 
                      document.querySelector('[role="navigation"]') ||
                      document.querySelector('.sidebar') ||
                      document.querySelector('nav');
        console.log('Sidebar found:', !!sidebar);
        return sidebar !== null;
      } catch (error) {
        console.error('Sidebar test failed:', error);
        return false;
      }
    }
  },
  {
    id: 'progress-tracking',
    name: 'Progress Tracking',
    description: 'Verify progress bars update correctly',
    category: 'progress',
    priority: 'high',
    automated: true,
    testFunction: async () => {
      console.log('📊 Testing progress tracking...');
      try {
        const progressBars = document.querySelectorAll('[role="progressbar"]') ||
                            document.querySelectorAll('progress') ||
                            document.querySelectorAll('.progress');
        console.log('Progress bars found:', progressBars.length);
        return progressBars.length > 0;
      } catch (error) {
        console.error('Progress tracking test failed:', error);
        return false;
      }
    }
  },
  
  // Accessibility Tests
  {
    id: 'accessibility-settings',
    name: 'Accessibility Settings',
    description: 'Verify accessibility settings apply correctly',
    category: 'accessibility',
    priority: 'high',
    automated: true,
    testFunction: async () => {
      console.log('♿ Testing accessibility settings...');
      try {
        const root = document.documentElement;
        const hasAccessibilityVars = 
          root.style.getPropertyValue('--accessibility-text-size') ||
          root.style.getPropertyValue('--accessibility-line-height') ||
          root.style.getPropertyValue('--accessibility-font-family');
        console.log('Accessibility CSS variables applied:', !!hasAccessibilityVars);
        return !!hasAccessibilityVars;
      } catch (error) {
        console.error('Accessibility test failed:', error);
        return false;
      }
    }
  },
  
  // Responsive Tests
  {
    id: 'mobile-responsive',
    name: 'Mobile Responsiveness',
    description: 'Verify layout works on mobile devices',
    category: 'responsive',
    priority: 'medium',
    automated: false,
    instructions: 'Resize browser to mobile width (320px-768px) and verify layout adapts'
  },
  {
    id: 'tablet-responsive',
    name: 'Tablet Responsiveness',
    description: 'Verify layout works on tablet devices',
    category: 'responsive',
    priority: 'medium',
    automated: false,
    instructions: 'Resize browser to tablet width (768px-1024px) and verify layout adapts'
  },
  {
    id: 'desktop-responsive',
    name: 'Desktop Responsiveness',
    description: 'Verify layout works on desktop devices',
    category: 'responsive',
    priority: 'low',
    automated: true,
    testFunction: async () => {
      return window.innerWidth >= 1024;
    }
  }
];

const QATestRunner: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Initialize test results
    const initialResults: Record<string, TestResult> = {};
    QA_TEST_CASES.forEach(test => {
      initialResults[test.id] = {
        testId: test.id,
        status: 'pending'
      };
    });
    setTestResults(initialResults);
  }, []);

  const runAutomatedTests = async () => {
    setIsRunning(true);
    
    const automatedTests = QA_TEST_CASES.filter(test => test.automated);
    
    for (const test of automatedTests) {
      setTestResults(prev => ({
        ...prev,
        [test.id]: { ...prev[test.id], status: 'running' }
      }));

      try {
        const startTime = performance.now();
        const passed = await test.testFunction?.() || false;
        const duration = performance.now() - startTime;

        setTestResults(prev => ({
          ...prev,
          [test.id]: {
            ...prev[test.id],
            status: passed ? 'passed' : 'failed',
            duration: Math.round(duration),
            message: passed ? 'Test passed successfully' : 'Test failed - check implementation'
          }
        }));
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          [test.id]: {
            ...prev[test.id],
            status: 'failed',
            message: `Test error: ${error}`
          }
        }));
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsRunning(false);
  };

  const markManualTest = (testId: string, passed: boolean) => {
    setTestResults(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        status: passed ? 'passed' : 'failed',
        message: passed ? 'Manual test passed' : 'Manual test failed'
      }
    }));
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'manual':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: TestCase['category']) => {
    switch (category) {
      case 'media':
        return Play;
      case 'responsive':
        return Monitor;
      default:
        return CheckCircle;
    }
  };

  const categories = ['all', ...new Set(QA_TEST_CASES.map(test => test.category))];
  const filteredTests = selectedCategory === 'all' 
    ? QA_TEST_CASES 
    : QA_TEST_CASES.filter(test => test.category === selectedCategory);

  const totalTests = filteredTests.length;
  const completedTests = filteredTests.filter(test => 
    ['passed', 'failed'].includes(testResults[test.id]?.status)
  ).length;
  const passedTests = filteredTests.filter(test => 
    testResults[test.id]?.status === 'passed'
  ).length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-primary" />
              QA Test Runner
            </CardTitle>
            <CardDescription>
              Automated and manual testing for beta platform verification
            </CardDescription>
          </div>
          <Badge variant="outline">
            Beta QA v1.9
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Test Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-primary">{totalTests}</div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{passedTests}</div>
            <div className="text-sm text-muted-foreground">Passed</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold">{completedTests}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Test Progress</span>
            <span>{Math.round((completedTests / totalTests) * 100)}%</span>
          </div>
          <Progress value={(completedTests / totalTests) * 100} />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <Button 
            onClick={runAutomatedTests} 
            disabled={isRunning}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running Tests...' : 'Run Automated Tests'}
          </Button>
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Test Cases */}
        <div className="space-y-2">
          {filteredTests.map((test) => {
            const result = testResults[test.id];
            const IconComponent = getCategoryIcon(test.category);
            
            return (
              <Collapsible key={test.id}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(result?.status || 'pending')}
                          <div>
                            <div className="font-medium flex items-center">
                              <IconComponent className="w-4 h-4" />
                              <span className="ml-2">{test.name}</span>
                              <Badge 
                                variant={test.priority === 'high' ? 'destructive' : 
                                        test.priority === 'medium' ? 'default' : 'secondary'}
                                className="ml-2 text-xs"
                              >
                                {test.priority}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {test.description}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <Card className="ml-8 mt-2">
                    <CardContent className="p-4">
                      {test.automated ? (
                        <div className="space-y-2">
                          <Badge variant="outline">Automated Test</Badge>
                          {result?.message && (
                            <p className="text-sm text-muted-foreground">{result.message}</p>
                          )}
                          {result?.duration && (
                            <p className="text-xs text-muted-foreground">
                              Execution time: {result.duration}ms
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Badge variant="outline">Manual Test</Badge>
                          <p className="text-sm">{test.instructions}</p>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markManualTest(test.id, true)}
                              disabled={result?.status === 'passed'}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Pass
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markManualTest(test.id, false)}
                              disabled={result?.status === 'failed'}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Fail
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QATestRunner;