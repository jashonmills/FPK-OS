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
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Further Reading & Recommended Organizations
        </h2>
        
        <div className="space-y-1">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group py-4 px-5 rounded-lg transition-all duration-200 hover:bg-accent/50 border-b border-border/50 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-1.5 flex items-center gap-2">
                    {resource.name}
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
