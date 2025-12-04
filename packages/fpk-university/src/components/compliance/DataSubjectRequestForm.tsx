import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Trash2, Edit, Shield, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAuditLog } from '@/hooks/useAuditLog';

export function DataSubjectRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logEvent } = useAuditLog();
  const [requestType, setRequestType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestTypes = [
    { value: 'access', label: 'Access Request (Article 15)', description: 'Request a copy of all personal data we hold about you', icon: FileText },
    { value: 'rectification', label: 'Rectification (Article 16)', description: 'Request correction of inaccurate personal data', icon: Edit },
    { value: 'erasure', label: 'Erasure (Article 17)', description: 'Request deletion of your personal data ("Right to be forgotten")', icon: Trash2 },
    { value: 'portability', label: 'Data Portability (Article 20)', description: 'Request your data in a portable format', icon: Download },
    { value: 'restriction', label: 'Restrict Processing (Article 18)', description: 'Request limitation of data processing', icon: Shield },
    { value: 'objection', label: 'Object to Processing (Article 21)', description: 'Object to processing based on legitimate interests', icon: AlertCircle },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !requestType) return;

    setIsSubmitting(true);
    try {
      // Create data subject request
      const { data, error } = await supabase.rpc('create_data_subject_request', {
        p_user_id: user.id,
        p_request_type: requestType,
        p_description: description || null,
        p_data_categories: ['all']
      });

      if (error) throw error;

      // Log the request for audit trail
      await logEvent({
        action: 'create',
        tableName: 'data_subject_requests',
        recordId: data,
        newValues: { request_type: requestType, description },
        legalBasis: 'gdpr_compliance',
        purpose: `User submitted GDPR ${requestType} request`
      });

      toast({
        title: "Request submitted successfully",
        description: `Your ${requestType} request has been submitted. We will respond within 30 days.`,
      });

      // Reset form
      setRequestType('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Request failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRequestType = requestTypes.find(type => type.value === requestType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Submit Data Subject Request
        </CardTitle>
        <CardDescription>
          Exercise your rights under GDPR Articles 15-22. We will respond within 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Request Type</label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger>
                <SelectValue placeholder="Select the type of request" />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRequestType && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {selectedRequestType.description}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Details (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any additional details about your request..."
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• We will respond to your request within 30 days</li>
                <li>• We may need to verify your identity before processing</li>
                <li>• Some requests may be subject to legal limitations</li>
                <li>• You will receive an email confirmation once submitted</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              disabled={!requestType || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}