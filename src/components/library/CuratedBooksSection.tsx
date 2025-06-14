
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAccessibility } from '@/hooks/useAccessibility';
import BookCard from './BookCard';
import { Book, CuratedBook } from '@/types/library';

interface CuratedBooksSectionProps {
  onBookSelect: (book: Book) => void;
}

const curatedBooks: CuratedBook[] = [
  {
    title: "Thinking in Pictures",
    author: "Temple Grandin",
    workKey: "/works/OL45883W",
    description: "A groundbreaking work that offers insights into autism and visual thinking"
  },
  {
    title: "The Reason I Jump",
    author: "Naoki Higashida",
    workKey: "/works/OL14346775W",
    description: "A thirteen-year-old boy with autism answers questions about his condition"
  },
  {
    title: "All Cats Have Asperger Syndrome",
    author: "Kathy Hoopmann",
    workKey: "/works/OL338170W",
    description: "A delightful book that uses cat behavior to explain Asperger Syndrome"
  },
  {
    title: "Different Like Me",
    author: "Jenifer Calvin",
    workKey: "/works/OL7846811W",
    description: "Stories of famous people who were different and how they succeeded"
  },
  {
    title: "Freaks, Geeks, and Asperger Syndrome",
    author: "Luke Jackson",
    workKey: "/works/OL5602916W",
    description: "A teenager's guide to life with Asperger Syndrome"
  },
  {
    title: "The Survival Guide for Kids with Autism Spectrum Disorder",
    author: "Elizabeth Verdick",
    workKey: "/works/OL23031103W",
    description: "A practical guide to help kids understand and thrive with autism"
  }
];

const CuratedBooksSection: React.FC<CuratedBooksSectionProps> = ({ onBookSelect }) => {
  const { getAccessibilityClasses } = useAccessibility();

  const handleBookClick = (curatedBook: CuratedBook) => {
    const book: Book = {
      key: curatedBook.workKey,
      title: curatedBook.title,
      author_name: [curatedBook.author],
      workKey: curatedBook.workKey,
      description: curatedBook.description,
      isCurated: true
    };
    onBookSelect(book);
  };

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className={`text-2xl font-semibold mb-2 ${getAccessibilityClasses('text')}`}>
          Curated Picks for Grades 6–12
        </h2>
        <p className={`text-muted-foreground ${getAccessibilityClasses('text')}`}>
          Hand-selected books that celebrate neurodiversity and promote understanding
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {curatedBooks.map((book) => (
          <Card 
            key={book.workKey}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
            onClick={() => handleBookClick(book)}
          >
            <CardContent className="p-4">
              <BookCard
                title={book.title}
                author={book.author}
                workKey={book.workKey}
                isCurated={true}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CuratedBooksSection;
