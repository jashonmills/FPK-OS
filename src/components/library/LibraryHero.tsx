
import React from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { BookOpen } from 'lucide-react';

const LibraryHero = () => {
  const { getAccessibilityClasses } = useAccessibility();

  return (
    <div className={`text-center space-y-4 py-8 ${getAccessibilityClasses('container')}`}>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 fpk-gradient rounded-lg flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <h1 className={`text-4xl font-bold ${getAccessibilityClasses('text')}`}>
          Neurodiversity Library
        </h1>
      </div>
      <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${getAccessibilityClasses('text')}`}>
        Curated reads & full catalog search for grades 6–12. Discover books that celebrate 
        neurodiversity and explore millions of titles from the OpenLibrary collection.
      </p>
    </div>
  );
};

export default LibraryHero;
