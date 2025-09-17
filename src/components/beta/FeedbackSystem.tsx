import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Bug, Lightbulb, Star, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import StructuredQuestions, { StructuredResponse } from './StructuredQuestions';

interface FeedbackData {
  type: 'bug' | 'feature' | 'general' | 'urgent';
  category: string;
  message: string;
  rating?: number;
  contact_email?: string;
  structuredResponses?: StructuredResponse;
}

interface FeedbackSystemProps {
  currentPage?: string;
  currentModule?: string;
  trigger?: React.ReactNode;
}

const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ 
  currentPage, 
  currentModule,
  trigger
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FeedbackData>({
    type: 'general',
    category: '',
    message: '',
    rating: undefined,
    contact_email: '',
    structuredResponses: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listen for trigger events from onboarding
  useEffect(() => {
    const handleTriggerFeedback = () => {
      setIsOpen(true);
    };

    window.addEventListener('triggerFeedback', handleTriggerFeedback);
    return () => window.removeEventListener('triggerFeedback', handleTriggerFeedback);
  }, []);

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'destructive' },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'default' },
    { value: 'general', label: 'General Feedback', icon: MessageSquare, color: 'secondary' },
    { value: 'urgent', label: 'Urgent Issue', icon: AlertTriangle, color: 'destructive' }
  ];

  const categories = {
    bug: ['UI/Design', 'Functionality', 'Performance', 'Audio/Video', 'Navigation', 'Other'],
    feature: ['New Feature', 'Improvement', 'Integration', 'Accessibility', 'Other'],
    general: [
      'User Experience', 
      'Content Quality', 
      'Praise', 
      'Suggestion', 
      'Learning State & EL Spelling Course',
      'Onboarding & Dashboard Flow',
      'Analytics & Progress Tracking',
      'Voice, Flashcards, and Gamification',
      'Final Thoughts',
      'Other'
    ],
    urgent: ['Cannot Access', 'Data Loss', 'Security Issue', 'Critical Bug', 'Other']
  };

  const handleSubmit = async () => {
    if (!formData.message.trim()) {
      toast.error('Please provide feedback message');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create detailed message with context
      const contextInfo = [
        `Page: ${currentPage || window.location.pathname}`,
        currentModule ? `Module: ${currentModule}` : '',
        `User: ${user?.email || 'Unknown'}`,
        `Timestamp: ${new Date().toISOString()}`,
        `Browser: ${navigator.userAgent}`,
        `Viewport: ${window.innerWidth}x${window.innerHeight}`
      ].filter(Boolean).join('\n');

      // Include structured responses if available
      const structuredData = formData.structuredResponses && Object.keys(formData.structuredResponses).length > 0 
        ? `\n\n--- Structured Responses ---\n${JSON.stringify(formData.structuredResponses, null, 2)}`
        : '';

      const fullMessage = [
        formData.category ? `[${formData.category}]` : '',
        formData.message,
        formData.rating ? `\nRating: ${formData.rating}/5 stars` : '',
        structuredData,
        `\n\n--- Context ---\n${contextInfo}`
      ].filter(Boolean).join('\n');

      // Submit to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          user_id: user?.id,
          name: user?.email || 'Beta User',
          email: formData.contact_email || user?.email || 'unknown@example.com',
          category: `beta_${formData.type}`,
          message: fullMessage
        });

      if (error) throw error;

      toast.success('Feedback submitted successfully! Thank you for helping improve the platform.');
      
      // Reset form and close
      setFormData({
        type: 'general',
        category: '',
        message: '',
        rating: undefined,
        contact_email: '',
        structuredResponses: {}
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = feedbackTypes.find(t => t.value === formData.type);
  const availableCategories = categories[formData.type] || [];

  const handleStructuredResponseChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      structuredResponses: {
        ...prev.structuredResponses,
        [questionId]: value
      }
    }));
  };

  const defaultTrigger = (
    <Button 
      variant="outline" 
      size="sm" 
      className="fixed bottom-4 right-4 z-50 shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      data-feedback-trigger
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Beta Feedback
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl w-[95vw] h-[90vh] flex flex-col max-h-[800px]">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle>Beta Feedback</DialogTitle>
          <DialogDescription>
            Help us improve FPK University by sharing your experience, reporting bugs, or suggesting features.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {/* Context Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline">Page: {currentPage || window.location.pathname}</Badge>
                {currentModule && <Badge variant="outline">Module: {currentModule}</Badge>}
                {user && <Badge variant="outline">User: {user.email}</Badge>}
              </div>
            </CardContent>
          </Card>

          {/* Feedback Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Feedback Type</label>
            <Select value={formData.type} onValueChange={(value: "bug" | "feature" | "general" | "urgent") => 
              setFormData(prev => ({ ...prev, type: value, category: '' }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {feedbackTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      <type.icon className="w-4 h-4 mr-2" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={formData.category} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, category: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating (for general feedback) */}
          {formData.type === 'general' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Overall Experience Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={formData.rating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, rating }))}
                  >
                    <Star className={`w-4 h-4 ${formData.rating === rating ? 'fill-current' : ''}`} />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {formData.type === 'bug' ? 'Describe the issue' : 
               formData.type === 'feature' ? 'Describe your feature request' : 
               'Your feedback'}
            </label>
            <Textarea
              placeholder={
                formData.type === 'bug' 
                  ? "Please describe what happened, what you expected, and steps to reproduce..."
                  : formData.type === 'feature'
                  ? "Describe the feature you'd like to see and how it would help..."
                  : "Share your thoughts, suggestions, or experience..."
              }
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Structured Questions */}
          <StructuredQuestions
            category={formData.type}
            responses={formData.structuredResponses || {}}
            onResponseChange={handleStructuredResponseChange}
          />

          {/* Contact Email (if not logged in or want different email) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Email (optional)</label>
            <Input
              type="email"
              placeholder={user?.email || "your.email@example.com"}
              value={formData.contact_email}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="flex-shrink-0 flex justify-end space-x-2 pt-4 border-t bg-background mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !formData.message.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackSystem;