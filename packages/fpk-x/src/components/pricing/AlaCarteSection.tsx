import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, BookOpen, Zap } from "lucide-react";
import { AlacartePurchaseModal } from "./AlacartePurchaseModal";
import { useFamily } from "@/contexts/FamilyContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

export function AlaCarteSection() {
  const { selectedFamily } = useFamily();
  const { user } = useAuth();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<{
    type: string;
    title: string;
    price: number;
  } | null>(null);

  // Fetch family subscription data
  const { data: familyData } = useQuery({
    queryKey: ['family-subscription', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;
      
      const { data, error } = await supabase
        .from('families')
        .select('subscription_tier')
        .eq('id', selectedFamily.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id && !!user,
  });

  const currentTier = familyData?.subscription_tier || 'free';
  const canPurchaseAlaCarte = currentTier === 'team' || currentTier === 'pro';

  const handlePurchaseClick = (type: string, title: string, price: number) => {
    if (!user) {
      toast.error("Please sign in to purchase à la carte items");
      return;
    }

    if (!selectedFamily) {
      toast.error("Please select a family first");
      return;
    }

    if (!canPurchaseAlaCarte) {
      toast.error("À la carte features require a paid subscription. Please upgrade to Team or Pro.");
      return;
    }

    setSelectedPurchase({ type, title, price });
    setPurchaseModalOpen(true);
  };

  const creditPacks = [
    {
      type: "credit_starter",
      title: "Starter Pack",
      description: "Perfect for occasional AI feature users. Get 500 AI Credits that never expire.",
      price: 5.00,
      credits: 500,
      bonus: null,
      icon: Zap,
    },
    {
      type: "credit_value",
      title: "Value Pack",
      description: "Best value! Get 1,200 AI Credits (20% bonus) that never expire. Great for regular users.",
      price: 10.00,
      credits: 1200,
      bonus: "20% Bonus",
      icon: Zap,
    },
    {
      type: "credit_pro",
      title: "Pro Pack",
      description: "Maximum value! Get 3,000 AI Credits (50% bonus) that never expire. For power users.",
      price: 20.00,
      credits: 3000,
      bonus: "50% Bonus",
      icon: Zap,
    },
  ];

  const alaCarteItems = [
    {
      type: "deep_dive",
      title: "On-Demand Document Deep-Dive",
      description: "Have our AI perform a comprehensive analysis and generate a full summary of a single, complex document (like a diagnostic evaluation or IEP).",
      price: 9.99,
      icon: Sparkles,
    },
    {
      type: "goal_generation",
      title: "AI-Generated Goal",
      description: "Generate a new, data-driven, and measurable goal for your child, perfect for IEPs and progress tracking.",
      price: 4.99,
      icon: Target,
    },
    {
      type: "resource_pack",
      title: "Personalized Resource Pack",
      description: "Let our AI build a custom, curated learning plan for you from our extensive knowledge base, tailored to your child's latest progress and challenges.",
      price: 19.99,
      icon: BookOpen,
    },
  ];

  return (
    <>
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          {/* AI Credit Packs */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              AI Credit Packs
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              Top up your AI Credits anytime. Credits never expire and work across all AI features.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Text-to-Speech:</strong> 1 credit per 1,000 characters • <strong>AI Chat & Analysis:</strong> Variable by complexity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {creditPacks.map((pack) => {
              const Icon = pack.icon;
              return (
                <Card key={pack.type} className="relative flex flex-col">
                  {pack.bonus && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                      {pack.bonus}
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary" className="text-lg font-semibold">
                        ${pack.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{pack.title}</CardTitle>
                    <div className="text-2xl font-bold text-primary mt-2">
                      {pack.credits.toLocaleString()} Credits
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <CardDescription className="mb-4 flex-1">
                      {pack.description}
                    </CardDescription>
                    <Button
                      onClick={() => handlePurchaseClick(pack.type, pack.title, pack.price)}
                      className="w-full mt-auto"
                    >
                      Purchase Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Separator className="my-12" />

          {/* On-Demand AI Tools */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              On-Demand AI Tools
            </h2>
            <p className="text-lg text-muted-foreground">
              Available for Collaborative Team and Insights Pro subscribers.
            </p>
            {!canPurchaseAlaCarte && user && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                Upgrade to Team or Pro to access these features
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {alaCarteItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.type} className="relative flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary" className="text-lg font-semibold">
                        ${item.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <CardDescription className="mb-4 flex-1">
                      {item.description}
                    </CardDescription>
                    <Button
                      onClick={() => handlePurchaseClick(item.type, item.title, item.price)}
                      className="w-full mt-auto"
                      disabled={!canPurchaseAlaCarte}
                    >
                      {canPurchaseAlaCarte ? 'Purchase Now' : 'Upgrade to Access'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {selectedPurchase && (
        <AlacartePurchaseModal
          open={purchaseModalOpen}
          onOpenChange={setPurchaseModalOpen}
          purchaseType={selectedPurchase.type}
          title={selectedPurchase.title}
          price={selectedPurchase.price}
        />
      )}
    </>
  );
}
