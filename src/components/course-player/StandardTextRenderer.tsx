/**
 * Standard Text Renderer Component
 * 
 * Universal text rendering component for the Lesson Engine.
 * Renders structured text content with consistent styling.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextSection } from '@/types/lessonContent';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Lightbulb, 
  AlertTriangle 
} from 'lucide-react';

interface StandardTextRendererProps {
  sections: TextSection[];
  showCard?: boolean;
}

const CalloutIcon: React.FC<{ style?: string }> = ({ style }) => {
  const iconClass = "h-5 w-5 flex-shrink-0";
  
  switch (style) {
    case 'info':
      return <Info className={iconClass} />;
    case 'success':
      return <CheckCircle className={iconClass} />;
    case 'warning':
      return <AlertTriangle className={iconClass} />;
    case 'error':
      return <AlertCircle className={iconClass} />;
    case 'teaching':
      return <Lightbulb className={iconClass} />;
    default:
      return <Info className={iconClass} />;
  }
};

const getCalloutStyles = (style?: string) => {
  const baseStyles = "p-4 rounded-lg border-l-4";
  
  switch (style) {
    case 'info':
      return `${baseStyles} bg-blue-50 border-blue-400`;
    case 'success':
      return `${baseStyles} bg-green-50 border-green-400`;
    case 'warning':
      return `${baseStyles} bg-yellow-50 border-yellow-400`;
    case 'error':
      return `${baseStyles} bg-red-50 border-red-400`;
    case 'teaching':
      return `${baseStyles} bg-purple-50 border-purple-400`;
    default:
      return `${baseStyles} bg-blue-50 border-blue-400`;
  }
};

const getCalloutTextColor = (style?: string) => {
  switch (style) {
    case 'info':
      return 'text-blue-800';
    case 'success':
      return 'text-green-800';
    case 'warning':
      return 'text-yellow-800';
    case 'error':
      return 'text-red-800';
    case 'teaching':
      return 'text-purple-800';
    default:
      return 'text-blue-800';
  }
};

const renderSection = (section: TextSection, index: number) => {
  switch (section.type) {
    case 'heading':
      const HeadingTag = `h${section.level || 2}` as keyof JSX.IntrinsicElements;
      const headingClass = section.level === 1 
        ? 'text-3xl font-bold mb-4' 
        : section.level === 2
        ? 'text-2xl font-semibold mb-3'
        : 'text-xl font-semibold mb-2';
      return <HeadingTag key={index} className={headingClass}>{section.content}</HeadingTag>;
    
    case 'paragraph':
      return <p key={index} className="mb-4 leading-relaxed">{section.content}</p>;
    
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-2 mb-4 ml-4">
          {section.items?.map((item, i) => (
            <li key={i} className="text-sm">{item}</li>
          ))}
        </ul>
      );
    
    case 'callout':
      return (
        <div key={index} className={`${getCalloutStyles(section.style)} mb-4`}>
          <div className="flex gap-3">
            <CalloutIcon style={section.style} />
            <div className="flex-1">
              <p className={`font-semibold ${getCalloutTextColor(section.style)} mb-1`}>
                {section.style === 'teaching' ? 'Teaching Moment:' : section.content.split('\n')[0]}
              </p>
              {section.style === 'teaching' && (
                <p className={getCalloutTextColor(section.style).replace('800', '700')}>
                  {section.content}
                </p>
              )}
              {section.items && section.items.length > 0 && (
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {section.items.map((item, i) => (
                    <li key={i} className={getCalloutTextColor(section.style).replace('800', '700')}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      );
    
    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-muted pl-4 italic my-4 text-muted-foreground">
          {section.content}
        </blockquote>
      );
    
    default:
      return <p key={index}>{section.content}</p>;
  }
};

export const StandardTextRenderer: React.FC<StandardTextRendererProps> = ({ 
  sections, 
  showCard = true 
}) => {
  const content = (
    <div className="space-y-4">
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {content}
      </CardContent>
    </Card>
  );
};
