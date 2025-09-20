import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, MessageCircle, Lightbulb, BookOpen, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useAuth } from '@/hooks/useAuth';
import { useOrgAIChat } from '@/hooks/useOrgAIChat';

interface StudyTip {
  id: string;
  title: string;
  description: string;
  category: 'focus' | 'time-management' | 'memory' | 'motivation';
  icon: React.ComponentType<{ className?: string }>;
}

const studyTips: StudyTip[] = [
  {
    id: '1',
    title: 'Pomodoro Technique',
    description: 'Study for 25 minutes, then take a 5-minute break to maintain focus.',
    category: 'time-management',
    icon: Clock
  },
  {
    id: '2',
    title: 'Active Recall',
    description: 'Test yourself on the material without looking at your notes.',
    category: 'memory',
    icon: Brain
  },
  {
    id: '3',
    title: 'Goal Setting',
    description: 'Break down large topics into smaller, achievable learning goals.',
    category: 'motivation',
    icon: Target
  },
  {
    id: '4',
    title: 'Spaced Repetition',
    description: 'Review material at increasing intervals to improve retention.',
    category: 'memory',
    icon: BookOpen
  }
];

const categoryColors = {
  'focus': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'time-management': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'memory': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'motivation': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
};

export default function AIStudyCoach() {
  const { currentOrg } = useOrgContext();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isSending, 
    sendMessage, 
    clearAllMessages, 
    initializeChat 
  } = useOrgAIChat({
    userId: user?.id,
    orgId: currentOrg?.organization_id,
    orgName: currentOrg?.organizations?.name
  });

  // Initialize chat when component mounts
  useEffect(() => {
    initializeChat(user?.user_metadata?.full_name);
  }, [initializeChat, user?.user_metadata?.full_name]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    
    const messageToSend = newMessage;
    setNewMessage('');
    await sendMessage(messageToSend);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Study Coach</h1>
            <p className="text-muted-foreground">Your personal learning companion and study guide</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Chat Interface */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-4 flex-shrink-0">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Chat with AI Study Coach</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 pb-4">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-end space-x-2 max-w-[80%] min-w-0">
                      {message.role === 'assistant' && (
                        <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg min-w-0 flex-1 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm break-words whitespace-pre-wrap overflow-wrap-anywhere">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isSending && (
                  <div className="flex justify-start">
                    <div className="flex items-end space-x-2">
                      <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex space-x-2 flex-shrink-0">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask me about study strategies, learning techniques, or any academic questions..."
                  className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  size="lg"
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Tips Sidebar */}
        <div className="space-y-6 flex flex-col min-h-0 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Study Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyTips.map((tip) => (
                <div key={tip.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <tip.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-sm">{tip.title}</h4>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${categoryColors[tip.category]}`}
                        >
                          {tip.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setNewMessage("How can I improve my focus while studying?")}
              >
                <Brain className="h-4 w-4 mr-2" />
                Improve Focus
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setNewMessage("What are the best memory techniques for studying?")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Memory Techniques
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setNewMessage("How do I create an effective study schedule?")}
              >
                <Clock className="h-4 w-4 mr-2" />
                Study Schedule
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setNewMessage("How can I stay motivated while learning?")}
              >
                <Target className="h-4 w-4 mr-2" />
                Stay Motivated
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}