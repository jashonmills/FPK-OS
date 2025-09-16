import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StudentGuideGallery } from '@/components/course/StudentGuideGallery';

interface StudentGuidesAccordionProps {
  guideCount?: number;
  description?: string;
  showGallery?: boolean;
}

export const StudentGuidesAccordion: React.FC<StudentGuidesAccordionProps> = ({
  guideCount = 21,
  description = "Explore our comprehensive collection of student guides organized by module. Click any image to view in detail or open in a new tab.",
  showGallery = true
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="student-guides">
        <AccordionTrigger className="flex items-center justify-center text-center text-lg font-semibold bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-4 py-3 rounded-lg text-blue-900 dark:text-blue-100">
          Student Guides Collection ({guideCount} Resources)
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <p className="text-center text-white mb-6 font-medium">
            {description}
          </p>
          {showGallery && <StudentGuideGallery />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};