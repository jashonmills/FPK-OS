import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface RubricCreatorProps {
  onBack: () => void;
}

interface Criterion {
  name: string;
  weight: number;
}

const RubricCreator: React.FC<RubricCreatorProps> = ({ onBack }) => {
  const [criteria, setCriteria] = useState<Criterion[]>([
    { name: 'Content & Accuracy', weight: 40 },
    { name: 'Organization', weight: 30 },
    { name: 'Grammar & Mechanics', weight: 30 }
  ]);

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center bg-muted/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Rubric Creator</h2>
            <p className="text-sm text-muted-foreground">Design grading criteria for assignments</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">Load Template</Button>
           <Button className="bg-orange-600 hover:bg-orange-700">Generate with AI</Button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Label className="text-lg mb-2 block">Assignment Title</Label>
            <Input 
              className="text-lg"
              placeholder="e.g., Persuasive Essay Final Draft"
            />
          </div>

          <div className="border border-border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 font-semibold text-foreground w-1/4">Criteria</th>
                  <th className="p-4 font-semibold text-foreground w-1/6">Weight (%)</th>
                  <th className="p-4 font-semibold text-foreground">Description Levels (Excellent - Good - Fair - Poor)</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {criteria.map((c, idx) => (
                  <tr key={idx} className="bg-card">
                    <td className="p-4 align-top">
                      <Input 
                        value={c.name} 
                        onChange={(e) => {
                          const newCriteria = [...criteria];
                          newCriteria[idx].name = e.target.value;
                          setCriteria(newCriteria);
                        }}
                        className="font-medium" 
                      />
                    </td>
                    <td className="p-4 align-top">
                      <div className="relative">
                        <Input 
                          type="number"
                          value={c.weight}
                          onChange={(e) => {
                            const newCriteria = [...criteria];
                            newCriteria[idx].weight = parseInt(e.target.value) || 0;
                            setCriteria(newCriteria);
                          }}
                          className="pr-6"
                        />
                        <span className="absolute right-3 top-2 text-muted-foreground">%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <div className="p-2 bg-green-500/10 rounded border border-green-500/20">Exceptional mastery of the topic...</div>
                        <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">Good understanding with minor gaps...</div>
                        <div className="p-2 bg-yellow-500/10 rounded border border-yellow-500/20">Basic understanding shown...</div>
                        <div className="p-2 bg-red-500/10 rounded border border-red-500/20">Lacks understanding of key concepts...</div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <button 
                        onClick={() => setCriteria(criteria.filter((_, i) => i !== idx))}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-muted/50 border-t border-border">
              <Button 
                variant="ghost" 
                onClick={() => setCriteria([...criteria, { name: 'New Criteria', weight: 10 }])}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-500/10"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Criteria
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RubricCreator;
