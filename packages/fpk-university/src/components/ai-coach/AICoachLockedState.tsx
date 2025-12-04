import React from 'react';
import { Lock, BookOpen, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useParentalConsent } from '@/hooks/useParentalConsent';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function AICoachLockedState() {
  const navigate = useNavigate();
  const { currentOrg } = useOrgContext();
  const { user } = useAuth();
  const { resendConsentRequest, isSending } = useParentalConsent();

  const handleGoToCourses = () => {
    if (currentOrg?.organization_id) {
      navigate(`/org/${currentOrg.organization_id}/courses`);
    }
  };

  const handleResendEmail = async () => {
    if (!user?.id) return;
    
    const result = await resendConsentRequest(user.id);
    if (result.success) {
      toast.success('Consent request email sent to your parent/guardian');
    } else {
      toast.error('Failed to resend email. Please try again later.');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="max-w-lg w-full bg-card/80 backdrop-blur-sm border-border">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">AI Learning Coach is Locked</CardTitle>
          <CardDescription className="text-base">
            This feature requires parental consent before you can use it. 
            Your parent or guardian should have received an email with instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              While you wait, why not start a course? You have full access to all learning materials.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleGoToCourses}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Go to Courses
            </Button>
            <Button 
              variant="outline" 
              onClick={handleResendEmail}
              disabled={isSending}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              {isSending ? 'Sending...' : 'Resend Parent Email'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
