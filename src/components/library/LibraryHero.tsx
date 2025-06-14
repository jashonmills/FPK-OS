
import React from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { BookOpen } from 'lucide-react';

const LibraryHero = () => {
  const { getAccessibilityClasses } = useAccessibility();
  const { books, isLoading } = usePublicDomainBooks();

  const bookCount = books.length;
  const subjectCount = new Set(books.flatMap(book => book.subjects)).size;

  return (
    <div className={`text-center space-y-4 py-8 ${getAccessibilityClasses('container')}`}>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 fpk-gradient rounded-lg flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <h1 className={`text-4xl font-bold ${getAccessibilityClasses('text')}`}>
          Public Domain Library
        </h1>
      </div>
      <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${getAccessibilityClasses('text')}`}>
        {isLoading ? (
          "Loading our collection of educational books from Project Gutenberg..."
        ) : (
          `Discover ${bookCount} free educational books covering ${subjectCount} subjects, all focused on learning, neurodiversity, and personal growth from Project Gutenberg's open collection.`
        )}
      </p>
    </div>
  );
};

export default LibraryHero;
