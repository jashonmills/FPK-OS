
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned_at: string;
  badge_id?: string;
  rarity?: string;
}

interface BadgeDisplayProps {
  badges: BadgeItem[];
  compact?: boolean;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges, compact = true }) => {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No badges earned yet</p>
        <p className="text-sm">Complete activities to earn badges!</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${compact ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-3'}`}>
      {badges.map((badge) => (
        <div key={badge.id} className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl mb-2">{badge.icon}</div>
          <h3 className="font-semibold text-sm">{badge.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
          {badge.earned_at && (
            <p className="text-xs text-muted-foreground mt-1">
              Earned: {new Date(badge.earned_at).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default BadgeDisplay;
