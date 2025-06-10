
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Brain, 
  Target, 
  TrendingUp, 
  Send, 
  Upload, 
  CheckCircle,
  Clock,
  BookOpen,
  Zap,
  Trophy
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useStudyInsights } from '@/hooks/useStudyInsights';
import { supabase } from '@/integrations/supabase/client';

const AIStudyCoach = () => {
  const { user } = useAuth();
  const { sessions } = useStudySessions();
  const { flashcards } = useFlashcards();
  const { insights, refetch: refetchInsights } = useStudyInsights();
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      message: "Hi! I'm your AI learning assistant. How can I help you with your studies today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate live stats
  const completedSessions = sessions?.filter(s => s.completed_at) || [];
  const totalXP = completedSessions.reduce((sum, s) => sum + (s.correct_answers || 0) * 10, 0);
  const currentStreak = calculateStudyStreak();
  const progressToNextLevel = (totalXP % 1000) / 10; // Each level = 1000 XP

  function calculateStudyStreak() {
    if (!completedSessions?.length) return 0;
    
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasSessionOnDate = completedSessions.some(session => {
        const sessionDate = new Date(session.created_at);
        return sessionDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasSessionOnDate) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', message: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: userMessage,
          userId: user?.id,
          context: {
            totalSessions: completedSessions.length,
            totalCards: flashcards?.length || 0,
            recentInsights: insights.slice(0, 2)
          }
        }
      });

      if (error) throw error;

      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        message: data.response || "I'm sorry, I'm having trouble responding right now. Please try again."
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        message: "I apologize for the inconvenience. I'm experiencing technical difficulties. Please try asking your question again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickChallenges = [
    { text: "Solve 3 algebra problems in 5 minutes", icon: Target },
    { text: "Summarize today's lesson in one sentence", icon: BookOpen },
    { text: "Explain a concept in your own words", icon: Brain }
  ];

  const todaysFocus = insights
    .filter(insight => insight.type === 'recommendation')
    .slice(0, 2)
    .map(insight => insight.title);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">AI Study Coach</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get personalized learning support and guidance from your AI-powered study coach.
        </p>
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <span>• Receive tailored study recommendations and strategies</span>
          <span>• Get instant help with challenging concepts</span>
          <span>• Track your study sessions and optimize your learning</span>
        </div>
      </div>

      {/* AI Study Assistant Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="h-8 w-8" />
            <h2 className="text-2xl font-bold">AI Study Assistant</h2>
          </div>
          <p className="text-purple-100">
            Get personalized learning support and guidance powered by AI.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Learning Assistant
                <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
                  Here to help with your studies
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-purple-600 text-white ml-4' 
                        : 'bg-muted text-foreground mr-4'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground p-3 rounded-lg mr-4">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              <div className="px-4 py-2 text-center">
                <p className="text-sm text-red-600">
                  Connection issue detected. Please check your network and try again.
                </p>
                <p className="text-xs text-muted-foreground">
                  Error: Failed to send a request to the Edge Function
                </p>
              </div>

              {/* Chat Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask anything about your studies..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !chatMessage.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5" />
                Upload Homework or Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported: PDF, JPG, PNG, DOCX (Max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI-Generated Study Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-purple-600" />
                AI-Generated Study Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Today's Focus Areas:</h4>
                <div className="space-y-2">
                  {todaysFocus.length > 0 ? todaysFocus.map((focus, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{focus}</span>
                    </div>
                  )) : (
                    <>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Mathematics - Algebra ({Math.min(45, completedSessions.length * 5 + 15)} mins)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Science - Physics Concepts ({Math.min(50, completedSessions.length * 3 + 20)} mins)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Study Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Study Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickChallenges.map((challenge, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => {
                    // This would integrate with your existing study system
                    console.log('Starting challenge:', challenge.text);
                  }}
                >
                  <challenge.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{challenge.text}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Learning Streak & XP Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
                Learning Streak & XP Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalXP.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress to Next Level</span>
                  <span>{Math.round(progressToNextLevel)}%</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIStudyCoach;
