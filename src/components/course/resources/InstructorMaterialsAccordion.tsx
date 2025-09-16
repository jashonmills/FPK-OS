import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileDown, Presentation, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InstructorResource {
  title: string;
  description: string;
  type: 'guide' | 'slides' | 'notes' | 'resource';
  downloadUrl?: string;
}

interface InstructorMaterialsAccordionProps {
  resources: InstructorResource[];
  resourceCount?: number;
}

export const InstructorMaterialsAccordion: React.FC<InstructorMaterialsAccordionProps> = ({
  resources,
  resourceCount
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'slides': return <Presentation className="w-4 h-4" />;
      case 'guide': return <BookOpen className="w-4 h-4" />;
      default: return <FileDown className="w-4 h-4" />;
    }
  };

  const displayCount = resourceCount || resources.length;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="instructor-materials">
        <AccordionTrigger className="flex items-center justify-center text-center text-lg font-semibold bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-4 py-3 rounded-lg text-amber-900 dark:text-amber-100">
          Instructor Materials ({displayCount} Resources)
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <p className="text-center text-white mb-6 font-medium">
            Additional teaching resources and materials for instructors and advanced learners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-amber-400 mt-1">
                    {getIcon(resource.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">{resource.title}</h4>
                    <p className="text-sm text-white/80 mb-3">{resource.description}</p>
                    {resource.downloadUrl && (
                      <Button size="sm" variant="outline" className="text-xs">
                        <FileDown className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};