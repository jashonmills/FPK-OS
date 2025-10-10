import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  secondaryText?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryText,
}: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-2xl w-full border-2 border-dashed">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button onClick={onAction} size="lg" className="w-full max-w-xs">
            {actionLabel}
          </Button>
          {secondaryText && (
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {secondaryText}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
