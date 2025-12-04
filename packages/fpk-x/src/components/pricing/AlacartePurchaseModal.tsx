import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFamily } from "@/contexts/FamilyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AlacartePurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseType: string;
  title: string;
  price: number;
}

export function AlacartePurchaseModal({
  open,
  onOpenChange,
  purchaseType,
  title,
  price,
}: AlacartePurchaseModalProps) {
  const { selectedFamily, selectedStudent } = useFamily();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    if (!selectedFamily || !selectedStudent) {
      toast.error("Please select a family and student");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing purchase...");

    try {
      // Create payment intent
      const { data, error } = await supabase.functions.invoke("purchase-alacarte", {
        body: {
          familyId: selectedFamily.id,
          purchaseType,
          metadata: {
            student_id: selectedStudent.id,
            student_name: selectedStudent.student_name,
          },
        },
      });

      if (error) throw error;

      // For this demo, we'll simulate successful payment
      // In production, you would integrate Stripe Elements here
      toast.success("Purchase completed! Processing your request...", { id: toastId });
      
      // Execute the service based on purchase type
      if (purchaseType === "goal_generation") {
        // You would navigate to goal creation or trigger the AI
        toast.success("AI is generating your goal...");
      } else if (purchaseType === "resource_pack") {
        toast.success("Creating your personalized resource pack...");
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast.error("Purchase failed: " + error.message, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Complete your purchase for ${price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Service:</span>
              <span className="font-medium">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Price:</span>
              <span className="font-semibold text-lg">${price.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Note: In production, Stripe payment form would appear here.
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Purchase
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
