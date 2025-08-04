import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, Clock, XCircle, AlertTriangle, ChevronDown, Copy } from 'lucide-react';
import { toast } from 'sonner';
import FeedbackMetadata from './FeedbackMetadata';

interface FeedbackCardProps {
  feedback: any;
  onStatusUpdate: (feedbackId: string, status: string) => void;
}

interface ParsedFeedback {
  type?: string;
  rating?: number;
  userMessage?: string;
  structuredData?: any;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onStatusUpdate }) => {
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertTriangle className="w-5 h-5 text-blue-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getFeedbackTypeColor = (category: string) => {
    if (category.includes('general')) return 'default';
    if (category.includes('bug')) return 'destructive';
    if (category.includes('feature')) return 'secondary';
    return 'outline';
  };

  const parseFeedbackMessage = (message: string): ParsedFeedback => {
    try {
      // Try to parse as JSON first (structured feedback)
      const parsed = JSON.parse(message);
      return {
        structuredData: parsed
      };
    } catch {
      // Parse legacy format with context mixed in
      const lines = message.split('\n').filter(line => line.trim());
      
      let type: string | undefined;
      let rating: number | undefined;
      let userMessage = '';
      
      // Extract feedback type and rating from brackets
      const typeMatch = message.match(/\[([^\]]+)\]/);
      if (typeMatch) {
        type = typeMatch[1];
      }
      
      // Extract rating
      const ratingMatch = message.match(/Rating: (\d+)\/5 stars/);
      if (ratingMatch) {
        rating = parseInt(ratingMatch[1]);
      }
      
      // Extract user message (everything before context starts)
      const contextIndex = message.indexOf('Context ---');
      if (contextIndex !== -1) {
        userMessage = message.substring(0, contextIndex).trim();
        // Remove type and rating info from user message
        userMessage = userMessage.replace(/\[([^\]]+)\]/, '').replace(/Rating: \d+\/5 stars ---/, '').trim();
      } else {
        userMessage = message;
      }
      
      return {
        type,
        rating,
        userMessage
      };
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const copyFeedback = () => {
    const text = `Feedback from ${feedback.name} (${feedback.email})\nCategory: ${feedback.category}\nMessage: ${feedback.message}`;
    navigator.clipboard.writeText(text);
    toast.success('Feedback copied to clipboard');
  };

  const parsed = parseFeedbackMessage(feedback.message);

  return (
    <Card className="p-4">
      {/* Header with user info and actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(feedback.status)}
          <div>
            <div className="font-medium">{feedback.name}</div>
            <div className="text-sm text-muted-foreground">{feedback.email}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyFeedback}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Badge variant={getFeedbackTypeColor(feedback.category)}>
            {feedback.category.replace('beta_', '')}
          </Badge>
          <Select 
            value={feedback.status}
            onValueChange={(value) => onStatusUpdate(feedback.id, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Feedback Content */}
      <div className="space-y-3">
        {/* Feedback Type */}
        {parsed.type && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">Type:</span>
            <Badge variant="outline">{parsed.type}</Badge>
          </div>
        )}

        {/* Rating Display */}
        {parsed.rating && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">Rating:</span>
            <div className="flex items-center space-x-1">
              {renderStars(parsed.rating)}
              <span className="text-sm text-muted-foreground ml-2">
                {parsed.rating}/5 stars
              </span>
            </div>
          </div>
        )}

        {/* User Message */}
        <div>
          <div className="font-semibold text-sm mb-2">Feedback:</div>
          <div className="text-sm bg-muted/50 p-3 rounded-md">
            {parsed.structuredData ? (
              <div className="space-y-2">
                {Object.entries(parsed.structuredData).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                    <span className="ml-2">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              parsed.userMessage || feedback.message
            )}
          </div>
        </div>

        {/* Submission Time */}
        <div className="text-xs text-muted-foreground">
          Submitted: {new Date(feedback.created_at).toLocaleString()}
        </div>

        {/* Collapsible Metadata Section */}
        <Collapsible open={isMetadataOpen} onOpenChange={setIsMetadataOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span className="flex items-center space-x-2">
                <span>📋</span>
                <span>Feedback Context</span>
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isMetadataOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <FeedbackMetadata message={feedback.message} />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
};

export default FeedbackCard;