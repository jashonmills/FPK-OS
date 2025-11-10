import React from 'react';
import { TextSection } from '@/types/lessonContent';
import { HeadingSection } from './content-sections/HeadingSection';
import { ParagraphSection } from './content-sections/ParagraphSection';
import { ListSection } from './content-sections/ListSection';
import { CalloutSection } from './content-sections/CalloutSection';
import { QuoteSection } from './content-sections/QuoteSection';
import { CodeSection } from './content-sections/CodeSection';
import { QuizSection } from './content-sections/QuizSection';
import { ImageSection } from './content-sections/ImageSection';

interface CourseContentRendererProps {
  sections: TextSection[];
  lessonTitle?: string;
  lessonDescription?: string;
}

export const CourseContentRenderer: React.FC<CourseContentRendererProps> = ({ 
  sections, 
  lessonTitle, 
  lessonDescription 
}) => {
  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No content available for this lesson.</p>
      </div>
    );
  }

  const renderSection = (section: TextSection, index: number) => {
    switch (section.type) {
      case 'heading':
        return <HeadingSection key={index} content={section.content} level={section.level} />;
      
      case 'paragraph':
        return <ParagraphSection key={index} content={section.content} />;
      
      case 'list':
        return <ListSection key={index} items={section.items || []} />;
      
      case 'callout':
        return <CalloutSection key={index} content={section.content} style={section.style} />;
      
      case 'quote':
        return <QuoteSection key={index} content={section.content} />;
      
      case 'code':
        return <CodeSection key={index} content={section.content} language={section.language} />;
      
      case 'quiz':
        return (
          <QuizSection 
            key={index} 
            question={section.question} 
            options={section.options} 
            correctAnswer={section.correctAnswer}
            explanation={section.explanation}
          />
        );
      
      case 'image':
        return (
          <ImageSection 
            key={index} 
            src={section.src} 
            alt={section.alt} 
            caption={section.caption}
            width={section.width}
            height={section.height}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="course-content-renderer space-y-4">
      {lessonTitle && (
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{lessonTitle}</h1>
          {lessonDescription && (
            <p className="text-muted-foreground">{lessonDescription}</p>
          )}
        </div>
      )}
      
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  );
};
