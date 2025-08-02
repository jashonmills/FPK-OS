import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, UserCheck, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface BetaAccessGateProps {
  children: React.ReactNode;
  allowedEmails?: string[];
}

// Beta access configuration
const BETA_CONFIG = {
  // Hardcoded beta emails for immediate deployment
  allowedEmails: [
    'jashon@fpkuniversity.com',
    'beta@fpkuniversity.com',
    'demo@fpkuniversity.com',
    'admin@fpkuniversity.com'
  ],
  // Alternative: invite code system
  validInviteCodes: ['BETA2024', 'EARLYACCESS', 'FPKBETA'],
  // Feature flag for beta mode
  isBetaModeEnabled: true
};

const BetaAccessGate: React.FC<BetaAccessGateProps> = ({ 
  children, 
  allowedEmails = BETA_CONFIG.allowedEmails 
}) => {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);

  useEffect(() => {
    checkBetaAccess();
  }, [user]);

  const checkBetaAccess = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Check if beta mode is disabled (bypass gate)
    if (!BETA_CONFIG.isBetaModeEnabled) {
      setHasAccess(true);
      setLoading(false);
      return;
    }

    try {
      // Method 1: Check email allowlist
      if (allowedEmails.includes(user.email)) {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      // Method 2: Check database for beta access flag
      const { data, error } = await supabase
        .from('profiles')
        .select('beta_access')
        .eq('id', user.id)
        .single();

      if (!error && data?.beta_access) {
        setHasAccess(true);
      }
    } catch (error) {
      console.error('Beta access check failed:', error);
    }

    setLoading(false);
  };

  const handleInviteCode = async () => {
    if (!user || !inviteCode.trim()) return;

    if (BETA_CONFIG.validInviteCodes.includes(inviteCode.trim().toUpperCase())) {
      try {
        // Store beta access in database
        await supabase
          .from('profiles')
          .upsert({ 
            id: user.id, 
            beta_access: true,
            beta_invite_code: inviteCode.trim().toUpperCase()
          });
        
        setHasAccess(true);
      } catch (error) {
        console.error('Failed to grant beta access:', error);
      }
    } else {
      // Invalid code feedback
      setInviteCode('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access the beta platform
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl">Beta Access Required</CardTitle>
            <CardDescription className="text-lg">
              FPK University Learning Platform is currently in closed beta
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="text-sm">
                <Mail className="w-4 h-4 mr-2" />
                {user.email}
              </Badge>
            </div>

            {!showInviteForm ? (
              <div className="space-y-4">
                <div className="text-center text-muted-foreground">
                  <p>This account doesn't have beta access yet.</p>
                  <p className="text-sm mt-2">
                    If you have an invite code, click below to enter it.
                  </p>
                </div>
                
                <Button 
                  onClick={() => setShowInviteForm(true)}
                  className="w-full"
                  variant="outline"
                >
                  I have an invite code
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Don't have access?</p>
                  <p>Contact <strong>jashon@fpkuniversity.com</strong> for beta invitation.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter Invite Code</label>
                  <Input
                    type="text"
                    placeholder="BETA2024"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="text-center text-lg tracking-wider"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleInviteCode}
                    className="flex-1"
                    disabled={!inviteCode.trim()}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Verify Access
                  </Button>
                  <Button 
                    onClick={() => setShowInviteForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access - render the app
  return <>{children}</>;
};

export default BetaAccessGate;