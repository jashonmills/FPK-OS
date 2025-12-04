import React from 'react';

interface RichTextSectionProps {
  content: Array<{
    type: 'subheading' | 'text';
    text: string;
  }>;
}

export const RichTextSection: React.FC<RichTextSectionProps> = ({ content }) => {
  if (!content || content.length === 0) return null;

  return (
    <div className="rich-text-section space-y-2 mb-4">
      {content.map((item, index) => {
        if (item.type === 'subheading') {
          return (
            <h4 key={index} className="font-semibold text-foreground mt-3 mb-1">
              {item.text}
            </h4>
          );
        }
        return (
          <p key={index} className="text-foreground leading-relaxed pl-4">
            {item.text}
          </p>
        );
      })}
    </div>
  );
};
