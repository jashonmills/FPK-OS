import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useFamily } from '@/contexts/FamilyContext';

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonus?: string;
  popular?: boolean;
}

const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 500,
    price: 5,
  },
  {
    id: 'value',
    name: 'Value Pack',
    credits: 1200,
    price: 10,
    bonus: '20% Bonus',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 3000,
    price: 20,
    bonus: '50% Bonus',
  },
];

interface PurchaseCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PurchaseCreditsModal = ({ open, onOpenChange }: PurchaseCreditsModalProps) => {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { selectedFamily } = useFamily();

  const handlePurchase = async (packId: string) => {
    if (!selectedFamily) {
      toast({
        title: 'Error',
        description: 'No family selected',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSelectedPack(packId);

    try {
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: {
          pack_type: packId,
          family_id: selectedFamily.id,
        },
      });

      if (error) throw error;

      // Here you would integrate with Stripe's payment element
      // For now, we'll show a success message
      toast({
        title: 'Payment Initiated',
        description: `Purchasing ${CREDIT_PACKS.find(p => p.id === packId)?.credits} credits...`,
      });

      // In production, you would redirect to Stripe Checkout or use Stripe Elements
      console.log('Payment Intent:', data);
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: 'Purchase Failed',
        description: error instanceof Error ? error.message : 'Failed to initiate purchase',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setSelectedPack(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Purchase AI Credits
          </DialogTitle>
          <DialogDescription>
            Credits never expire and can be used for any AI-powered feature
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {CREDIT_PACKS.map((pack) => (
            <Card
              key={pack.id}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                pack.popular ? 'border-primary shadow-md' : ''
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              {pack.bonus && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="secondary">{pack.bonus}</Badge>
                </div>
              )}

              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{pack.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${pack.price}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="font-medium">{pack.credits.toLocaleString()} Credits</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4" />
                    <span>Never expires</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4" />
                    <span>All AI features</span>
                  </div>
                </div>

                <Button
                  onClick={() => handlePurchase(pack.id)}
                  disabled={loading}
                  className="w-full"
                  variant={pack.popular ? 'default' : 'outline'}
                >
                  {loading && selectedPack === pack.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Purchase'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
          <p className="font-medium mb-2">What can you do with credits?</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Chat with AI about your family's data (10-35 credits per query)</li>
            <li>• Analyze IEPs and educational documents (250 credits)</li>
            <li>• Convert text to speech (1 credit per 1,000 characters)</li>
            <li>• Convert speech to text (1 credit per 30 seconds)</li>
            <li>• Generate daily AI briefings (50 credits)</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
