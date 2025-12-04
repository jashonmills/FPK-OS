import React from 'react';

interface ListSectionProps {
  items: string[];
}

export const ListSection: React.FC<ListSectionProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <ul className="list-disc list-inside space-y-2 mb-4 text-foreground max-w-prose">
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed pl-2">
          {item}
        </li>
      ))}
    </ul>
  );
};
