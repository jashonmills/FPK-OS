
import React from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlProps {
  html: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

const SafeHtml: React.FC<SafeHtmlProps> = ({ 
  html, 
  className = '',
  allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a', 'span'],
  allowedAttributes = ['href', 'target', 'class']
}) => {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOW_DATA_ATTR: false,
  });

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

// For cases where we just need plain text (most secure)
export const SafeText: React.FC<{ text: string; className?: string }> = ({ 
  text, 
  className = '' 
}) => {
  return <span className={className}>{text}</span>;
};

export default SafeHtml;
