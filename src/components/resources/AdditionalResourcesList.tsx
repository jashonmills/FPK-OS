import { usePartnerResources } from '@/hooks/usePartnerResources';
import { ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function AdditionalResourcesList() {
  const { data: resources, isLoading } = usePartnerResources('Educational Resources');

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Further Reading & Recommended Organizations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group p-4 rounded-lg transition-all duration-200 hover:bg-accent/50 border border-border/30 hover:border-primary/50"
            >
              <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-2 flex items-center gap-2">
                {resource.name}
                <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {resource.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
