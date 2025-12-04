import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface CreateCircleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCircleCreated: () => void;
}

const CreateCircleDialog = ({ open, onOpenChange, onCircleCreated }: CreateCircleDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create the circle
      const { data: circleData, error: circleError } = await supabase
        .from("circles")
        .insert({
          name,
          description: description || null,
          is_private: isPrivate,
          created_by: user.id,
        })
        .select()
        .single();

      if (circleError) throw circleError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from("circle_members")
        .insert({
          circle_id: circleData.id,
          user_id: user.id,
          role: "ADMIN",
        });

      if (memberError) throw memberError;

      toast({
        title: "Circle created!",
        description: "Your new community space is ready.",
      });

      setName("");
      setDescription("");
      setIsPrivate(false);
      onCircleCreated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error creating circle",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create a Circle</DialogTitle>
          <DialogDescription>
            Start a new community space for meaningful connections.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateCircle} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="circle-name">Circle Name *</Label>
            <Input
              id="circle-name"
              placeholder="e.g., Parent Support Group"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="circle-description">Description (Optional)</Label>
            <Textarea
              id="circle-description"
              placeholder="What's this circle about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="private-circle">Private Circle</Label>
              <p className="text-xs text-muted-foreground">
                Only members can see posts
              </p>
            </div>
            <Switch
              id="private-circle"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Circle
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCircleDialog;
