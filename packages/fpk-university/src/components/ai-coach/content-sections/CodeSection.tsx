import React from 'react';

interface CodeSectionProps {
  content: string;
  language?: string;
}

export const CodeSection: React.FC<CodeSectionProps> = ({ content, language }) => {
  return (
    <div className="my-4">
      {language && (
        <div className="bg-muted px-4 py-2 text-xs text-muted-foreground font-mono rounded-t border border-b-0">
          {language}
        </div>
      )}
      <pre className={`bg-muted p-4 rounded ${language ? 'rounded-t-none' : ''} border overflow-x-auto`}>
        <code className="text-sm font-mono text-foreground">
          {content}
        </code>
      </pre>
    </div>
  );
};
