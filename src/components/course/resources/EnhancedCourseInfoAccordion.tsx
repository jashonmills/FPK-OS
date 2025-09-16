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
  className = "bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-900/40 px-4 py-3 rounded-lg text-green-900 dark:text-green-100"
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
        <AccordionContent className="prose prose-gray max-w-none text-sm relative">
          <div className="space-y-6 pr-12">
            <div>
              <h3 className="text-lg font-semibold mb-3">Introduction</h3>
              <p className="text-white leading-relaxed">
                {introduction}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Course Features</h3>
              <ul className="space-y-2 text-white">
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
              <p className="text-white mb-3">The course consists of {modules.length} modules, each building upon the previous ones to develop comprehensive understanding:</p>
              <ol className="space-y-1 text-white">
                {modules.map((module) => (
                  <li key={module.number} className="flex gap-3">
                    <span className="font-medium text-foreground">{module.number}.</span> 
                    {module.title}: {module.description}
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