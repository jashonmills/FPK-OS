import React from 'react';

interface HeadingSectionProps {
  content: string;
  level?: number;
}

export const HeadingSection: React.FC<HeadingSectionProps> = ({ content, level = 2 }) => {
  const getHeadingClass = (level: number) => {
    switch (level) {
      case 1:
        return 'text-3xl font-bold text-foreground mt-8 mb-4 border-b pb-2';
      case 2:
        return 'text-2xl font-bold text-foreground mt-6 mb-3 border-b pb-2';
      case 3:
        return 'text-xl font-semibold text-foreground mt-5 mb-2';
      case 4:
        return 'text-lg font-semibold text-foreground mt-4 mb-2';
      case 5:
        return 'text-base font-semibold text-foreground mt-3 mb-2';
      case 6:
        return 'text-sm font-semibold text-foreground mt-2 mb-1';
      default:
        return 'text-2xl font-bold text-foreground mt-6 mb-3 border-b pb-2';
    }
  };

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag className={getHeadingClass(level)}>
      {content}
    </HeadingTag>
  );
};
