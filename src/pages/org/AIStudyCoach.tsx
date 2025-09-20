import React, { useState } from 'react';
import { Brain, Send, MessageCircle, Lightbulb, BookOpen, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello ${user?.user_metadata?.full_name || 'there'}! I'm your AI Study Coach. I'm here to help you with study strategies, learning techniques, and academic support. How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(newMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('study') || input.includes('learn')) {
      return "Great question! Effective studying involves active engagement with the material. Try the Pomodoro Technique for time management, use active recall to test your knowledge, and implement spaced repetition for better retention. What specific subject or topic are you working on?";
    }
    
    if (input.includes('focus') || input.includes('concentration')) {
      return "Improving focus is crucial for effective learning! Try these strategies: eliminate distractions, use the Pomodoro Technique, take regular breaks, ensure good lighting and comfortable seating, and consider background white noise or instrumental music. What's your biggest distraction right now?";
    }
    
    if (input.includes('memory') || input.includes('remember')) {
      return "Memory enhancement is key to successful learning! Use techniques like: creating mental associations, teaching the material to someone else, using mnemonics, practicing retrieval, and getting adequate sleep. Visual learners might benefit from mind maps or diagrams. What type of information are you trying to remember?";
    }
    
    if (input.includes('motivation') || input.includes('procrastination')) {
      return "Motivation challenges are common! Try setting small, achievable goals, rewarding yourself for completed tasks, finding a study buddy for accountability, and connecting your studies to your personal interests or career goals. Remember why you started this learning journey. What motivates you most?";
    }
    
    return "That's an interesting question! I'd love to help you with your studies. Could you tell me more about what specific challenge you're facing? Whether it's time management, understanding difficult concepts, staying motivated, or developing better study habits, I'm here to support your learning journey.";
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Chat with AI Study Coach</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-end space-x-2 max-w-[80%]">
                      {message.type === 'ai' && (
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-end space-x-2">
                      <div className="p-2 bg-primary/10 rounded-full">
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
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask me about study strategies, learning techniques, or any academic questions..."
                  className="flex-1 min-h-[60px] max-h-[120px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
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
        <div className="space-y-6">
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