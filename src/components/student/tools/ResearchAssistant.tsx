import React, { useState } from 'react';
import { Sparkles, Search, Book, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIChatInterface from './AIChatInterface';

interface ResearchAssistantProps {
  onBack: () => void;
}

interface SearchResult {
  title: string;
  source: string;
  date: string;
  snippet: string;
}

const ResearchAssistant: React.FC<ResearchAssistantProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setResults([
        { title: `Understanding ${searchQuery}: A Comprehensive Guide`, source: 'Academic Journal', date: '2024', snippet: 'This paper explores the fundamental concepts of...' },
        { title: `The History and Future of ${searchQuery}`, source: 'Digital Library', date: '2023', snippet: 'Tracing the evolution from early beginnings to modern day applications...' },
        { title: `Key Statistical Analysis in ${searchQuery}`, source: 'Research Database', date: '2024', snippet: 'A data-driven approach to understanding the impact of...' },
      ]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="h-full flex gap-6">
      <div className="flex-1 flex flex-col gap-6">
        {/* Search Section */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
            <h2 className="text-xl font-bold text-foreground">Research Assistant</h2>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your research topic..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button type="submit" disabled={isSearching} className="bg-purple-600 hover:bg-purple-700 h-auto px-6 rounded-xl">
              {isSearching ? 'Searching...' : 'Find Sources'}
            </Button>
          </form>

          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((result, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-purple-600 dark:text-purple-400 group-hover:underline">{result.title}</h3>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Book className="h-3 w-3" /> {result.source}</span>
                    <span>•</span>
                    <span>{result.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.snippet}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Book className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Enter a topic to find academic sources and papers</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-[400px]">
        <AIChatInterface
          toolName="Research Summarizer"
          systemPrompt="I am your research assistant. I can help you summarize complex papers, extract key arguments, and format citations. Paste text from your sources here."
          onBack={() => {}} 
          icon={Sparkles}
          accentColor="from-violet-500 to-purple-600"
        />
      </div>
    </div>
  );
};

export default ResearchAssistant;
