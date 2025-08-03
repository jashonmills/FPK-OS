import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Bug, Lightbulb, HelpCircle, Zap, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface FeedbackItem {
  id: string;
  feedback_type: string;
  title: string;
  description: string;
  screenshot_url?: string;
  page_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  user_id: string;
  profiles?: {
    display_name: string;
    full_name: string;
  };
}

const feedbackTypeIcons = {
  bug: Bug,
  ux_suggestion: Lightbulb,
  confusing_step: HelpCircle,
  feature_request: Zap
};

const feedbackTypeLabels = {
  bug: 'Bug Report',
  ux_suggestion: 'UX Suggestion',
  confusing_step: 'Confusing Step',
  feature_request: 'Feature Request'
};

const statusColors = {
  new: 'destructive',
  in_review: 'default',
  resolved: 'default',
  ignored: 'secondary'
} as const;

export default function FeedbackDashboard() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: feedback = [], isLoading } = useQuery({
    queryKey: ['admin-feedback', statusFilter, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('user_feedback')
        .select(`
          *,
          profiles:user_id(display_name, full_name)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('feedback_type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as any;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'resolved') {
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_feedback')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      toast.success('Feedback status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating feedback status:', error);
      toast.error('Failed to update feedback status');
    }
  });

  const feedbackStats = {
    total: feedback.length,
    new: feedback.filter(f => f.status === 'new').length,
    inReview: feedback.filter(f => f.status === 'in_review').length,
    resolved: feedback.filter(f => f.status === 'resolved').length
  };

  const FeedbackCard = ({ item }: { item: FeedbackItem }) => {
    const Icon = feedbackTypeIcons[item.feedback_type as keyof typeof feedbackTypeIcons] || MessageCircle;
    
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant={statusColors[item.status as keyof typeof statusColors]}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                  <span>•</span>
                  <span>{feedbackTypeLabels[item.feedback_type as keyof typeof feedbackTypeLabels]}</span>
                  <span>•</span>
                  <span>{format(new Date(item.created_at), 'MMM d, yyyy')}</span>
                </CardDescription>
              </div>
            </div>
            <Select
              value={item.status}
              onValueChange={(value) => updateStatusMutation.mutate({ id: item.id, status: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="ignored">Ignored</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {item.profiles?.display_name && (
              <Badge variant="outline">
                User: {item.profiles.display_name}
              </Badge>
            )}
            {item.page_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(item.page_url, '_blank')}
                className="gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                View Page
              </Button>
            )}
            {item.screenshot_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(item.screenshot_url, '_blank')}
                className="gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Screenshot
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Feedback Dashboard</h1>
        <p className="text-muted-foreground">Manage user feedback and bug reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{feedbackStats.new}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{feedbackStats.inReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{feedbackStats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="ignored">Ignored</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bug">Bug Reports</SelectItem>
            <SelectItem value="ux_suggestion">UX Suggestions</SelectItem>
            <SelectItem value="confusing_step">Confusing Steps</SelectItem>
            <SelectItem value="feature_request">Feature Requests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedback.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No feedback found</h3>
              <p className="text-muted-foreground">
                No feedback matches your current filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          feedback.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}