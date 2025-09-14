import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Image, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VisualAidProps {
  visualType: string;
  lessonId?: string;
  context?: string;
  title: string;
  description?: string;
}

export const VisualAid: React.FC<VisualAidProps> = ({ 
  visualType, 
  lessonId, 
  context, 
  title, 
  description 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateVisual = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-course-visuals', {
        body: {
          visualType,
          lessonId,
          context
        }
      });

      if (error) {
        throw error;
      }

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        setHasGenerated(true);
        toast.success('Visual aid generated successfully!');
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating visual aid:', error);
      toast.error('Failed to generate visual aid. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Button
          onClick={generateVisual}
          disabled={isGenerating}
          variant={hasGenerated ? "outline" : "default"}
          size="sm"
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : hasGenerated ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </>
          ) : (
            <>
              <Image className="h-4 w-4" />
              Generate Visual
            </>
          )}
        </Button>
      </div>

      {imageUrl && (
        <div className="mt-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full max-w-2xl mx-auto rounded-lg border border-border shadow-sm"
            loading="lazy"
          />
        </div>
      )}

      {!imageUrl && !isGenerating && !hasGenerated && (
        <div className="bg-muted/50 rounded-lg border-2 border-dashed border-border p-8 text-center">
          <Image className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">
            Click "Generate Visual" to create an AI-powered learning aid for this concept
          </p>
        </div>
      )}
    </div>
  );
};