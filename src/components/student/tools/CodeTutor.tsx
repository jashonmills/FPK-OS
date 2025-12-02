import React, { useState, useEffect, useCallback } from 'react';
import { Code, Play, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIChatInterface from './AIChatInterface';

interface CodeTutorProps {
  onBack: () => void;
}

const CodeTutor: React.FC<CodeTutorProps> = ({ onBack }) => {
  const [code, setCode] = useState(`// 🎯 Welcome to Code Tutor!
// This factorial function calculates n! using recursion.
// Try changing the number 5 to something else and click "Run Code"!

function calculateFactorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * calculateFactorial(n - 1);
}

console.log(calculateFactorial(5));`);
  
  const [output, setOutput] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [hasAutoRun, setHasAutoRun] = useState(false);

  const runCode = useCallback((isAutoRun = false) => {
    try {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: unknown[]) => logs.push(args.join(' '));
      
      // eslint-disable-next-line no-new-func
      new Function(code)();
      
      console.log = originalLog;
      
      let result = logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)';
      if (isAutoRun) {
        result += '\n\n✨ Edit the code and click "Run Code" to experiment!';
      }
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [code]);

  // Auto-run code on mount to show immediate output
  useEffect(() => {
    if (!hasAutoRun) {
      runCode(true);
      setHasAutoRun(true);
    }
  }, [hasAutoRun, runCode]);

  return (
    <div className="flex h-full gap-4">
      {/* Editor Section */}
      <div className={`flex-1 flex flex-col bg-slate-900 rounded-xl overflow-hidden transition-all ${showChat ? 'w-1/2' : 'w-full'}`}>
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-400 hover:text-white hover:bg-slate-700">
              Back
            </Button>
            <div className="flex items-center gap-2 text-slate-200">
              <Code className="h-4 w-4 text-green-400" />
              <span className="font-mono text-sm">main.js</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowChat(!showChat)} 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-white"
            >
              {showChat ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
            <Button size="sm" onClick={() => runCode(false)} className="bg-green-600 hover:bg-green-700 text-white">
              <Play className="h-4 w-4 mr-2" />
              Run Code
            </Button>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-slate-900 text-slate-300 p-4 font-mono text-sm resize-none focus:outline-none"
            spellCheck="false"
          />
        </div>

        <div className="h-1/3 bg-slate-950 border-t border-slate-800 flex flex-col">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono uppercase tracking-wider">
            Console Output
          </div>
          <pre className="flex-1 p-4 font-mono text-sm text-slate-300 overflow-auto">
            {output || <span className="text-slate-600 italic">// Output will appear here...</span>}
          </pre>
        </div>
      </div>

      {/* Chat Section */}
      {showChat && (
        <div className="w-[400px] flex-shrink-0">
          <AIChatInterface
            toolId="code-companion"
            toolName="Code Tutor"
            onBack={() => setShowChat(false)}
            icon={Code}
            accentColor="from-green-500 to-emerald-600"
          />
        </div>
      )}
    </div>
  );
};

export default CodeTutor;
