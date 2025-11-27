import React from 'react';

interface ParagraphSectionProps {
  content: string;
}

export const ParagraphSection: React.FC<ParagraphSectionProps> = ({ content }) => {
  return (
    <p className="text-foreground leading-relaxed mb-4 max-w-prose">
      {content}
    </p>
  );
};
