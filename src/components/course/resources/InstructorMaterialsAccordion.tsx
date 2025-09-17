import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileDown, Presentation, BookOpen, Eye, ChevronDown, CheckCircle, Target, Users, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InstructorResource {
  title: string;
  description: string;
  type: 'guide' | 'slides' | 'notes' | 'resource';
  downloadUrl?: string;
  content?: {
    sections?: Array<{
      title: string;
      items: Array<{
        title: string;
        description: string;
        details?: string[];
      }>;
    }>;
    rubrics?: Array<{
      title: string;
      criteria: Array<{
        criterion: string;
        excellent: string;
        proficient: string;
        developing: string;
        inadequate: string;
      }>;
    }>;
  };
}

interface InstructorMaterialsAccordionProps {
  resources: InstructorResource[];
  resourceCount?: number;
}

export const InstructorMaterialsAccordion: React.FC<InstructorMaterialsAccordionProps> = ({
  resources,
  resourceCount
}) => {
  const [expandedResource, setExpandedResource] = useState<number | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'slides': return <Presentation className="w-4 h-4" />;
      case 'guide': return <BookOpen className="w-4 h-4" />;
      default: return <FileDown className="w-4 h-4" />;
    }
  };

  const displayCount = resourceCount || resources.length;

  const renderGuideContent = (content: any) => (
    <div className="space-y-6">
      {content.sections?.map((section: any, sectionIndex: number) => (
        <div key={sectionIndex} className="bg-white/5 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            {section.title}
          </h4>
          <div className="space-y-4">
            {section.items.map((item: any, itemIndex: number) => (
              <div key={itemIndex} className="bg-white/5 rounded-lg p-4">
                <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {item.title}
                </h5>
                <p className="text-white/80 mb-3">{item.description}</p>
                {item.details && (
                  <ul className="space-y-1 text-sm text-white/70">
                    {item.details.map((detail: string, detailIndex: number) => (
                      <li key={detailIndex} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderRubricsContent = (content: any) => (
    <div className="space-y-6">
      {content.rubrics?.map((rubric: any, rubricIndex: number) => (
        <div key={rubricIndex} className="bg-white/5 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            {rubric.title}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-3 text-white font-semibold">Criteria</th>
                  <th className="text-left p-3 text-green-300 font-semibold">Excellent (4)</th>
                  <th className="text-left p-3 text-blue-300 font-semibold">Proficient (3)</th>
                  <th className="text-left p-3 text-yellow-300 font-semibold">Developing (2)</th>
                  <th className="text-left p-3 text-red-300 font-semibold">Inadequate (1)</th>
                </tr>
              </thead>
              <tbody>
                {rubric.criteria.map((criterion: any, criterionIndex: number) => (
                  <tr key={criterionIndex} className="border-b border-white/10">
                    <td className="p-3 text-white font-medium">{criterion.criterion}</td>
                    <td className="p-3 text-white/80">{criterion.excellent}</td>
                    <td className="p-3 text-white/80">{criterion.proficient}</td>
                    <td className="p-3 text-white/80">{criterion.developing}</td>
                    <td className="p-3 text-white/80">{criterion.inadequate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="instructor-materials">
        <AccordionTrigger className="flex items-center justify-center text-center text-lg font-semibold bg-white/30 hover:bg-white/40 px-4 py-3 rounded-lg text-white border border-white/20">
          Instructor Materials ({displayCount} Resources)
        </AccordionTrigger>
        <AccordionContent className="bg-white/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 mt-2">
          <p className="text-center text-white/90 mb-6 font-medium">
            Additional teaching resources and materials for instructors and advanced learners.
          </p>
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedResource(expandedResource === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-amber-400 mt-1">
                        {getIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{resource.title}</h4>
                        <p className="text-sm text-white/80">{resource.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="text-xs bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Eye className="w-3 h-3 mr-1" />
                        View Content
                      </Button>
                      <ChevronDown 
                        className={`w-4 h-4 text-white/60 transition-transform ${
                          expandedResource === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </div>
                
                {expandedResource === index && resource.content && (
                  <div className="border-t border-white/20 p-4 bg-white/5">
                    {resource.type === 'guide' && resource.content.sections && renderGuideContent(resource.content)}
                    {resource.type === 'resource' && resource.content.rubrics && renderRubricsContent(resource.content)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};