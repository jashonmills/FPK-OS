import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { ShieldCheck, ShieldX, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

type ConsentStatus = 'loading' | 'valid' | 'expired' | 'already_responded' | 'not_found' | 'error';

interface ConsentRequest {
  id: string;
  user_id: string;
  parent_email: string;
  status: string;
  expires_at: string;
  child_name?: string;
}

const ParentalConsent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<ConsentStatus>('loading');
  const [consentRequest, setConsentRequest] = useState<ConsentRequest | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseStatus, setResponseStatus] = useState<'approved' | 'denied' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('not_found');
      return;
    }
    
    fetchConsentRequest();
  }, [token]);

  const fetchConsentRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('parental_consent_requests')
        .select('*')
        .eq('consent_token', token)
        .single();

      if (error || !data) {
        setStatus('not_found');
        return;
      }

      // Check if already responded
      if (data.status !== 'pending') {
        setStatus('already_responded');
        setConsentRequest(data as ConsentRequest);
        return;
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        setStatus('expired');
        setConsentRequest(data as ConsentRequest);
        return;
      }

      // Fetch child's name from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, full_name')
        .eq('id', data.user_id)
        .single();

      setConsentRequest({
        ...(data as ConsentRequest),
        child_name: profile?.display_name || profile?.full_name || 'Your child'
      });
      setStatus('valid');
    } catch (err) {
      console.error('Error fetching consent request:', err);
      setStatus('error');
    }
  };

  const handleResponse = async (approve: boolean) => {
    if (!token || !consentRequest) return;
    
    if (approve && !acknowledged) {
      setError('Please acknowledge the terms before approving');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Update consent request
      const { error: updateError } = await supabase
        .from('parental_consent_requests')
        .update({
          status: approve ? 'approved' : 'denied',
          responded_at: new Date().toISOString()
        })
        .eq('consent_token', token);

      if (updateError) throw updateError;

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          parental_consent_status: approve ? 'approved' : 'denied',
          parental_consent_date: approve ? new Date().toISOString() : null
        })
        .eq('id', consentRequest.user_id);

      if (profileError) throw profileError;

      setResponseStatus(approve ? 'approved' : 'denied');
    } catch (err) {
      console.error('Error updating consent:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading consent request...</p>
        </div>
      );
    }

    if (status === 'not_found') {
      return (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold">Request Not Found</h2>
          <p className="text-muted-foreground">
            This consent request link is invalid or has been removed.
          </p>
        </div>
      );
    }

    if (status === 'expired') {
      return (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-amber-100">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold">Request Expired</h2>
          <p className="text-muted-foreground">
            This consent request has expired. Please ask your child to request a new one.
          </p>
        </div>
      );
    }

    if (status === 'already_responded') {
      return (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`p-3 rounded-full ${consentRequest?.status === 'approved' ? 'bg-green-100' : 'bg-red-100'}`}>
              {consentRequest?.status === 'approved' ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
          </div>
          <h2 className="text-xl font-semibold">
            {consentRequest?.status === 'approved' ? 'Consent Approved' : 'Consent Denied'}
          </h2>
          <p className="text-muted-foreground">
            You have already responded to this consent request.
          </p>
        </div>
      );
    }

    if (responseStatus) {
      return (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`p-3 rounded-full ${responseStatus === 'approved' ? 'bg-green-100' : 'bg-red-100'}`}>
              {responseStatus === 'approved' ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
          </div>
          <h2 className="text-xl font-semibold">
            {responseStatus === 'approved' ? 'Thank You!' : 'Consent Denied'}
          </h2>
          <p className="text-muted-foreground">
            {responseStatus === 'approved' 
              ? `${consentRequest?.child_name}'s account has been approved. They can now use all features of FPK University.`
              : `${consentRequest?.child_name}'s account has been restricted. They will have limited access until consent is provided.`
            }
          </p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go to Homepage
          </Button>
        </div>
      );
    }

    // Valid request - show approval form
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold">Parental Consent Request</h2>
          <p className="text-sm text-muted-foreground">
            <strong>{consentRequest?.child_name}</strong> has requested to create an account on FPK University.
          </p>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>About FPK University:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Educational platform for learning</li>
              <li>AI-powered study assistance</li>
              <li>Progress tracking and gamification</li>
              <li>No advertising or in-app purchases</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="font-medium">Data Collection & Privacy</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>By approving, you consent to the collection and processing of:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Name and email address</li>
              <li>Learning progress and course completion data</li>
              <li>Chat interactions with AI tutors (for educational purposes only)</li>
              <li>Usage analytics to improve the learning experience</li>
            </ul>
            <p className="mt-4">
              We do not share personal information with third parties for marketing purposes. 
              All data is stored securely and can be deleted upon request.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="acknowledge-consent"
            checked={acknowledged}
            onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
          />
          <Label htmlFor="acknowledge-consent" className="text-sm leading-relaxed cursor-pointer">
            I am the parent or legal guardian of {consentRequest?.child_name}, and I consent to their use of FPK University and the collection of their data as described above.
          </Label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleResponse(false)}
            disabled={isSubmitting}
            className="flex-1 gap-2"
          >
            <ShieldX className="h-4 w-4" />
            Deny Consent
          </Button>
          <Button 
            onClick={() => handleResponse(true)}
            disabled={isSubmitting || !acknowledged}
            className="flex-1 gap-2 fpk-gradient text-white"
          >
            <ShieldCheck className="h-4 w-4" />
            Approve Account
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fpk-purple to-fpk-amber p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">FPK University</h1>
          <p className="text-white/80">Parental Consent Portal</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">COPPA Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>

        <p className="text-center text-white/70 text-xs mt-4">
          This process complies with the Children's Online Privacy Protection Act (COPPA).
        </p>
      </div>
    </div>
  );
};

export default ParentalConsent;
