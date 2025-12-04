import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface Game {
  title: string;
  url: string;
  imageUrl: string;
  grades: string;
  description: string;
  outcomes: string[];
  tags: string[];
}

interface GameCardProps {
  game: Game;
  onPlay: () => void;
}

export function GameCard({ game, onPlay }: GameCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col md:flex-row group">
      {/* Image Half */}
      <div 
        className="w-full md:w-2/5 h-48 md:h-auto bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${game.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
      </div>

      {/* Content Half */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Grade Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
            {game.grades}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
          {game.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {game.description}
        </p>

        {/* Learning Outcomes */}
        <div className="mb-4 flex-1">
          <h4 className="text-sm font-semibold mb-2 text-foreground/80">Learning Outcomes:</h4>
          <ul className="space-y-1.5">
            {game.outcomes.map((outcome, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-start">
                <span className="mr-2 text-primary mt-0.5">•</span>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {game.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Play Button */}
        <Button 
          onClick={onPlay}
          className="w-full mt-auto"
          size="lg"
        >
          <Play className="mr-2 h-4 w-4" />
          Play Game
        </Button>
      </div>
    </Card>
  );
}
