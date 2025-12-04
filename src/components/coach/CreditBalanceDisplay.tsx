import React from 'react';
import { useCreditBalance } from '@/hooks/useCreditBalance';
import { Badge } from '@/components/ui/badge';
import { Coins, Infinity } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CreditBalanceDisplay({ className }: { className?: string }) {
  const { balance, isUnlimited, isLoading } = useCreditBalance();

  if (isLoading) {
    return (
      <Badge variant="outline" className={cn("gap-2", className)}>
        <Coins className="h-4 w-4 animate-pulse" />
        <span>Loading...</span>
      </Badge>
    );
  }

  if (isUnlimited) {
    return (
      <Badge variant="default" className={cn("gap-2 bg-gradient-to-r from-purple-500 to-pink-500", className)}>
        <Infinity className="h-4 w-4" />
        <span className="font-semibold">Unlimited</span>
      </Badge>
    );
  }

  // Color coding based on balance
  const getVariant = (): "default" | "destructive" | "outline" | "secondary" => {
    if (balance === 0) return 'destructive';
    if (balance < 50) return 'secondary';
    return 'default';
  };

  return (
    <Badge 
      variant={getVariant()} 
      className={cn("gap-2", className)}
    >
      <Coins className="h-4 w-4" />
      <span className="font-semibold">{balance.toLocaleString()} credits</span>
    </Badge>
  );
}
