import React, { useState } from 'react';
import { BookOpen, FileText, CheckCircle, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIChatInterface from './AIChatInterface';

interface EssayHelperProps {
  onBack: () => void;
}

const EssayHelper: React.FC<EssayHelperProps> = ({ onBack }) => {
  const [essayContent, setEssayContent] = useState('');

  const wordCount = essayContent.split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="h-full flex gap-6">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-500" />
              Essay Draft
            </h3>
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {wordCount} words
          </div>
        </div>
        <textarea
          value={essayContent}
          onChange={(e) => setEssayContent(e.target.value)}
          placeholder="Start typing your essay here..."
          className="flex-1 p-8 resize-none focus:outline-none text-foreground bg-background leading-relaxed text-lg font-serif placeholder:text-muted-foreground"
        />
      </div>

      {/* Sidebar Tools */}
      <div className="w-[400px] flex flex-col">
        <Tabs defaultValue="assistant" className="h-full flex flex-col">
          <div className="bg-card rounded-xl border border-border shadow-sm p-1 mb-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="assistant" className="flex gap-2">
                <BookOpen className="h-4 w-4" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex gap-2">
                <CheckCircle className="h-4 w-4" />
                Checklist
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="assistant" className="flex-1 mt-0 h-0">
            <AIChatInterface
              toolName="Essay Coach"
              systemPrompt="I am your essay writing coach. I can help you brainstorm ideas, structure your arguments, check for clarity, and improve your grammar. I will not write the essay for you, but I will help you make it better."
              onBack={() => {}}
              icon={BookOpen}
              accentColor="from-orange-500 to-red-600"
            />
          </TabsContent>

          <TabsContent value="checklist" className="flex-1 mt-0 bg-card rounded-xl border border-border shadow-sm p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-orange-500" />
                  Structure & Flow
                </h4>
                <div className="space-y-3">
                  {['Strong Thesis Statement', 'Clear Topic Sentences', 'Logical Transitions', 'Conclusion with Impact'].map((item, i) => (
                    <label key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border transition-all">
                      <input type="checkbox" className="mt-1 h-4 w-4 rounded border-border text-orange-600 focus:ring-orange-500" />
                      <span className="text-sm text-foreground">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Evidence & Analysis
                </h4>
                <div className="space-y-3">
                  {['Examples Support Claims', 'Sources Cited Correctly', 'Analysis Connects to Thesis', 'Counter-arguments Addressed'].map((item, i) => (
                    <label key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border transition-all">
                      <input type="checkbox" className="mt-1 h-4 w-4 rounded border-border text-green-600 focus:ring-green-500" />
                      <span className="text-sm text-foreground">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EssayHelper;
