import React, { useState, useEffect, useCallback } from 'react';
import { Code, Play, PanelLeftClose, PanelLeftOpen, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AIChatInterface from './AIChatInterface';

interface CodeTutorProps {
  onBack: () => void;
}

export interface CodeAction {
  action: 'replace_code' | 'insert_code' | 'highlight_lines' | 'run_code';
  code?: string;
  lines?: number[];
  explanation?: string;
}

type Language = 'javascript' | 'python' | 'java' | 'css' | 'html' | 'typescript';

interface LanguageConfig {
  name: string;
  extension: string;
  runnable: boolean;
  starterCode: string;
}

const LANGUAGES: Record<Language, LanguageConfig> = {
  javascript: {
    name: 'JavaScript',
    extension: 'js',
    runnable: true,
    starterCode: `// 🎯 Welcome to Code Tutor!
// This factorial function calculates n! using recursion.
// Try changing the number 5 to something else and click "Run Code"!

function calculateFactorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * calculateFactorial(n - 1);
}

console.log(calculateFactorial(5));`
  },
  python: {
    name: 'Python',
    extension: 'py',
    runnable: false,
    starterCode: `# 🎯 Welcome to Code Tutor!
# This factorial function calculates n! using recursion.
# Ask the AI to explain how it works!

def calculate_factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * calculate_factorial(n - 1)

print(calculate_factorial(5))`
  },
  java: {
    name: 'Java',
    extension: 'java',
    runnable: false,
    starterCode: `// 🎯 Welcome to Code Tutor!
// This factorial function calculates n! using recursion.
// Ask the AI to explain how it works!

public class Main {
    public static int calculateFactorial(int n) {
        if (n == 0 || n == 1) {
            return 1;
        }
        return n * calculateFactorial(n - 1);
    }
    
    public static void main(String[] args) {
        System.out.println(calculateFactorial(5));
    }
}`
  },
  typescript: {
    name: 'TypeScript',
    extension: 'ts',
    runnable: true,
    starterCode: `// 🎯 Welcome to Code Tutor!
// This factorial function calculates n! using recursion.
// TypeScript adds type safety to JavaScript!

function calculateFactorial(n: number): number {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * calculateFactorial(n - 1);
}

console.log(calculateFactorial(5));`
  },
  html: {
    name: 'HTML',
    extension: 'html',
    runnable: false,
    starterCode: `<!-- 🎯 Welcome to Code Tutor! -->
<!-- Learn HTML structure and elements -->
<!-- Ask the AI to explain any tag! -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page.</p>
    <button>Click me!</button>
</body>
</html>`
  },
  css: {
    name: 'CSS',
    extension: 'css',
    runnable: false,
    starterCode: `/* 🎯 Welcome to Code Tutor! */
/* Learn CSS styling and layouts */
/* Ask the AI to explain any property! */

body {
  font-family: 'Arial', sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 20px;
}

h1 {
  color: #333;
  text-align: center;
}

.button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button:hover {
  background-color: #45a049;
}`
  }
};

const CodeTutor: React.FC<CodeTutorProps> = ({ onBack }) => {
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(LANGUAGES.javascript.starterCode);
  const [output, setOutput] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [hasAutoRun, setHasAutoRun] = useState(false);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  const currentLang = LANGUAGES[language];

  const runCode = useCallback((isAutoRun = false) => {
    if (!currentLang.runnable) {
      setOutput(`⚠️ ${currentLang.name} cannot run in the browser.\n\nAsk the AI to explain the code or help you understand it!`);
      return `${currentLang.name} code (preview only)`;
    }

    try {
      const logs: string[] = [];
      const originalLog = console.log;
      const logFn = (...args: unknown[]) => logs.push(args.join(' '));
      console.log = logFn;
      
      // Create a safe execution context with print() alias for console.log
      // eslint-disable-next-line no-new-func
      const execFn = new Function('print', 'console', code);
      execFn(logFn, { ...console, log: logFn });
      
      console.log = originalLog;
      
      let result = logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)';
      if (isAutoRun) {
        result += '\n\n✨ Edit the code and click "Run Code" to experiment!';
      }
      setOutput(result);
      return result;
    } catch (error) {
      const errorMsg = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setOutput(errorMsg);
      return errorMsg;
    }
  }, [code, currentLang]);

  // Auto-run code on mount to show immediate output
  useEffect(() => {
    if (!hasAutoRun) {
      runCode(true);
      setHasAutoRun(true);
    }
  }, [hasAutoRun, runCode]);

  // Handle language change
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCode(LANGUAGES[newLang].starterCode);
    setHighlightedLines([]);
    setOutput('');
    
    // Auto-run if the new language is runnable
    if (LANGUAGES[newLang].runnable) {
      setTimeout(() => {
        const logs: string[] = [];
        const logFn = (...args: unknown[]) => logs.push(args.join(' '));
        try {
          const execFn = new Function('print', 'console', LANGUAGES[newLang].starterCode);
          execFn(logFn, { ...console, log: logFn });
          setOutput(logs.join('\n') + '\n\n✨ Edit the code and click "Run Code" to experiment!');
        } catch (error) {
          setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }, 100);
    } else {
      setOutput(`⚠️ ${LANGUAGES[newLang].name} cannot run in the browser.\n\nAsk the AI to explain the code or help you understand it!`);
    }
  };

  // Handle code actions from AI
  const handleCodeAction = useCallback((action: CodeAction) => {
    switch (action.action) {
      case 'replace_code':
        if (action.code) {
          setCode(action.code);
          setHighlightedLines([]);
        }
        break;
      case 'insert_code':
        if (action.code) {
          setCode(prev => prev + '\n\n' + action.code);
        }
        break;
      case 'highlight_lines':
        if (action.lines) {
          setHighlightedLines(action.lines);
          setTimeout(() => setHighlightedLines([]), 10000);
        }
        break;
      case 'run_code':
        runCode(false);
        break;
    }
  }, [runCode]);

  // Render code with line numbers and highlighting
  const renderCodeWithLineNumbers = () => {
    const lines = code.split('\n');
    return lines.map((line, index) => {
      const lineNum = index + 1;
      const isHighlighted = highlightedLines.includes(lineNum);
      return (
        <div 
          key={lineNum} 
          className={`flex ${isHighlighted ? 'bg-yellow-500/20 border-l-2 border-yellow-500' : ''}`}
        >
          <span className="w-10 text-right pr-3 text-slate-500 select-none text-xs leading-6">
            {lineNum}
          </span>
          <span className="flex-1 leading-6">{line || ' '}</span>
        </div>
      );
    });
  };

  return (
    <div className="flex h-full gap-4">
      {/* Editor Section */}
      <div className={`flex-1 flex flex-col bg-slate-900 rounded-xl overflow-hidden transition-all ${showChat ? 'w-1/2' : 'w-full'}`}>
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-400 hover:text-white hover:bg-slate-700">
              Back
            </Button>
            
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white hover:bg-slate-700 gap-2">
                  <Code className="h-4 w-4 text-green-400" />
                  <span className="font-mono text-sm">main.{currentLang.extension}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`text-slate-200 hover:bg-slate-700 cursor-pointer ${language === lang ? 'bg-slate-700' : ''}`}
                  >
                    <span className="font-mono text-sm">
                      {LANGUAGES[lang].name}
                      {!LANGUAGES[lang].runnable && <span className="text-xs text-slate-400 ml-2">(preview)</span>}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Button 
              size="sm" 
              onClick={() => runCode(false)} 
              className={`text-white ${currentLang.runnable ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-600 hover:bg-slate-500'}`}
              disabled={!currentLang.runnable}
            >
              <Play className="h-4 w-4 mr-2" />
              {currentLang.runnable ? 'Run Code' : 'Preview Only'}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 relative flex">
          {/* Line numbers and code display (for highlighting) */}
          <div className="absolute inset-0 pointer-events-none font-mono text-sm text-slate-300 p-4 overflow-auto">
            {renderCodeWithLineNumbers()}
          </div>
          {/* Actual textarea for editing */}
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setHighlightedLines([]);
            }}
            className="w-full h-full bg-transparent text-transparent caret-slate-300 p-4 pl-14 font-mono text-sm resize-none focus:outline-none z-10"
            spellCheck="false"
          />
        </div>

        <div className="h-1/3 bg-slate-950 border-t border-slate-800 flex flex-col">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono uppercase tracking-wider flex justify-between">
            <span>Console Output</span>
            {!currentLang.runnable && (
              <span className="text-yellow-500">⚠️ {currentLang.name} - AI assistance only</span>
            )}
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
            codeContext={{ code, output, language: currentLang.name }}
            onCodeAction={handleCodeAction}
          />
        </div>
      )}
    </div>
  );
};

export default CodeTutor;
