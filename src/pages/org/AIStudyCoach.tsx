import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, MessageCircle, Lightbulb, BookOpen, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useAuth } from '@/hooks/useAuth';
import { useOrgAIChat } from '@/hooks/useOrgAIChat';
import { MobilePageLayout, MobileSectionHeader } from '@/components/layout/MobilePageLayout';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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
    <MobilePageLayout className="min-h-screen">
      <MobileSectionHeader
        title="AI Study Coach"
        subtitle="Your personal learning companion and study guide"
      />

      <div className={`
        flex flex-col gap-4
        ${isMobile 
          ? 'h-[calc(100vh-8rem)]' 
          : 'grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]'
        }
      `}>
        {/* Chat Interface - Mobile First */}
        <div className={`
          flex flex-col min-h-0
          ${isMobile 
            ? 'flex-[3] min-h-[70vh]' 
            : 'lg:col-span-2'
          }
        `}>
          <Card className="flex-1 flex flex-col min-h-0 mobile-card">
            <CardHeader className="mobile-card-compact flex-shrink-0">
              <CardTitle className="flex items-center space-x-2 mobile-heading-md">
                <MessageCircle className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
                <span className="mobile-safe-text">Chat with AI Study Coach</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 mobile-card-compact">
              {/* Messages */}
              <div className={`
                flex-1 overflow-y-auto mb-4 pr-2 min-h-0 mobile-scroll-container
                ${isMobile ? 'space-y-3' : 'space-y-4'}
              `}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end space-x-2 min-w-0 ${isMobile ? 'max-w-[90%]' : 'max-w-[80%]'}`}>
                      {message.role === 'assistant' && (
                        <div className={`bg-primary/10 rounded-full flex-shrink-0 ${isMobile ? 'p-1.5' : 'p-2'}`}>
                          <Brain className={`text-primary ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                        </div>
                      )}
                      <div
                        className={`rounded-lg min-w-0 flex-1 mobile-safe-text ${
                          isMobile ? 'p-2.5' : 'p-3'
                        } ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className={`break-words whitespace-pre-wrap overflow-wrap-anywhere mobile-text-overflow-safe ${isMobile ? 'text-sm' : 'text-sm'}`}>
                          {message.content}
                        </p>
                        <p className={`opacity-70 mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
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

              {/* Input - Mobile Optimized */}
              <div className={`flex gap-2 flex-shrink-0 ${isMobile ? 'mobile-form-row' : 'space-x-2'}`}>
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isMobile 
                    ? "Ask me about study strategies..." 
                    : "Ask me about study strategies, learning techniques, or any academic questions..."
                  }
                  className={`
                    flex-1 resize-none mobile-input mobile-safe-text
                    ${isMobile 
                      ? 'min-h-[50px] max-h-[100px] text-base' 
                      : 'min-h-[60px] max-h-[120px]'
                    }
                  `}
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
                  size={isMobile ? "default" : "lg"}
                  className={`
                    mobile-touch-target
                    ${isMobile ? 'min-w-[52px]' : 'px-4'}
                  `}
                >
                  <Send className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Tips - Mobile Responsive */}
        <div className={`
          flex flex-col min-h-0
          ${isMobile 
            ? 'flex-1 max-h-[30vh] overflow-y-auto' 
            : 'space-y-6 overflow-y-auto'
          }
        `}>
          <Card className={isMobile ? 'mobile-card' : ''}>
            <CardHeader className={isMobile ? 'mobile-card-compact' : ''}>
              <CardTitle className={`flex items-center space-x-2 ${isMobile ? 'mobile-heading-md' : ''}`}>
                <Lightbulb className={`${isMobile ? 'h-5 w-5' : 'h-5 w-5'}`} />
                <span className="mobile-safe-text">Study Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className={`${isMobile ? 'mobile-card-compact space-y-3' : 'space-y-4'}`}>
              {studyTips.map((tip) => (
                <div key={tip.id} className={`border rounded-lg mobile-safe-text ${isMobile ? 'p-3' : 'p-4'}`}>
                  <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
                    <div className={`bg-primary/10 rounded-lg ${isMobile ? 'p-1.5' : 'p-2'}`}>
                      <tip.icon className={`text-primary ${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center space-x-2 ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
                        <h4 className={`font-semibold mobile-safe-text ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {tip.title}
                        </h4>
                        {!isMobile && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${categoryColors[tip.category]}`}
                          >
                            {tip.category.replace('-', ' ')}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-muted-foreground mobile-safe-text ${isMobile ? 'text-xs leading-tight' : 'text-xs'}`}>
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {!isMobile && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start mobile-safe-text"
                  onClick={() => setNewMessage("How can I improve my focus while studying?")}
                >
                  <Brain className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Improve Focus</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start mobile-safe-text"
                  onClick={() => setNewMessage("What are the best memory techniques for studying?")}
                >
                  <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Memory Techniques</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start mobile-safe-text"
                  onClick={() => setNewMessage("How do I create an effective study schedule?")}
                >
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Study Schedule</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start mobile-safe-text"
                  onClick={() => setNewMessage("How can I stay motivated while learning?")}
                >
                  <Target className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Stay Motivated</span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobilePageLayout>
  );
}