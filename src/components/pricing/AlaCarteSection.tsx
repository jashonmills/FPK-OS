import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, BookOpen } from "lucide-react";
import { AlacartePurchaseModal } from "./AlacartePurchaseModal";
import { useFamily } from "@/contexts/FamilyContext";
import { toast } from "sonner";

export function AlaCarteSection() {
  const { selectedFamily } = useFamily();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<{
    type: string;
    title: string;
    price: number;
  } | null>(null);

  const handlePurchaseClick = (type: string, title: string, price: number) => {
    if (!selectedFamily) {
      toast.error("Please select a family first");
      return;
    }

    if (selectedFamily.subscription_tier === "free") {
      toast.error("À la carte features require a paid subscription. Please upgrade to Team or Pro.");
      return;
    }

    setSelectedPurchase({ type, title, price });
    setPurchaseModalOpen(true);
  };

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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Power-Up Your Plan with On-Demand Tools
            </h2>
            <p className="text-lg text-muted-foreground">
              Available for all Collaborative Team and Insights Pro subscribers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {alaCarteItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.type} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary" className="text-lg font-semibold">
                        ${item.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 min-h-[80px]">
                      {item.description}
                    </CardDescription>
                    <Button
                      onClick={() => handlePurchaseClick(item.type, item.title, item.price)}
                      className="w-full"
                    >
                      Purchase Now
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
