import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, ArrowRight, Check, Loader2, ChevronDown, GraduationCap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToolModelAssignments } from '@/hooks/useToolModelAssignments';
import { useAIGovernanceModels } from '@/hooks/useAIGovernanceModels';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AITool {
  id: string;
  display_name: string;
  description: string | null;
  icon_name: string | null;
  is_active: boolean;
}

const STUDENT_TOOL_IDS = ['personal-tutor', 'math-solver', 'essay-helper', 'code-companion', 'language-practice', 'research-assistant'];
const TEACHER_TOOL_IDS = ['lesson-plan', 'quiz', 'rubric', 'course-outline', 'grade-feedback', 'performance-insights'];

const AIGovernanceToolMapping: React.FC = () => {
  const { assignments, isLoading: assignmentsLoading, updateAssignment } = useToolModelAssignments();
  const { models, isLoading: modelsLoading } = useAIGovernanceModels();
  const [pendingUpdate, setPendingUpdate] = useState<string | null>(null);

  // Fetch all AI tools
  const { data: tools, isLoading: toolsLoading } = useQuery({
    queryKey: ['ai-tools-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('id, display_name, description, icon_name, is_active')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as AITool[];
    },
  });

  const isLoading = assignmentsLoading || modelsLoading || toolsLoading;

  const getAssignedModel = (toolId: string) => {
    const assignment = assignments.find(a => a.tool_id === toolId && !a.org_id);
    if (assignment && assignment.model) {
      return assignment.model;
    }
    return null;
  };

  const handleAssignModel = async (toolId: string, modelConfigId: string) => {
    setPendingUpdate(toolId);
    try {
      await updateAssignment.mutateAsync({
        toolId,
        modelConfigId,
        orgId: null, // Global assignment
      });
    } finally {
      setPendingUpdate(null);
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'OpenAI': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Anthropic': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Google': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const renderToolSection = (title: string, icon: React.ReactNode, toolIds: string[], colorClass: string) => {
    const sectionTools = tools?.filter(t => toolIds.includes(t.id)) || [];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <Badge variant="secondary">{sectionTools.length} tools</Badge>
        </div>
        
        <div className="grid gap-3">
          {sectionTools.map((tool, index) => {
            const assignedModel = getAssignedModel(tool.id);
            const isPending = pendingUpdate === tool.id;
            
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{tool.display_name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {tool.description || 'No description'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="min-w-[200px] justify-between"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : assignedModel ? (
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-xs ${getProviderColor(assignedModel.provider)}`}>
                              {assignedModel.provider}
                            </span>
                            <span className="truncate">{assignedModel.model_name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Select model...</span>
                        )}
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[250px]">
                      {models.filter(m => m.is_active && m.model_type === 'text').map(model => (
                        <DropdownMenuItem
                          key={model.id}
                          onClick={() => handleAssignModel(tool.id, model.id)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-xs ${getProviderColor(model.provider)}`}>
                              {model.provider}
                            </span>
                            <span>{model.model_name}</span>
                          </div>
                          {assignedModel?.id === model.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tool → Model Mapping</h2>
        <p className="text-muted-foreground mt-1">
          Assign which AI model powers each tool. These are global defaults; organizations can override for their own usage.
        </p>
      </div>

      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Wrench className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">How it works</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Each tool routes through the Unified AI Gateway, which checks this mapping to determine which model to use.
              When you change a model here, all future requests from that tool will use the new model.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {renderToolSection(
          'Student AI Tools',
          <GraduationCap className="h-5 w-5 text-blue-600" />,
          STUDENT_TOOL_IDS,
          'bg-blue-100 dark:bg-blue-900/30'
        )}
        
        {renderToolSection(
          'Teacher AI Tools',
          <BookOpen className="h-5 w-5 text-emerald-600" />,
          TEACHER_TOOL_IDS,
          'bg-emerald-100 dark:bg-emerald-900/30'
        )}
      </div>
    </div>
  );
};

export default AIGovernanceToolMapping;
