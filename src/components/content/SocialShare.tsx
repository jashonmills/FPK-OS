import { Facebook, Twitter, Linkedin, Link as LinkIcon, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

export const SocialShare = ({ title, url, description }: SocialShareProps) => {
  const { toast } = useToast();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : '';

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'The article link has been copied to your clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(shareLinks.twitter, '_blank', 'width=550,height=420')}
        className="hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]"
      >
        <Twitter className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(shareLinks.facebook, '_blank', 'width=550,height=420')}
        className="hover:bg-[#4267B2]/10 hover:text-[#4267B2]"
      >
        <Facebook className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(shareLinks.linkedin, '_blank', 'width=550,height=420')}
        className="hover:bg-[#0077B5]/10 hover:text-[#0077B5]"
      >
        <Linkedin className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.location.href = shareLinks.email}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Mail className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};
