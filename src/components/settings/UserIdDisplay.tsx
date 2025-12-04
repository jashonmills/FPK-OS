import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const UserIdDisplay = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (user?.id) {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your User ID</CardTitle>
        <CardDescription>
          Use this ID for feature flag testing and targeting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono break-all">
            {user?.id || 'Not authenticated'}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={!user?.id}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
