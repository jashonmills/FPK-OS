
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BadgeItem {
  id: string;
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  awarded_at?: string;
}

interface BadgeDisplayProps {
  badges: BadgeItem[];
  className?: string;
  compact?: boolean;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  className = '',
  compact = false
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (compact) {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {badges.slice(0, 5).map((badge) => (
          <div
            key={badge.id}
            className="relative group"
            title={`${badge.name}: ${badge.description}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-sm shadow-sm">
              {badge.icon}
            </div>
          </div>
        ))}
        {badges.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
            +{badges.length - 5}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`}>
      {badges.map((badge) => (
        <Card key={badge.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{badge.name}</h3>
                  <Badge variant="secondary" className={`text-xs ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {badge.description}
                </p>
                {badge.awarded_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Earned {new Date(badge.awarded_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BadgeDisplay;
