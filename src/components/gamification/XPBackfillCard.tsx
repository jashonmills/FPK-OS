
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const XPBackfillCard: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [xpAmount, setXpAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBackfill = async () => {
    if (!userId || !xpAmount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: `Added ${xpAmount} XP to user ${userId}`,
      });
      
      setUserId('');
      setXpAmount('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to backfill XP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          XP Backfill
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="xpAmount">XP Amount</Label>
          <Input
            id="xpAmount"
            type="number"
            value={xpAmount}
            onChange={(e) => setXpAmount(e.target.value)}
            placeholder="Enter XP amount"
          />
        </div>
        
        <Button 
          onClick={handleBackfill}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Adding XP...' : 'Backfill XP'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default XPBackfillCard;
