import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock } from 'lucide-react';

interface VerifyPinFormProps {
  orgId: string;
}

export function VerifyPinForm({ orgId }: VerifyPinFormProps) {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePinChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`verify-pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`verify-pin-${index - 1}`);
      prevInput?.focus();
    } else if (e.key === 'Enter' && pin.every(digit => digit !== '')) {
      handleSubmit(e as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      });
      return;
    }

    const pinString = pin.join('');
    if (pinString.length !== 6) {
      toast({
        title: "Invalid PIN",
        description: "Please enter all 6 digits",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-context-pin', {
        body: {
          userId: user.id,
          orgId: orgId,
          pin: pinString
        }
      });

      if (error) throw error;

      if (!data.success) {
        toast({
          title: "Invalid PIN",
          description: data.error || "The PIN you entered is incorrect",
          variant: "destructive"
        });
        setPin(['', '', '', '', '', '']);
        document.getElementById('verify-pin-0')?.focus();
        return;
      }

      // Success! Set session context and redirect
      const sessionContext = {
        orgId: orgId,
        role: data.role,
        userId: user.id,
        timestamp: Date.now()
      };
      
      sessionStorage.setItem('activeOrgContext', JSON.stringify(sessionContext));

      toast({
        title: "Access Granted",
        description: `Welcome! Redirecting to your ${data.role} portal...`
      });

      // Redirect based on role
      setTimeout(() => {
        if (data.role === 'student') {
          navigate(`/${orgSlug}/student-portal`, { replace: true });
        } else {
          navigate(`/${orgSlug}/admin-portal`, { replace: true });
        }
      }, 1000);

    } catch (error: any) {
      console.error('PIN verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify PIN. Please try again.",
        variant: "destructive"
      });
      setPin(['', '', '', '', '', '']);
      document.getElementById('verify-pin-0')?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* PIN Input */}
      <div className="flex justify-center gap-2">
        {pin.map((digit, index) => (
          <Input
            key={index}
            id={`verify-pin-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handlePinChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-2xl font-bold"
            disabled={isVerifying}
            autoFocus={index === 0}
          />
        ))}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold"
        disabled={isVerifying || pin.some(d => d === '')}
      >
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            Verify PIN
          </>
        )}
      </Button>

      {/* Security Note */}
      <p className="text-xs text-muted-foreground text-center">
        🔒 Your PIN is securely encrypted and never stored in plain text
      </p>
    </form>
  );
}
