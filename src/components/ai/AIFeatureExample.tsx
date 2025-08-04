import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useAIFeatureGate } from '@/hooks/useAIFeatureGate';
import { UsageGate } from '@/components/usage/UsageGate';

/**
 * Example component showing how to integrate usage-based pricing
 * with AI features using the UsageGate and useAIFeatureGate hook
 */
export function AIFeatureExample() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { executeWithGate, checkFeatureAccess } = useAIFeatureGate();

  // Example AI function that would consume credits
  const simulateAIChat = async (userMessage: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate AI response
    return `AI Response to: "${userMessage}". This is a simulated response that would consume 1 AI chat credit.`;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      // This will automatically check usage limits and track usage
      const result = await executeWithGate(
        'ai_chat',
        () => simulateAIChat(message),
        {
          amount: 1,
          metadata: {
            messageLength: message.length,
            feature: 'example_ai_chat'
          }
        }
      );

      if (result) {
        setResponse(result);
        setMessage('');
      }
    } catch (error) {
      console.error('Error in AI chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canSendMessage = checkFeatureAccess('ai_chat', 1);

  return (
    <div className="space-y-4">
      {/* Example with UsageGate wrapper */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>AI Chat Example</span>
          </CardTitle>
          <CardDescription>
            This demonstrates usage-based pricing for AI features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsageGate 
            featureType="ai_chat" 
            requiredAmount={1}
            fallbackMessage="You've used all your AI chat messages for this month."
          >
            <div className="space-y-4">
              <div>
                <Textarea
                  placeholder="Type your message to the AI..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Send Message (1 credit)'
                )}
              </Button>

              {response && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">AI Response:</h4>
                  <p className="text-sm">{response}</p>
                </div>
              )}
            </div>
          </UsageGate>
        </CardContent>
      </Card>

      {/* Example without wrapper - manual checking */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Usage Check Example</CardTitle>
          <CardDescription>
            Shows how to manually check feature access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              Can send AI message: {canSendMessage ? '✅ Yes' : '❌ No (limit reached)'}
            </p>
            <Button 
              variant="outline" 
              disabled={!canSendMessage}
              onClick={() => handleSendMessage()}
            >
              {canSendMessage ? 'Send Message' : 'Limit Reached'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}