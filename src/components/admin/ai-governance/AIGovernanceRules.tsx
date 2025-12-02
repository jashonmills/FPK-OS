import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIGovernanceRules, AIGovernanceRule } from '@/hooks/useAIGovernanceRules';
import AIGovernanceRuleDialog from './AIGovernanceRuleDialog';
import { supabase } from '@/integrations/supabase/client';

const AIGovernanceRules: React.FC = () => {
  const { rules, isLoading, createRule, updateRule, deleteRule, toggleRule } = useAIGovernanceRules();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AIGovernanceRule | null>(null);

  const handleToggleRule = (rule: AIGovernanceRule) => {
    toggleRule.mutate({ id: rule.id, allowed: !rule.allowed });
  };

  const handleDeleteRule = (id: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      deleteRule.mutate(id);
    }
  };

  const handleSaveRule = async (ruleData: { name: string; category: string; description: string; allowed: boolean; roles: string[] }) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (editingRule) {
      updateRule.mutate({
        id: editingRule.id,
        updates: {
          name: ruleData.name,
          category: ruleData.category as AIGovernanceRule['category'],
          description: ruleData.description,
          allowed: ruleData.allowed,
          applicable_roles: ruleData.roles,
        },
      });
    } else {
      createRule.mutate({
        name: ruleData.name,
        category: ruleData.category as AIGovernanceRule['category'],
        description: ruleData.description,
        allowed: ruleData.allowed,
        applicable_roles: ruleData.roles,
        org_id: null,
        created_by: user?.id ?? null,
      });
    }
    setEditingRule(null);
    setDialogOpen(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Academic': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Technical': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Creative': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      'Communication': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Usage Rules</h2>
          <p className="text-muted-foreground mt-1">Configure AI usage policies and restrictions</p>
        </div>
        <Button
          onClick={() => {
            setEditingRule(null);
            setDialogOpen(true);
          }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{rule.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(rule.category)}`}>
                    {rule.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${rule.allowed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {rule.allowed ? 'Allowed' : 'Blocked'}
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">{rule.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Applies to:</span>
                  {rule.applicable_roles.map(role => (
                    <span key={role} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs capitalize">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleRule(rule)}
                  disabled={toggleRule.isPending}
                  className="hover:bg-muted"
                >
                  {rule.allowed ? (
                    <ToggleRight className="h-6 w-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingRule(rule);
                    setDialogOpen(true);
                  }}
                  className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteRule(rule.id)}
                  disabled={deleteRule.isPending}
                  className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {rules.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No rules configured yet. Add your first rule to get started.</p>
          </div>
        )}
      </div>

      <AIGovernanceRuleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rule={editingRule ? {
          id: editingRule.id,
          name: editingRule.name,
          category: editingRule.category,
          description: editingRule.description || '',
          allowed: editingRule.allowed,
          roles: editingRule.applicable_roles,
        } : null}
        onSave={handleSaveRule}
      />
    </div>
  );
};

export default AIGovernanceRules;
