import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FullScreenGamePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const gameUrl = searchParams.get('url');
  const gameTitle = searchParams.get('title');

  if (!gameUrl || !gameTitle) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Error: Game not found</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Header with Back button */}
      <header className="flex items-center gap-3 p-4 border-b bg-card shrink-0">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-bold truncate">{gameTitle}</h1>
      </header>

      {/* Iframe fills the rest of the screen */}
      <main className="flex-1 min-h-0">
        <iframe
          src={gameUrl}
          title={gameTitle}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </main>
    </div>
  );
}
