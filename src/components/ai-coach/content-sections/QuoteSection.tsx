import React from 'react';

interface QuoteSectionProps {
  content: string;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ content }) => {
  return (
    <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground bg-muted/30 rounded-r">
      {content}
    </blockquote>
  );
};
