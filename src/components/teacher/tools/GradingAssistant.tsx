import React, { useState } from 'react';
import { PenTool, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GradingAssistantProps {
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const GradingAssistant: React.FC<GradingAssistantProps> = ({ onBack }) => {
  const [studentWork, setStudentWork] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSubmission = async () => {
    if (!studentWork.trim()) {
      toast.error('Please paste student work first');
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('teacher-ai-tools', {
        body: {
          toolType: 'grade-feedback',
          studentWork: studentWork,
          assignmentTitle: assignmentTitle || 'Assignment'
        }
      });

      if (error) throw error;

      if (data?.result) {
        const analysisMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.result
        };
        setMessages([analysisMessage]);
        toast.success('Analysis complete!');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze submission. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Include student work context in the conversation
      const contextPrompt = studentWork 
        ? `Context - Student Work:\n${studentWork}\n\nTeacher Question: ${input.trim()}`
        : input.trim();

      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: contextPrompt,
          systemPrompt: `You are an experienced educator helping grade student work. Provide constructive feedback, identify strengths and areas for improvement, and suggest grades when asked. Be specific and actionable in your feedback.`,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data?.response || data?.message || 'I apologize, but I was unable to generate a response.'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Student Work Panel */}
      <div className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
            <h3 className="font-semibold text-foreground">Student Submission</h3>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Assignment title..."
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-md bg-background"
            />
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={analyzeSubmission}
              disabled={isAnalyzing || !studentWork.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <PenTool className="h-4 w-4 mr-1" /> Analyze
                </>
              )}
            </Button>
          </div>
        </div>
        <textarea
          value={studentWork}
          onChange={(e) => setStudentWork(e.target.value)}
          placeholder="Paste student text or essay here..."
          className="flex-1 p-6 resize-none focus:outline-none text-foreground font-mono text-sm bg-muted/30 border-none"
        />
      </div>

      {/* AI Chat Panel */}
      <div className="w-[450px] flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <PenTool className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Grader</h3>
            <p className="text-xs opacity-80">Click Analyze or ask questions</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <PenTool className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Paste student work and click "Analyze" for feedback</p>
              <p className="text-xs mt-2">Or ask questions about grading criteria</p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg h-fit">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="p-2 bg-muted rounded-lg h-fit">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg h-fit">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-card border border-border p-3 rounded-xl">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask follow-up questions..."
              className="flex-1 p-3 border border-input rounded-lg resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingAssistant;
