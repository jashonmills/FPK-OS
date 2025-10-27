import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const editProfileSchema = z.object({
  display_name: z.string().min(1, "Display name is required").max(50, "Display name must be less than 50 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").nullable(),
  persona_type: z.enum(["PARENT", "EDUCATOR", "PROFESSIONAL", "INDIVIDUAL"]),
  header_image_url: z.string().url().optional().or(z.literal("")),
  social_links: z.object({
    website: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
  }).optional(),
  headline: z.string().max(100, "Headline must be less than 100 characters").optional().or(z.literal("")),
  pronouns: z.string().max(50, "Pronouns must be less than 50 characters").optional().or(z.literal("")),
  location: z.string().max(100, "Location must be less than 100 characters").optional().or(z.literal("")),
  interests: z.string().optional(),
  diagnosis_info: z.string().max(1000, "Must be less than 1000 characters").optional().or(z.literal("")),
  why_i_am_here: z.string().max(1000, "Must be less than 1000 characters").optional().or(z.literal("")),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  persona: {
    id: string;
    display_name: string;
    bio: string | null;
    persona_type: string;
    avatar_url?: string | null;
    header_image_url?: string | null;
    social_links?: any;
    headline?: string | null;
    pronouns?: string | null;
    location?: string | null;
    interests?: any;
    diagnosis_info?: string | null;
    why_i_am_here?: string | null;
  };
  onProfileUpdated: () => void;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  persona,
  onProfileUpdated,
}: EditProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(persona.avatar_url || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(persona.header_image_url || null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      display_name: persona.display_name,
      bio: persona.bio || "",
      persona_type: persona.persona_type as any,
      header_image_url: persona.header_image_url || "",
      social_links: {
        website: persona.social_links?.website || "",
        linkedin: persona.social_links?.linkedin || "",
      },
      headline: persona.headline || "",
      pronouns: persona.pronouns || "",
      location: persona.location || "",
      interests: Array.isArray(persona.interests) ? persona.interests.join(", ") : "",
      diagnosis_info: persona.diagnosis_info || "",
      why_i_am_here: persona.why_i_am_here || "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File, type: 'avatar' | 'banner') => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('profile-media')
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('profile-media')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const onSubmit = async (values: EditProfileFormData) => {
    setLoading(true);
    try {
      let avatarUrl = persona.avatar_url;
      let bannerUrl = values.header_image_url || persona.header_image_url;

      // Upload avatar if changed
      if (avatarFile) {
        avatarUrl = await uploadFile(avatarFile, 'avatar');
      }

      // Upload banner if changed
      if (bannerFile) {
        bannerUrl = await uploadFile(bannerFile, 'banner');
      }

      // Parse interests from comma-separated string
      const interestsArray = values.interests 
        ? values.interests.split(',').map(i => i.trim()).filter(i => i)
        : [];

      const { error } = await supabase
        .from("personas")
        .update({
          display_name: values.display_name,
          bio: values.bio,
          persona_type: values.persona_type,
          avatar_url: avatarUrl,
          header_image_url: bannerUrl || null,
          social_links: values.social_links || {},
          headline: values.headline || null,
          pronouns: values.pronouns || null,
          location: values.location || null,
          interests: interestsArray.length > 0 ? interestsArray : null,
          diagnosis_info: values.diagnosis_info || null,
          why_i_am_here: values.why_i_am_here || null,
        })
        .eq("id", persona.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      onProfileUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Image Upload - MOVED TO TOP */}
            <div className="space-y-3 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <FormLabel className="text-base font-semibold">Profile Picture (Avatar)</FormLabel>
              </div>
              <p className="text-sm text-muted-foreground">
                This appears in your circular avatar throughout the site
              </p>
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24 ring-2 ring-primary/20">
                  <AvatarImage src={avatarPreview || undefined} />
                  <AvatarFallback className="text-2xl">
                    {persona.display_name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {avatarPreview ? 'Change Avatar' : 'Upload Avatar'}
                  </Button>
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAvatarPreview(null);
                        setAvatarFile(null);
                        if (avatarInputRef.current) avatarInputRef.current.value = '';
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Banner Image Upload */}
            <div className="space-y-3 p-4 rounded-lg border-2 border-muted bg-muted/20">
              <FormLabel className="text-base font-semibold">Banner Image (Optional)</FormLabel>
              <p className="text-sm text-muted-foreground">
                This appears as the wide header image at the top of your profile (820x312px recommended)
              </p>
              <div className="relative">
                {bannerPreview ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setBannerPreview(null);
                        setBannerFile(null);
                        if (bannerInputRef.current) bannerInputRef.current.value = '';
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload banner image</span>
                  </button>
                )}
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your display name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="persona_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your persona type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PARENT">Parent</SelectItem>
                      <SelectItem value="EDUCATOR">Educator</SelectItem>
                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Tell us about yourself..."
                      className="resize-none"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="social_links.website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourwebsite.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_links.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Additional Profile Information</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <Input placeholder="A short one-line summary (e.g., Parent of 2, Autism Advocate)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pronouns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pronouns</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., she/her, he/him, they/them" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <FormControl>
                        <Input placeholder="Separate with commas (e.g., Movies, Gardening, Advocacy)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnosis_info"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>My Journey (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          placeholder="Share what you're comfortable with about your diagnosis or journey (e.g., 'Parent of a child with Autism', 'Living with ADHD')"
                          className="resize-none"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="why_i_am_here"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why I'm Here (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          placeholder="Your personal mission statement or reason for joining the community"
                          className="resize-none"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
