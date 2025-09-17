
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOptimizedAccessibility } from '@/hooks/useOptimizedAccessibility';
import { Check, X, Eye, Type, Palette, Brain } from 'lucide-react';

interface TestResults {
  fontLoaded: boolean;
  cssVariablesSet: boolean;
  contrastApplied: boolean;
  comfortModeApplied: boolean;
  noErrors: boolean;
}

const AccessibilityTester: React.FC = () => {
  const { fontFamily, textSize, lineSpacing, colorContrast, comfortMode, error } = useOptimizedAccessibility();
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  const runAccessibilityTests = () => {
    const results = {
      fontLoaded: document.fonts.check('16px ' + fontFamily),
      cssVariablesSet: !!getComputedStyle(document.documentElement).getPropertyValue('--accessibility-font-size'),
      contrastApplied: document.documentElement.classList.contains('high-contrast') === (colorContrast === 'High'),
      comfortModeApplied: document.documentElement.classList.contains(comfortMode.toLowerCase().replace(/\s+/g, '-')),
      noErrors: !error,
    };

    setTestResults(results);
  };

  const TestResult = ({ test, result, label }: { test: string; result: boolean; label: string }) => (
    <div className="flex items-center justify-between p-2 rounded border">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        {result ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <X className="h-4 w-4 text-red-600" />
        )}
        <Badge variant={result ? "default" : "destructive"} className="text-xs">
          {result ? "Pass" : "Fail"}
        </Badge>
      </div>
    </div>
  );

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Eye className="h-5 w-5" />
          Accessibility System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Font: {fontFamily}</span>
          </div>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Contrast: {colorContrast}</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>Comfort: {comfortMode}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Size: {textSize}/5</span>
            <span>Spacing: {lineSpacing}/5</span>
          </div>
        </div>

        <Button onClick={runAccessibilityTests} className="w-full" size="sm">
          Run Accessibility Tests
        </Button>

        {testResults && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Test Results:</h4>
            <TestResult
              test="fontLoaded"
              result={testResults.fontLoaded}
              label="Font properly loaded"
            />
            <TestResult
              test="cssVariablesSet"
              result={testResults.cssVariablesSet}
              label="CSS variables applied"
            />
            <TestResult
              test="contrastApplied"
              result={testResults.contrastApplied}
              label="Contrast mode active"
            />
            <TestResult
              test="comfortModeApplied"
              result={testResults.comfortModeApplied}
              label="Comfort mode applied"
            />
            <TestResult
              test="noErrors"
              result={testResults.noErrors}
              label="No system errors"
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccessibilityTester;
