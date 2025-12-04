import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CourseOverviewAccordionProps {
  title?: string;
  whyMasterContent: {
    title: string;
    description: string;
  };
  whatYouMasterContent: {
    title: string;
    objectives: Array<{
      title: string;
      description: string;
    }>;
  };
  className?: string;
}

export const CourseOverviewAccordion: React.FC<CourseOverviewAccordionProps> = ({
  title = "Course Overview & Learning Objectives",
  whyMasterContent,
  whatYouMasterContent,
  className = "bg-white/30 hover:bg-white/40 px-4 py-3 rounded-lg text-white border border-white/20"
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="course-overview">
        <AccordionTrigger className={`flex items-center justify-center text-center text-xl font-semibold ${className}`}>
          {title}
        </AccordionTrigger>
        <AccordionContent className="bg-white/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 mt-2">
          <div className="space-y-6 text-white">
            <div>
              <h3 className="text-lg font-semibold mb-3">{whyMasterContent.title}</h3>
              <p className="leading-relaxed text-white/90">
                {whyMasterContent.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">{whatYouMasterContent.title}</h3>
              <ul className="space-y-2">
                {whatYouMasterContent.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>{objective.title}:</strong> {objective.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};