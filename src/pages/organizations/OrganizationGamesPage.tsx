import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { GameViewerModal } from '@/components/organizations/GameViewerModal';
import { GameCard } from '@/components/organizations/GameCard';
import { useIsMobile } from '@/hooks/useIsMobile';
interface Game {
  title: string;
  url: string;
  imageUrl: string;
  grades: string;
  description: string;
  outcomes: string[];
  tags: string[];
}
const gamesList: Game[] = [{
  title: "EnergyBear: Calm & Focus",
  url: "https://energybear-calm-game.lovable.app/",
  imageUrl: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/fpk-games-assets/energybear-CdqGabUy.jpg",
  grades: "All Grades",
  description: "Short mindfulness mini‑games that teach calm breathing and focus. Great as a pre‑lesson reset or study break.",
  outcomes: ["Self‑regulation & stress reduction", "Improved attention before lessons", "Builds positive study habits"],
  tags: ["Mindfulness", "SEL", "Focus"]
}, {
  title: "Eco‑Genesis: Forest Realm",
  url: "https://eco-genesis-forest-realm.lovable.app/",
  imageUrl: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/fpk-games-assets/forest-realm-C0AWK7eK.jpg",
  grades: "Grades 6–9",
  description: "Interactive ecology quests about energy flow, food webs, photosynthesis, and conservation in a living forest.",
  outcomes: ["Model food webs & trophic levels", "Explain photosynthesis & cycles", "Evaluate human impact & restoration"],
  tags: ["Science", "Ecology", "Systems"]
}, {
  title: "Learn‑Escape Prodigy",
  url: "https://learn-escape-prodigy.lovable.app/",
  imageUrl: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/fpk-games-assets/science-lab-escape-BIfHr_LQ.jpg",
  grades: "Grades 4–12",
  description: "Study bite‑size lessons (physics/chem/bio) then solve escape‑room puzzles that apply what you just learned.",
  outcomes: ["Concept→application learning", "Data reasoning & problem‑solving", "Cross‑discipline science practice"],
  tags: ["Science", "Puzzles", "Critical Thinking"]
}, {
  title: "Word Wizard Duel",
  url: "https://preview--wizard-word-battle.lovable.app/",
  imageUrl: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/fpk-games-assets/word-wizard-B6oYlgSi.jpg",
  grades: "Grades 4–12",
  description: "Fast‑paced vocabulary battles. Correct definitions and spellings power your spells; gentle feedback teaches misses.",
  outcomes: ["Vocabulary depth & usage", "Context clues & morphology", "Confidence in academic language"],
  tags: ["ELA", "Vocabulary", "Spelling"]
}, {
  title: "Addition Journey Quest",
  url: "https://addition-journey-quest.lovable.app/",
  imageUrl: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/fpk-games-assets/addition-journey-quest.jpg",
  grades: "Grades 3–6",
  description: "Collect, combine, and conquer addition challenges on an adventure board with power‑ups and quick math checks.",
  outcomes: ["Fluent addition strategies", "Number sense & mental math", "Motivating goal‑based practice"],
  tags: ["Math", "Fluency", "Gamified"]
}, {
  title: "Imagination Builder",
  url: "https://prompt-play-palette.lovable.app/",
  imageUrl: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/fpk-games-assets/imagination-builder-DaxNKjNR.jpg",
  grades: "All Grades",
  description: "A magical space where students explore their creativity, answer thought‑provoking questions, and watch AI bring their imagination to life.",
  outcomes: ["Creative expression & storytelling", "Critical thinking through questions", "AI-assisted learning experiences"],
  tags: ["Creativity", "AI", "Expression"]
}, {
  title: "Emotion Detective",
  url: "https://mind-explorer-game.lovable.app/",
  imageUrl: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/fpk-games-assets/emotion-detective-SizJYyoq.jpg",
  grades: "Grades 4–8",
  description: "Learn to recognize, understand, and practice emotions through fun interactive lessons. Explore empathy, coping strategies, and self-regulation with neurodiverse-friendly design.",
  outcomes: ["Emotional recognition & understanding", "Empathy development & practice", "Self-regulation & coping strategies"],
  tags: ["SEL", "Empathy", "Emotions"]
}];
export default function OrganizationGamesPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const handlePlayGame = (game: Game) => {
    if (isMobile) {
      // On mobile, navigate to full-screen page
      const url = `/play-game?url=${encodeURIComponent(game.url)}&title=${encodeURIComponent(game.title)}`;
      navigate(url);
    } else {
      // On desktop, show modal
      setSelectedGame(game);
    }
  };
  const handleCloseModal = () => {
    setSelectedGame(null);
  };
  return <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Educational Games</h1>
        </div>
        <p className="text-slate-50 text-2xl font-semibold">
          Engage with interactive educational games that make learning fun and effective.
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {gamesList.map((game, index) => <GameCard key={index} game={game} onPlay={() => handlePlayGame(game)} />)}
      </div>

      {/* Game Viewer Modal */}
      {selectedGame && <GameViewerModal isOpen={!!selectedGame} onClose={handleCloseModal} gameUrl={selectedGame.url} gameTitle={selectedGame.title} />}
    </div>;
}