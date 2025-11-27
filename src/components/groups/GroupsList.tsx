import { useOrgGroups } from '@/hooks/useOrgGroups';
import { GroupCard } from './GroupCard';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Loader2 } from 'lucide-react';

export function GroupsList() {
  const { groups, isLoading } = useOrgGroups();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <Card className="bg-orange-500/10 border-orange-400/20">
        <CardContent className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-orange-300/70 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-orange-200">No Groups Yet</h3>
          <p className="text-orange-100/80">
            Create your first group to start organizing students for assignments and courses.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}