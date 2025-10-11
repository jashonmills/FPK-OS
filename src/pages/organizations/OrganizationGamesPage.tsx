import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Play } from 'lucide-react';
import { GameViewerModal } from '@/components/organizations/GameViewerModal';

interface Game {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  category: string;
}

const gamesList: Game[] = [
  {
    id: 'math-challenge',
    title: 'Math Challenge',
    description: 'Practice your addition, subtraction, and multiplication in this fun challenge.',
    url: 'https://fpkgames.com/math/',
    icon: '🧮',
    category: 'Mathematics'
  },
  {
    id: 'reading-comprehension',
    title: 'Reading Comprehension',
    description: 'Read short stories and answer questions to test your understanding.',
    url: 'https://fpkgames.com/reading/',
    icon: '📚',
    category: 'Language Arts'
  },
  {
    id: 'science-quiz',
    title: 'Science Quiz',
    description: 'Test your knowledge of the natural world with this science quiz.',
    url: 'https://fpkgames.com/science/',
    icon: '🔬',
    category: 'Science'
  },
  {
    id: 'vocabulary-builder',
    title: 'Vocabulary Builder',
    description: 'Expand your word knowledge with interactive vocabulary exercises.',
    url: 'https://fpkgames.com/vocabulary/',
    icon: '📝',
    category: 'Language Arts'
  },
  {
    id: 'geography-explorer',
    title: 'Geography Explorer',
    description: 'Explore the world and test your geography knowledge.',
    url: 'https://fpkgames.com/geography/',
    icon: '🌍',
    category: 'Social Studies'
  },
  {
    id: 'logic-puzzles',
    title: 'Logic Puzzles',
    description: 'Sharpen your critical thinking with challenging logic puzzles.',
    url: 'https://fpkgames.com/logic/',
    icon: '🧩',
    category: 'Critical Thinking'
  }
];

export default function OrganizationGamesPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Educational Games</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Engage with interactive educational games that make learning fun and effective.
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gamesList.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{game.icon}</span>
                  <div>
                    <CardTitle className="text-xl">{game.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{game.category}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {game.description}
              </CardDescription>
              <Button 
                onClick={() => handlePlayGame(game)}
                className="w-full"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Play Game
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Game Viewer Modal */}
      {selectedGame && (
        <GameViewerModal
          isOpen={!!selectedGame}
          onClose={handleCloseModal}
          gameUrl={selectedGame.url}
          gameTitle={selectedGame.title}
        />
      )}
    </div>
  );
}
