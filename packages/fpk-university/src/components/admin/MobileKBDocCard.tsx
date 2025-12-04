import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, FileText } from 'lucide-react';

interface MobileKBDocCardProps {
  doc: {
    id: string;
    title: string;
    source_name: string;
    source_url?: string;
    focus_areas: string[];
    document_type: string;
    publication_date: string | null;
    created_at: string;
  };
}

export function MobileKBDocCard({ doc }: MobileKBDocCardProps) {
  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="space-y-2">
        <h3 className="font-semibold text-base leading-tight line-clamp-2">
          {doc.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm">
          {doc.source_url ? (
            <a 
              href={doc.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              {doc.source_name}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              {doc.source_name}
            </span>
          )}
        </div>

        {doc.focus_areas && doc.focus_areas.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {doc.focus_areas.slice(0, 3).map((area, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                {area}
              </Badge>
            ))}
            {doc.focus_areas.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{doc.focus_areas.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <Badge variant="outline" className="text-xs font-normal px-2 py-0.5">
              {doc.document_type}
            </Badge>
          </div>
          
          {doc.publication_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(doc.publication_date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground">
          Added {new Date(doc.created_at).toLocaleDateString('en-US', { 
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>
    </div>
  );
}
