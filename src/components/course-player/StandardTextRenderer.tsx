/**
 * Standard Text Renderer Component
 * 
 * Universal text rendering component for the Lesson Engine.
 * Renders structured text content with consistent styling.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextSection } from '@/types/lessonContent';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Lightbulb, 
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

const CodeBlockRenderer: React.FC<{ content: string; language?: string }> = ({ content, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mb-4">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
        <code className={`text-sm font-mono ${language ? `language-${language}` : ''}`}>
          {content}
        </code>
      </pre>
    </div>
  );
};

const QuizRenderer: React.FC<{ section: any }> = ({ section }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option: string) => {
    setSelectedAnswer(option);
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === section.correctAnswer;

  return (
    <div className="mb-6 p-4 border rounded-lg bg-card">
      <h4 className="font-semibold mb-3 text-lg">{section.question}</h4>
      <div className="space-y-2">
        {section.options.map((option: string, idx: number) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === section.correctAnswer;
          
          return (
            <button
              key={idx}
              onClick={() => !showResult && handleAnswer(option)}
              disabled={showResult}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                !showResult
                  ? 'hover:bg-muted cursor-pointer'
                  : isCorrectOption
                  ? 'bg-green-50 border-green-400 dark:bg-green-950/30'
                  : isSelected
                  ? 'bg-red-50 border-red-400 dark:bg-red-950/30'
                  : 'opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                {showResult && isCorrectOption && <CheckCircle className="h-5 w-5 text-green-600" />}
                {showResult && isSelected && !isCorrectOption && <AlertCircle className="h-5 w-5 text-red-600" />}
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>
      {showResult && section.explanation && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm">{section.explanation}</p>
        </div>
      )}
    </div>
  );
};

const renderSection = (section: TextSection, index: number) => {
  if (section.type === 'code') {
    return <CodeBlockRenderer key={index} content={section.content} language={section.language} />;
  }
  
  if (section.type === 'quiz') {
    return <QuizRenderer key={index} section={section} />;
  }

  if (section.type === 'image') {
    const imageSection = section as Extract<TextSection, { type: 'image' }>;
    const imageSrc = imageSection.src.startsWith('http') 
      ? imageSection.src 
      : `https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public${imageSection.src}`;
    
    return (
      <figure key={index} className="my-6">
        <img 
          src={imageSrc} 
          alt={imageSection.alt}
          className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
          style={{
            maxWidth: imageSection.width || '400px',
            height: imageSection.height || 'auto'
          }}
        />
        {imageSection.caption && (
          <figcaption className="text-sm text-muted-foreground text-center mt-2 italic">
            {imageSection.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  
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
      return (
        <div key={index} className="mb-4 leading-relaxed prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              code: ({ inline, children, ...props }: any) => 
                inline ? (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                ) : (
                  <code {...props}>{children}</code>
                ),
            }}
          >
            {section.content}
          </ReactMarkdown>
        </div>
      );
    
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
      return null;
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
