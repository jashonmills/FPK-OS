import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const AppBackground = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadBackgroundImage();
  }, []);

  const loadBackgroundImage = async () => {
    try {
      // Try to get existing background from storage
      const { data } = supabase.storage
        .from('app-assets')
        .getPublicUrl('neurodiversity-bg.webp');

      if (data?.publicUrl) {
        // Check if image actually exists
        const response = await fetch(data.publicUrl, { method: 'HEAD' });
        if (response.ok) {
          setImageUrl(data.publicUrl);
          return;
        }
      }

      // If image doesn't exist, generate it
      console.log('Background image not found, generating...');
      await generateBackground();
    } catch (error) {
      console.error('Error loading background:', error);
    }
  };

  const generateBackground = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-neurodiversity-background');
      
      if (error) throw error;
      
      if (data?.url) {
        setImageUrl(data.url);
        console.log('Background generated successfully');
      }
    } catch (error) {
      console.error('Error generating background:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!imageUrl && !isGenerating) {
    return (
      <>
        {/* Fallback gradient background */}
        <div className="fixed inset-0 -z-50 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5" />
        <div className="fixed inset-0 -z-40 bg-gradient-to-tr from-background/80 via-background/60 to-background/80" />
      </>
    );
  }

  if (isGenerating) {
    return (
      <div className="fixed inset-0 -z-50 bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 animate-pulse" />
    );
  }

  return (
    <>
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 -z-50 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          filter: 'brightness(0.85) blur(0px)'
        }}
      />
      
      {/* Overlay for readability */}
      <div className="fixed inset-0 -z-40 bg-gradient-to-br from-background/50 via-background/30 to-background/50" />
    </>
  );
};
