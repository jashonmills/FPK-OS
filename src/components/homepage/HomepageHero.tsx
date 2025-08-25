import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const HomepageHero = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateBackground();
  }, []);

  const generateBackground = async () => {
    try {
      console.log('Generating homepage background...');
      const { data, error } = await supabase.functions.invoke('generate-homepage-background');
      
      if (error) {
        console.log('Background generation failed, using fallback gradient');
        setIsLoading(false);
        return;
      }
      
      if (data?.imageUrl) {
        setBackgroundImage(data.imageUrl);
        console.log('Background generated:', data.imageUrl);
      }
    } catch (error) {
      console.log('Background generation failed, using fallback gradient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-orange-500 bg-cover bg-center bg-no-repeat ${isLoading ? 'animate-pulse' : ''}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Main Hero Content */}
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-white/35 mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            FPK University
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Unlocking Creativity, Confidence, and Visual Learning for Neurodiverse Students
          </p>
          <p className="text-lg text-slate-600 mb-10 max-w-3xl mx-auto">
            Learning doesn't have to be frustrating. At FPK University, we believe every learner deserves tools that match their strengths. Our platform combines cutting-edge neuroscience, interactive games, and empowering strategies to transform education into an exciting journey.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-fpk-orange hover:bg-fpk-orange/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link to="/dashboard/learner">Enter Learning Portal</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-2 border-fpk-purple text-fpk-purple hover:bg-fpk-purple hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              <Link to="/courses">View Courses</Link>
            </Button>
            <Button 
              asChild 
              variant="secondary" 
              size="lg"
              className="bg-fpk-purple/10 text-fpk-purple hover:bg-fpk-purple hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              <Link to="/login">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageHero;