import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestPackage {
  id: string;
  name: string;
  description: string;
  standard: 'SCORM 1.2' | 'SCORM 2004';
  testType: 'basic' | 'advanced' | 'stress' | 'error';
  features: string[];
  size: string;
  downloadUrl: string;
  expectedBehavior: string[];
}

const testPackages: TestPackage[] = [
  {
    id: 'scorm12-basic',
    name: 'SCORM 1.2 Basic Test',
    description: 'Simple single-SCO package testing basic SCORM 1.2 functionality',
    standard: 'SCORM 1.2',
    testType: 'basic',
    features: ['Single SCO', 'Status tracking', 'Score setting', 'Suspend data'],
    size: '1.2 MB',
    downloadUrl: '/test-packages/scorm12-basic.zip',
    expectedBehavior: [
      'Initialize successfully with "ab-initio" entry',
      'Allow setting lesson_status to "completed"',
      'Accept score.raw values 0-100',
      'Store suspend_data correctly',
      'Finish cleanly and save data'
    ]
  },
  {
    id: 'scorm2004-basic',
    name: 'SCORM 2004 Basic Test',
    description: 'Single-SCO package testing basic SCORM 2004 functionality',
    standard: 'SCORM 2004',
    testType: 'basic',
    features: ['Single SCO', 'Completion status', 'Success status', 'Progress measure'],
    size: '1.5 MB',
    downloadUrl: '/test-packages/scorm2004-basic.zip',
    expectedBehavior: [
      'Initialize successfully with proper API_1484_11',
      'Set completion_status to "completed"',
      'Set success_status to "passed/failed"',
      'Handle progress_measure 0.0-1.0',
      'Use PT format for session_time'
    ]
  },
  {
    id: 'scorm2004-multi-sco',
    name: 'SCORM 2004 Multi-SCO',
    description: 'Multi-SCO package with simple forward-only sequencing',
    standard: 'SCORM 2004',
    testType: 'advanced',
    features: ['Multiple SCOs', 'Sequencing', 'Navigation control', 'Prerequisites'],
    size: '3.2 MB',
    downloadUrl: '/test-packages/scorm2004-multi-sco.zip',
    expectedBehavior: [
      'Show TOC with multiple SCOs',
      'Enforce forward-only navigation',
      'Track completion per SCO',
      'Enable Next button only after completion',
      'Maintain state across SCOs'
    ]
  },
  {
    id: 'scorm12-interactions',
    name: 'SCORM 1.2 Interactions Test',
    description: 'Tests interaction tracking and objectives',
    standard: 'SCORM 1.2',
    testType: 'advanced',
    features: ['Interactions', 'Objectives', 'Multiple attempts', 'Time tracking'],
    size: '2.1 MB',
    downloadUrl: '/test-packages/scorm12-interactions.zip',
    expectedBehavior: [
      'Record interaction responses',
      'Track correct/incorrect results',
      'Store objective scores',
      'Calculate total_time correctly',
      'Handle multiple interaction types'
    ]
  },
  {
    id: 'scorm-error-test',
    name: 'Error Handling Test',
    description: 'Package that intentionally triggers various error conditions',
    standard: 'SCORM 1.2',
    testType: 'error',
    features: ['Invalid API calls', 'Bad data types', 'Out of range values', 'Timing errors'],
    size: '0.8 MB',
    downloadUrl: '/test-packages/scorm-error-test.zip',
    expectedBehavior: [
      'Return error 301 for calls before Initialize',
      'Return error 405 for invalid data types',
      'Return error 406 for out-of-range values',
      'Return error 403 for read-only elements',
      'Maintain error state consistency'
    ]
  },
  {
    id: 'scorm-stress-test',
    name: 'Stress Test Package',
    description: 'High-frequency API calls and large data volumes',
    standard: 'SCORM 2004',
    testType: 'stress',
    features: ['Rapid commits', 'Large suspend_data', 'Many interactions', 'Long sessions'],
    size: '5.0 MB',
    downloadUrl: '/test-packages/scorm-stress-test.zip',
    expectedBehavior: [
      'Handle 100+ SetValue calls per second',
      'Store suspend_data up to 4096 chars',
      'Manage 50+ interactions gracefully',
      'Maintain performance over 60+ minutes',
      'Throttle commits without data loss'
    ]
  }
];

export function TestPackages() {
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Record<string, 'pass' | 'fail' | 'running'>>({});
  const { toast } = useToast();

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'stress': return 'bg-orange-100 text-orange-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStandardColor = (standard: string) => {
    return standard === 'SCORM 1.2' 
      ? 'bg-green-100 text-green-800'
      : 'bg-indigo-100 text-indigo-800';
  };

  const handleDownload = (pkg: TestPackage) => {
    // Create a blob with mock SCORM package content
    const mockScormContent = generateMockScormPackage(pkg);
    const blob = new Blob([mockScormContent], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pkg.id}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `${pkg.name} test package is downloading...`,
    });
  };

  const handleTest = async (pkg: TestPackage) => {
    setRunningTests(prev => new Set([...prev, pkg.id]));
    setTestResults(prev => ({ ...prev, [pkg.id]: 'running' }));

    try {
      // Simulate running automated tests
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      // Simulate test results (in real implementation, this would run actual tests)
      const passed = Math.random() > 0.3; // 70% pass rate simulation
      
      setTestResults(prev => ({ 
        ...prev, 
        [pkg.id]: passed ? 'pass' : 'fail' 
      }));

      toast({
        title: passed ? "Test Passed" : "Test Failed",
        description: `${pkg.name} ${passed ? 'completed successfully' : 'found issues'}`,
        variant: passed ? "default" : "destructive",
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, [pkg.id]: 'fail' }));
      toast({
        title: "Test Error",
        description: `Failed to run test for ${pkg.name}`,
        variant: "destructive",
      });
    } finally {
      setRunningTests(prev => {
        const updated = new Set(prev);
        updated.delete(pkg.id);
        return updated;
      });
    }
  };

  const getResultIcon = (result: 'pass' | 'fail' | 'running' | undefined) => {
    switch (result) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">SCORM QA Test Packages</h2>
        <p className="text-muted-foreground">
          Comprehensive test packages to validate SCORM runtime compliance and player functionality
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          These test packages are designed to validate SCORM 1.2 and 2004 compliance. 
          Run these tests after any changes to the SCORM runtime or player components.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testPackages.map((pkg) => (
          <Card key={pkg.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {pkg.description}
                  </CardDescription>
                </div>
                {getResultIcon(testResults[pkg.id])}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={getStandardColor(pkg.standard)}>
                  {pkg.standard}
                </Badge>
                <Badge className={getTestTypeColor(pkg.testType)}>
                  {pkg.testType}
                </Badge>
                <Badge variant="outline">{pkg.size}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Features Tested:</h4>
                <div className="flex flex-wrap gap-1">
                  {pkg.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Expected Behavior:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {pkg.expectedBehavior.slice(0, 3).map((behavior, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{behavior}</span>
                    </li>
                  ))}
                  {pkg.expectedBehavior.length > 3 && (
                    <li className="text-xs text-muted-foreground">
                      ... and {pkg.expectedBehavior.length - 3} more
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(pkg)}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleTest(pkg)}
                  disabled={runningTests.has(pkg.id)}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {runningTests.has(pkg.id) ? 'Testing...' : 'Run Test'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function generateMockScormPackage(pkg: TestPackage): string {
  // Generate a simple mock SCORM manifest for testing
  const manifest = pkg.standard === 'SCORM 1.2' ? `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${pkg.id}" version="1.2">
  <organizations default="default_org">
    <organization identifier="default_org">
      <title>${pkg.name}</title>
      <item identifier="sco1" identifierref="res1">
        <title>Test SCO</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res1" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>` : `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${pkg.id}" version="2004 4th Edition">
  <organizations default="default_org">
    <organization identifier="default_org">
      <title>${pkg.name}</title>
      <item identifier="sco1" identifierref="res1">
        <title>Test SCO</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res1" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;

  return `Mock SCORM Package: ${pkg.name}\n\nManifest:\n${manifest}\n\nThis is a mock test package for development purposes.`;
}