import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditBalanceDisplay } from '@/components/credits/CreditBalanceDisplay';
import { CreditUsageHistory } from '@/components/credits/CreditUsageHistory';
import { PurchaseCreditsModal } from '@/components/credits/PurchaseCreditsModal';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const CreditsTab = () => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Credits</h2>
          <p className="text-muted-foreground">
            Manage your AI feature credits and purchase additional credits
          </p>
        </div>
        <Button onClick={() => setShowPurchaseModal(true)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Buy Credits
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <CreditBalanceDisplay />
        
        <Card>
          <CardHeader>
            <CardTitle>How Credits Work</CardTitle>
            <CardDescription>
              Understanding your AI credit system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Monthly Allowance</h4>
              <p className="text-sm text-muted-foreground">
                Your subscription includes a monthly credit allowance that resets at the start of each billing cycle. These credits expire if not used.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Purchased Credits</h4>
              <p className="text-sm text-muted-foreground">
                Credits you purchase never expire and carry over month to month. They're used only after your monthly allowance is consumed.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Credit Costs</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Simple chat query: 10 credits</li>
                <li>• Complex chat (RAG): 35 credits</li>
                <li>• Document analysis: 250 credits</li>
                <li>• Text-to-speech: 1 credit/1K chars</li>
                <li>• Speech-to-text: 1 credit/30 sec</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreditUsageHistory />

      <PurchaseCreditsModal
        open={showPurchaseModal}
        onOpenChange={setShowPurchaseModal}
      />
    </div>
  );
};
