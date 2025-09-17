import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CourseFeature {
  title: string;
  description: string;
}

interface CourseModule {
  number: number;
  title: string;
  description: string;
}

interface EnhancedCourseInfoAccordionProps {
  title?: string;
  introduction: string;
  features: CourseFeature[];
  modules: CourseModule[];
  accordionOpen?: string | undefined;
  onAccordionChange?: (value: string | undefined) => void;
  className?: string;
}

export const EnhancedCourseInfoAccordion: React.FC<EnhancedCourseInfoAccordionProps> = ({
  title = "Enhanced Comprehensive Course",
  introduction,
  features,
  modules,
  accordionOpen,
  onAccordionChange,
  className = "bg-white/30 hover:bg-white/40 px-4 py-3 rounded-lg text-white border border-white/20"
}) => {
  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full space-y-4"
      value={accordionOpen}
      onValueChange={onAccordionChange}
    >
      <AccordionItem value="enhanced-course-info">
        <AccordionTrigger className={`flex items-center justify-center text-center text-xl font-semibold ${className}`}>
          {title}
        </AccordionTrigger>
        <AccordionContent className="bg-white/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 mt-2">
          <div className="space-y-6 text-white">
            <div>
              <h3 className="text-lg font-semibold mb-3">Introduction</h3>
              <p className="text-white/90 leading-relaxed">
                {introduction}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Course Features</h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>{feature.title}:</strong> {feature.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Course Structure</h3>
              <p className="text-white/90 mb-3">The course consists of {modules.length} modules, each building upon the previous ones to develop comprehensive understanding:</p>
              <ol className="space-y-1">
                {modules.map((module) => (
                  <li key={module.number} className="flex gap-3">
                    <span className="font-medium text-white">{module.number}.</span> 
                    <span><strong>{module.title}:</strong> {module.description}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};