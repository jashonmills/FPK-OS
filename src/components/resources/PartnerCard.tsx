import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { PartnerResource } from '@/hooks/usePartnerResources';

interface PartnerCardProps {
  partner: PartnerResource;
}

export function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-card/95 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="space-y-4">
        {/* Logo */}
        <div className="h-32 flex items-center justify-center bg-muted rounded-lg p-4">
          <img
            src={partner.logo_url}
            alt={`${partner.name} logo`}
            className="max-h-full max-w-full object-contain"
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/200x80?text=Partner+Logo';
            }}
          />
        </div>
        
        {/* Name & Tagline */}
        <div>
          <CardTitle className="text-xl mb-2">{partner.name}</CardTitle>
          <CardDescription className="text-sm font-medium">
            {partner.tagline}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {partner.description}
        </p>
        
        {/* CTA Button */}
        <Button
          className="w-full"
          onClick={() => window.open(partner.website_url, '_blank', 'noopener,noreferrer')}
        >
          Learn More
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
