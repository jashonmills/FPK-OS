import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';

interface MobilePartnerCardProps {
  partner: {
    id: string;
    name: string;
    logo_url: string;
    category: string;
    website_url: string;
    tagline: string;
    display_section: string;
    is_active: boolean;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function MobilePartnerCard({ partner, onEdit, onDelete }: MobilePartnerCardProps) {
  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <img
          src={partner.logo_url}
          alt={`${partner.name} logo`}
          className="h-12 w-12 object-contain shrink-0 rounded"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/80x40?text=Logo';
          }}
        />
        
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-semibold text-base leading-tight">
            {partner.name}
          </h3>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs border">
              {partner.category}
            </span>
            
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              partner.is_active 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              {partner.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            {partner.display_section === 'trusted_partners' 
              ? 'Trusted Partners' 
              : 'Recommended Organizations'}
          </p>
        </div>
      </div>

      {partner.tagline && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {partner.tagline}
        </p>
      )}

      <div className="flex gap-2 pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-h-[44px]"
          asChild
        >
          <a 
            href={partner.website_url} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="min-h-[44px] px-4"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="min-h-[44px] px-4"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
