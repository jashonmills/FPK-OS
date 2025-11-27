import { TransparentTile } from '@/components/ui/transparent-tile';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export function PageHeader({ icon: Icon, title, subtitle }: PageHeaderProps) {
  return (
    <TransparentTile className="p-6 mb-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Icon className="h-8 w-8" />
        {title}
      </h1>
      <p className="text-muted-foreground mt-1">{subtitle}</p>
    </TransparentTile>
  );
}
