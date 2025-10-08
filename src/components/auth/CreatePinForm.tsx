import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, KeyRound, Check } from 'lucide-react';

interface CreatePinFormProps {
  orgId: string;
  onPinCreated: () => void;
}

export function CreatePinForm({ orgId, onPinCreated }: CreatePinFormProps) {
  const { toast } = useToast();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [isCreating, setIsCreating] = useState(false);

  const handlePinChange = (index: number, value: string, isConfirm: boolean = false) => {
    if (value && !/^\d$/.test(value)) return;

    const currentPin = isConfirm ? confirmPin : pin;
    const newPin = [...currentPin];
    newPin[index] = value;
    
    if (isConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
    }

    // Auto-focus next input
    if (value && index < 5) {
      const prefix = isConfirm ? 'confirm-pin' : 'pin';
      const nextInput = document.getElementById(`${prefix}-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm: boolean = false) => {
    const currentPin = isConfirm ? confirmPin : pin;
    const prefix = isConfirm ? 'confirm-pin' : 'pin';

    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      const prevInput = document.getElementById(`${prefix}-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pinString = pin.join('');
    const confirmPinString = confirmPin.join('');

    if (pinString.length !== 6 || confirmPinString.length !== 6) {
      toast({
        title: "Incomplete PIN",
        description: "Please enter all 6 digits for both fields",
        variant: "destructive"
      });
      return;
    }

    if (pinString !== confirmPinString) {
      toast({
        title: "PINs Don't Match",
        description: "Please make sure both PINs are identical",
        variant: "destructive"
      });
      setConfirmPin(['', '', '', '', '', '']);
      document.getElementById('confirm-pin-0')?.focus();
      return;
    }

    setIsCreating(true);

    try {
      const { data, error } = await supabase.functions.invoke('set-initial-pin', {
        body: {
          orgId,
          pin: pinString
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to create PIN');
      }

      toast({
        title: "PIN Created Successfully",
        description: "You can now use your PIN to access this organization"
      });

      // Notify parent component
      onPinCreated();

    } catch (error: any) {
      console.error('PIN creation error:', error);
      toast({
        title: "Failed to Create PIN",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      setPin(['', '', '', '', '', '']);
      setConfirmPin(['', '', '', '', '', '']);
      document.getElementById('pin-0')?.focus();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Create PIN */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-center block">
          Create Your 6-Digit PIN
        </label>
        <div className="flex justify-center gap-2">
          {pin.map((digit, index) => (
            <Input
              key={index}
              id={`pin-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value, false)}
              onKeyDown={(e) => handleKeyDown(index, e, false)}
              className="w-12 h-14 text-center text-2xl font-bold"
              disabled={isCreating}
              autoFocus={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Confirm PIN */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-center block">
          Confirm Your PIN
        </label>
        <div className="flex justify-center gap-2">
          {confirmPin.map((digit, index) => (
            <Input
              key={index}
              id={`confirm-pin-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value, true)}
              onKeyDown={(e) => handleKeyDown(index, e, true)}
              className="w-12 h-14 text-center text-2xl font-bold"
              disabled={isCreating}
            />
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold"
        disabled={isCreating || pin.some(d => d === '') || confirmPin.some(d => d === '')}
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating PIN...
          </>
        ) : (
          <>
            <KeyRound className="mr-2 h-5 w-5" />
            Create PIN
          </>
        )}
      </Button>

      {/* Security Notes */}
      <div className="space-y-2 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Choose a PIN you'll remember
        </p>
        <p className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Don't share your PIN with anyone
        </p>
        <p className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Your PIN is securely encrypted
        </p>
      </div>
    </form>
  );
}
