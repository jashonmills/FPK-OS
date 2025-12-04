import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface AuthorBioProps {
  author: {
    id: string;
    display_name: string;
    author_slug?: string;
    bio?: string;
    credentials?: string;
    avatar_url?: string;
    is_ai_author?: boolean;
  };
  maxLength?: number;
}

export function AuthorBio({ author, maxLength = 150 }: AuthorBioProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const bio = author.bio || 'No bio available';
  const shouldTruncate = bio.length > maxLength;
  const displayBio = shouldTruncate && !isExpanded 
    ? `${bio.substring(0, maxLength)}...` 
    : bio;

  const handleAuthorClick = () => {
    const slug = author.author_slug || author.id;
    navigate(`/blog/author/${slug}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex gap-4 p-6 border rounded-lg bg-muted/30">
      <Avatar className="h-16 w-16 cursor-pointer" onClick={handleAuthorClick}>
        <AvatarImage src={author.avatar_url} alt={author.display_name} />
        <AvatarFallback>{getInitials(author.display_name)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <h3 
            className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors"
            onClick={handleAuthorClick}
          >
            {author.display_name}
          </h3>
          {author.is_ai_author && (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              AI Author
            </Badge>
          )}
        </div>
        
        {author.credentials && (
          <p className="text-sm text-muted-foreground">{author.credentials}</p>
        )}
        
        <p className="text-sm leading-relaxed">
          {displayBio}
          {shouldTruncate && !isExpanded && (
            <Button
              variant="link"
              className="p-0 h-auto font-semibold ml-1"
              onClick={handleAuthorClick}
            >
              Read more
            </Button>
          )}
        </p>
      </div>
    </div>
  );
}
