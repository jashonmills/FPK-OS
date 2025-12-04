import React from 'react';

interface AdditionalResourcesSectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const AdditionalResourcesSection: React.FC<AdditionalResourcesSectionProps> = ({
  children,
  title = "Study Materials & Resources",
  className = "max-w-6xl mx-auto mb-8"
}) => {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};