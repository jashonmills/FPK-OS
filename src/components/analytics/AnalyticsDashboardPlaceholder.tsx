import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AnalyticsDashboardPlaceholder() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-2xl p-8 text-center">
          <Zap className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4">
            Advanced Analytics Coming Soon
          </h2>
          <p className="text-muted-foreground mb-6">
            Our AI-powered analytics dashboard is under active development. 
            In the meantime, all your documents are securely stored and 
            fully searchable.
          </p>
          <Badge variant="secondary">Expected: Next Update</Badge>
        </Card>
      </div>
    </div>
  );
}
