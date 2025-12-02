import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import AIGovernanceRuleDialog, { AIRule } from './AIGovernanceRuleDialog';

const AIGovernanceRules: React.FC = () => {
  const [rules, setRules] = useState<AIRule[]>(() => {
    const saved = localStorage.getItem('aiRules');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Essay Writing Assistance', category: 'Academic', allowed: true, description: 'AI can help with essay structure and grammar', roles: ['teacher', 'student'] },
      { id: 2, name: 'Complete Code Generation', category: 'Technical', allowed: false, description: 'Full code generation is restricted', roles: ['student'] },
      { id: 3, name: 'Image Generation', category: 'Creative', allowed: true, description: 'AI image tools for creative projects', roles: ['teacher', 'student'] },
      { id: 4, name: 'Homework Solutions', category: 'Academic', allowed: false, description: 'Direct homework answers are blocked', roles: ['student'] },
      { id: 5, name: 'Research Assistance', category: 'Academic', allowed: true, description: 'AI for research and information gathering', roles: ['teacher', 'student'] },
    ];
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AIRule | null>(null);

  useEffect(() => {
    localStorage.setItem('aiRules', JSON.stringify(rules));
  }, [rules]);

  const toggleRule = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, allowed: !rule.allowed } : rule
    ));
    toast({
      title: "Rule Updated",
      description: "AI rule status has been changed successfully.",
    });
  };

  const deleteRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast({
      title: "Rule Deleted",
      description: "AI rule has been removed successfully.",
    });
  };

  const handleSaveRule = (rule: AIRule) => {
    if (editingRule) {
      setRules(rules.map(r => r.id === rule.id ? rule : r));
      toast({
        title: "Rule Updated",
        description: "AI rule has been updated successfully.",
      });
    } else {
      setRules([...rules, { ...rule, id: Date.now() }]);
      toast({
        title: "Rule Created",
        description: "New AI rule has been created successfully.",
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
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

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
                  {rule.roles.map(role => (
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
                  onClick={() => toggleRule(rule.id!)}
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
                  onClick={() => deleteRule(rule.id!)}
                  className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AIGovernanceRuleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rule={editingRule}
        onSave={handleSaveRule}
      />
    </div>
  );
};

export default AIGovernanceRules;
