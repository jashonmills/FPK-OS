import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteCodeValid, setInviteCodeValid] = useState<boolean | null>(null);
  const [validatingCode, setValidatingCode] = useState(false);
  const isInviteSystemEnabled = useFeatureFlag('user_invite_system_enabled');

  // Check URL for invite code on mount
  useEffect(() => {
    const codeFromUrl = searchParams.get('invite');
    if (codeFromUrl && isInviteSystemEnabled) {
      setInviteCode(codeFromUrl);
      validateInviteCode(codeFromUrl);
    }
  }, [searchParams, isInviteSystemEnabled]);

  // Validate invite code
  const validateInviteCode = useCallback(async (code: string) => {
    if (!code || !isInviteSystemEnabled) {
      setInviteCodeValid(null);
      return;
    }

    setValidatingCode(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-invite-code', {
        body: { invite_code: code }
      });

      if (error) throw error;
      setInviteCodeValid(data?.valid || false);
    } catch (error) {
      console.error('Error validating invite code:', error);
      setInviteCodeValid(false);
    } finally {
      setValidatingCode(false);
    }
  }, [isInviteSystemEnabled]);

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inviteCode) {
        validateInviteCode(inviteCode);
      } else {
        setInviteCodeValid(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inviteCode, validateInviteCode]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const signUpOptions: any = {
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      };

      // Include invite code in user metadata if provided and valid
      if (inviteCode && inviteCodeValid && isInviteSystemEnabled) {
        signUpOptions.options.data = {
          invite_code: inviteCode
        };
      }

      const { error } = await supabase.auth.signUp(signUpOptions);

      if (error) throw error;

      toast({
        title: "Welcome to FPK Nexus!",
        description: inviteCode && inviteCodeValid
          ? "Thanks for joining via invite! Your referrer will be rewarded."
          : "Your account has been created. You can now sign in.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      navigate("/community");
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-elevated animate-fade-in">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-primary">FPK Nexus</CardTitle>
          <CardDescription className="text-base">
            A safe harbor for the neurodiverse community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={searchParams.get('tab') || 'signin'} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                {isInviteSystemEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="invite-code">
                      Invite Code <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="invite-code"
                        type="text"
                        placeholder="KINDRED-XXXXX"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      />
                      {inviteCode && !validatingCode && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {inviteCodeValid === true && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {inviteCodeValid === false && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {inviteCodeValid === false && (
                      <p className="text-xs text-destructive">Invalid or expired invite code</p>
                    )}
                    {inviteCodeValid === true && (
                      <p className="text-xs text-green-600">Valid invite code!</p>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
