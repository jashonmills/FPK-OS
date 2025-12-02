import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Code, Play, PanelLeftClose, PanelLeftOpen, ChevronDown, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
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
type RuntimeType = 'browser' | 'pyodide' | 'api' | 'preview';

interface LanguageConfig {
  name: string;
  extension: string;
  runtime: RuntimeType;
  starterCode: string;
}

const LANGUAGES: Record<Language, LanguageConfig> = {
  javascript: {
    name: 'JavaScript',
    extension: 'js',
    runtime: 'browser',
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
    runtime: 'pyodide',
    starterCode: `# 🎯 Welcome to Code Tutor!
# This factorial function calculates n! using recursion.
# Click "Run Code" to execute Python in your browser!

def calculate_factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * calculate_factorial(n - 1)

print(calculate_factorial(5))`
  },
  java: {
    name: 'Java',
    extension: 'java',
    runtime: 'api',
    starterCode: `// 🎯 Welcome to Code Tutor!
// This factorial function calculates n! using recursion.
// Click "Run Code" to compile and execute Java!

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
    runtime: 'browser',
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
    runtime: 'preview',
    starterCode: `<!-- 🎯 Welcome to Code Tutor! -->
<!-- Edit the HTML and see the live preview update! -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
        }
        .card {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
        }
        h1 { color: #333; margin-bottom: 1rem; }
        p { color: #666; }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
        }
        button:hover { background: #5a67d8; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Hello, World! 👋</h1>
        <p>This is my first HTML page.</p>
        <button onclick="alert('You clicked me!')">Click me!</button>
    </div>
</body>
</html>`
  },
  css: {
    name: 'CSS',
    extension: 'css',
    runtime: 'preview',
    starterCode: `/* 🎯 Welcome to Code Tutor! */
/* Edit the CSS and see the live preview update! */

body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.container {
  background: white;
  padding: 2rem 3rem;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
}

p {
  color: #666;
  text-align: center;
}

.button {
  display: block;
  width: 100%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(245, 87, 108, 0.4);
}`
  }
};

// CSS Preview HTML Template
const CSS_PREVIEW_TEMPLATE = (css: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>${css}</style>
</head>
<body>
  <div class="container">
    <h1>CSS Preview</h1>
    <p>Edit the CSS to see changes here!</p>
    <button class="button">Styled Button</button>
  </div>
</body>
</html>
`;

// Pyodide loader
let pyodideInstance: any = null;
let pyodideLoading = false;

const loadPyodideRuntime = async (): Promise<any> => {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) {
    // Wait for existing load
    while (pyodideLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return pyodideInstance;
  }
  
  pyodideLoading = true;
  try {
    // Dynamically load Pyodide from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
    document.head.appendChild(script);
    
    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Pyodide'));
    });
    
    // @ts-ignore - Pyodide is loaded globally
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
    });
    
    return pyodideInstance;
  } finally {
    pyodideLoading = false;
  }
};

const CodeTutor: React.FC<CodeTutorProps> = ({ onBack }) => {
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(LANGUAGES.javascript.starterCode);
  const [output, setOutput] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [hasAutoRun, setHasAutoRun] = useState(false);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const codeDisplayRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES[language];

  // Sync scroll between textarea and code display
  const handleScroll = useCallback(() => {
    if (textareaRef.current && codeDisplayRef.current) {
      codeDisplayRef.current.scrollTop = textareaRef.current.scrollTop;
      codeDisplayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);
  const isPreviewLanguage = currentLang.runtime === 'preview';

  // Run Python code using Pyodide
  const runPython = async (pythonCode: string): Promise<string> => {
    setPyodideStatus('loading');
    try {
      const pyodide = await loadPyodideRuntime();
      setPyodideStatus('ready');
      
      // Capture stdout
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);
      
      try {
        pyodide.runPython(pythonCode);
        const stdout = pyodide.runPython('sys.stdout.getvalue()');
        const stderr = pyodide.runPython('sys.stderr.getvalue()');
        
        if (stderr) {
          return `${stdout}\nError: ${stderr}`;
        }
        return stdout || 'Code executed successfully (no output)';
      } catch (pyError: any) {
        return `Error: ${pyError.message}`;
      }
    } catch (error: any) {
      setPyodideStatus('error');
      return `Failed to initialize Python runtime: ${error.message}`;
    }
  };

  // Run code via API (Java, etc.)
  const runViaAPI = async (codeToRun: string, lang: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('run-code', {
        body: { code: codeToRun, language: lang }
      });
      
      if (error) {
        return `API Error: ${error.message}`;
      }
      
      return data.output || 'Code executed successfully (no output)';
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  };

  // Run JavaScript/TypeScript in browser
  const runBrowserCode = (codeToRun: string): string => {
    try {
      const logs: string[] = [];
      const logFn = (...args: unknown[]) => logs.push(args.map(a => 
        typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
      ).join(' '));
      
      // Strip TypeScript types for execution
      let executableCode = codeToRun;
      if (language === 'typescript') {
        executableCode = codeToRun
          .replace(/:\s*\w+(\[\])?/g, '') // Remove type annotations
          .replace(/<\w+>/g, ''); // Remove generics
      }
      
      const execFn = new Function('print', 'console', executableCode);
      execFn(logFn, { ...console, log: logFn, error: logFn, warn: logFn });
      
      return logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)';
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  };

  // Update iframe preview for HTML/CSS
  const updatePreview = useCallback(() => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    
    let htmlContent = '';
    if (language === 'html') {
      htmlContent = code;
    } else if (language === 'css') {
      htmlContent = CSS_PREVIEW_TEMPLATE(code);
    }
    
    doc.open();
    doc.write(htmlContent);
    doc.close();
  }, [code, language]);

  // Update preview when code changes for preview languages
  useEffect(() => {
    if (isPreviewLanguage) {
      const timeout = setTimeout(updatePreview, 300);
      return () => clearTimeout(timeout);
    }
  }, [code, isPreviewLanguage, updatePreview]);

  const runCode = useCallback(async (isAutoRun = false) => {
    if (isPreviewLanguage) {
      updatePreview();
      return 'Preview updated';
    }

    setIsRunning(true);
    let result = '';

    try {
      switch (currentLang.runtime) {
        case 'browser':
          result = runBrowserCode(code);
          break;
        case 'pyodide':
          result = await runPython(code);
          break;
        case 'api':
          result = await runViaAPI(code, language);
          break;
        default:
          result = 'Unsupported runtime';
      }

      if (isAutoRun) {
        result += '\n\n✨ Edit the code and click "Run Code" to experiment!';
      }
    } catch (error: any) {
      result = `Error: ${error.message}`;
    } finally {
      setIsRunning(false);
      setOutput(result);
    }

    return result;
  }, [code, currentLang, language, isPreviewLanguage, updatePreview]);

  // Auto-run code on mount
  useEffect(() => {
    if (!hasAutoRun) {
      if (isPreviewLanguage) {
        updatePreview();
      } else {
        runCode(true);
      }
      setHasAutoRun(true);
    }
  }, [hasAutoRun, runCode, isPreviewLanguage, updatePreview]);

  // Handle language change
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCode(LANGUAGES[newLang].starterCode);
    setHighlightedLines([]);
    setOutput('');
    
    // Auto-run for new language
    setTimeout(async () => {
      const config = LANGUAGES[newLang];
      if (config.runtime === 'preview') {
        // Preview will auto-update via useEffect
        return;
      }
      
      setIsRunning(true);
      let result = '';
      
      try {
        switch (config.runtime) {
          case 'browser':
            result = runBrowserCode(config.starterCode);
            break;
          case 'pyodide':
            result = await runPython(config.starterCode);
            break;
          case 'api':
            result = await runViaAPI(config.starterCode, newLang);
            break;
        }
        result += '\n\n✨ Edit the code and click "Run Code" to experiment!';
      } catch (error: any) {
        result = `Error: ${error.message}`;
      }
      
      setIsRunning(false);
      setOutput(result);
    }, 100);
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

  const getRuntimeLabel = () => {
    switch (currentLang.runtime) {
      case 'browser': return '⚡ Browser';
      case 'pyodide': return pyodideStatus === 'ready' ? '🐍 Python Ready' : '🐍 Python';
      case 'api': return '☁️ Cloud';
      case 'preview': return '👁️ Live Preview';
    }
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
                    <span className="font-mono text-sm flex items-center gap-2">
                      {LANGUAGES[lang].name}
                      <span className="text-xs text-slate-400">
                        ({LANGUAGES[lang].runtime === 'preview' ? 'preview' : 'runnable'})
                      </span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <span className="text-xs text-slate-500">{getRuntimeLabel()}</span>
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
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isRunning}
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : isPreviewLanguage ? (
                <RefreshCw className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isRunning ? 'Running...' : isPreviewLanguage ? 'Refresh' : 'Run Code'}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 relative overflow-hidden">
          {/* Line numbers and code display (for highlighting) */}
          <div 
            ref={codeDisplayRef}
            className="absolute inset-0 pointer-events-none font-mono text-sm text-slate-300 p-4 overflow-hidden"
          >
            {renderCodeWithLineNumbers()}
          </div>
          {/* Actual textarea for editing */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setHighlightedLines([]);
            }}
            onScroll={handleScroll}
            className="w-full h-full bg-transparent text-transparent caret-slate-300 p-4 pl-14 font-mono text-sm resize-none focus:outline-none z-10 overflow-auto"
            spellCheck="false"
          />
        </div>

        {/* Output Section - Console or Preview */}
        <div className="h-1/3 bg-slate-950 border-t border-slate-800 flex flex-col">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono uppercase tracking-wider flex justify-between">
            <span>{isPreviewLanguage ? 'Live Preview' : 'Console Output'}</span>
            {pyodideStatus === 'loading' && (
              <span className="text-yellow-500 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading Python runtime...
              </span>
            )}
          </div>
          
          {isPreviewLanguage ? (
            <iframe
              ref={iframeRef}
              className="flex-1 bg-white"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <pre className="flex-1 p-4 font-mono text-sm text-slate-300 overflow-auto">
              {output || <span className="text-slate-600 italic">// Output will appear here...</span>}
            </pre>
          )}
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
