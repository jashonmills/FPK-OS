import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseBuilderProps {
  onBack: () => void;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border shadow-sm">
      <div className="p-6 border-b border-border flex justify-between items-center">
         <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
            <h2 className="text-xl font-bold text-foreground">Course Builder</h2>
         </div>
         <Button className="bg-primary">
           <PlusCircle className="h-4 w-4 mr-2" /> New Unit
         </Button>
      </div>
      
      <div className="flex-1 p-8 bg-muted/30 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
           {/* Unit 1 */}
           <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
              <div className="p-4 bg-primary/10 border-b border-primary/20 flex justify-between items-center">
                 <h3 className="font-bold text-primary">Unit 1: Introduction to AI</h3>
                 <span className="text-xs font-medium text-primary bg-card px-2 py-1 rounded border border-primary/20">2 Weeks</span>
              </div>
              <div className="p-4 space-y-3">
                 {['History of Artificial Intelligence', 'Types of Machine Learning', 'Ethics in AI'].map((lesson, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-border rounded hover:bg-muted/50 cursor-pointer">
                       <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium text-sm">{i + 1}</div>
                       <span className="text-foreground font-medium">{lesson}</span>
                    </div>
                 ))}
                 <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary">
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Lesson
                 </Button>
              </div>
           </div>

           {/* Unit 2 */}
           <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden opacity-75">
              <div className="p-4 bg-muted/50 border-b border-border flex justify-between items-center">
                 <h3 className="font-bold text-muted-foreground">Unit 2: Neural Networks</h3>
                 <span className="text-xs font-medium text-muted-foreground bg-card px-2 py-1 rounded border border-border">3 Weeks</span>
              </div>
              <div className="p-4 text-center py-8">
                 <p className="text-muted-foreground text-sm">Use AI to generate curriculum for this unit</p>
                 <Button variant="outline" className="mt-2">Generate Structure</Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;
