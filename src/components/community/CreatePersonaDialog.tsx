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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface CreatePersonaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPersonaCreated: (persona: any) => void;
}

const CreatePersonaDialog = ({ open, onOpenChange, onPersonaCreated }: CreatePersonaDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [personaType, setPersonaType] = useState<string>("");
  const [bio, setBio] = useState("");

  const handleCreatePersona = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data: newPersona, error } = await supabase.from("personas").insert([{
        user_id: user.id,
        display_name: displayName,
        persona_type: personaType as "PARENT" | "EDUCATOR" | "PROFESSIONAL" | "INDIVIDUAL",
        bio: bio || null,
      }]).select().single();

      if (error) throw error;

      toast({
        title: "Persona created!",
        description: "Welcome to the community.",
      });

      // Auto-join default circles
      const { data: defaultCircles, error: circlesError } = await supabase
        .from("circles")
        .select("id")
        .eq("is_default_circle", true);

      if (!circlesError && defaultCircles && defaultCircles.length > 0) {
        const circleMembers = defaultCircles.map(circle => ({
          circle_id: circle.id,
          user_id: user.id,
          role: "MEMBER" as const,
        }));

        await supabase
          .from("circle_members")
          .insert(circleMembers);
      }

      onPersonaCreated(newPersona);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error creating persona",
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
          <DialogTitle className="text-2xl">Create Your Persona</DialogTitle>
          <DialogDescription>
            Let's set up your identity in the FPK Nexus community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreatePersona} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name *</Label>
            <Input
              id="display-name"
              placeholder="How should we call you?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="persona-type">I am a... *</Label>
            <Select value={personaType} onValueChange={setPersonaType} required>
              <SelectTrigger id="persona-type">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PARENT">Parent</SelectItem>
                <SelectItem value="EDUCATOR">Educator</SelectItem>
                <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                <SelectItem value="INDIVIDUAL">Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a bit about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Persona
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePersonaDialog;
