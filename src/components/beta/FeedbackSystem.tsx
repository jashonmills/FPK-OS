import React, { useState } from 'react';
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

interface FeedbackData {
  type: 'bug' | 'feature' | 'general' | 'urgent';
  category: string;
  message: string;
  rating?: number;
  contact_email?: string;
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
    contact_email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'destructive' },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'default' },
    { value: 'general', label: 'General Feedback', icon: MessageSquare, color: 'secondary' },
    { value: 'urgent', label: 'Urgent Issue', icon: AlertTriangle, color: 'destructive' }
  ];

  const categories = {
    bug: ['UI/Design', 'Functionality', 'Performance', 'Audio/Video', 'Navigation', 'Other'],
    feature: ['New Feature', 'Improvement', 'Integration', 'Accessibility', 'Other'],
    general: ['User Experience', 'Content Quality', 'Praise', 'Suggestion', 'Other'],
    urgent: ['Cannot Access', 'Data Loss', 'Security Issue', 'Critical Bug', 'Other']
  };

  const handleSubmit = async () => {
    if (!formData.message.trim()) {
      toast.error('Please provide feedback message');
      return;
    }

    setIsSubmitting(true);

    try {
      // Gather context information
      const contextData = {
        page: currentPage || window.location.pathname,
        module: currentModule,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        user_id: user?.id,
        user_email: user?.email
      };

      // Submit to Supabase
      const { error } = await supabase
        .from('beta_feedback')
        .insert({
          user_id: user?.id,
          feedback_type: formData.type,
          category: formData.category,
          message: formData.message,
          rating: formData.rating,
          contact_email: formData.contact_email || user?.email,
          context_data: contextData,
          status: 'new'
        });

      if (error) throw error;

      toast.success('Feedback submitted successfully! Thank you for helping improve the platform.');
      
      // Reset form and close
      setFormData({
        type: 'general',
        category: '',
        message: '',
        rating: undefined,
        contact_email: ''
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

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="fixed bottom-4 right-4 z-50 shadow-lg">
      <MessageSquare className="w-4 h-4 mr-2" />
      Beta Feedback
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Beta Feedback</DialogTitle>
          <DialogDescription>
            Help us improve FPK University by sharing your experience, reporting bugs, or suggesting features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
            <Select value={formData.type} onValueChange={(value: any) => 
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

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackSystem;