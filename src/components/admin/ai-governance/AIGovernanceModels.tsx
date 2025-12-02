import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Save, Zap, Lock, Server, ToggleLeft, ToggleRight, Settings2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useAIGovernanceModels, AIGovernanceModelConfig } from '@/hooks/useAIGovernanceModels';

const AIGovernanceModels: React.FC = () => {
  const { models, isLoading, updateModelConfig, toggleModelActive } = useAIGovernanceModels();
  const [selectedModel, setSelectedModel] = useState<AIGovernanceModelConfig | null>(null);
  const [localConfig, setLocalConfig] = useState<{ temperature?: number; maxTokens?: number }>({});

  const handleToggleModel = (model: AIGovernanceModelConfig) => {
    toggleModelActive.mutate({ id: model.id, isActive: !model.is_active });
  };

  const handleConfigChange = (key: string, value: number) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveConfig = () => {
    if (!selectedModel) return;
    
    updateModelConfig.mutate({
      id: selectedModel.id,
      updates: {
        config: {
          ...selectedModel.config,
          ...localConfig,
        },
      },
    });
  };

  const getProviderColor = (provider: string) => {
    switch(provider) {
      case 'OpenAI': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Anthropic': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Meta': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
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
      <div>
        <h2 className="text-2xl font-bold text-foreground">AI Model Configuration</h2>
        <p className="text-muted-foreground mt-1">Manage available AI models and their parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-card rounded-xl border p-6 transition-all ${
                selectedModel?.id === model.id 
                  ? 'border-primary shadow-md ring-1 ring-primary' 
                  : 'border-border shadow-sm hover:border-muted-foreground/30'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-lg border border-border">
                    <Cpu className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{model.model_name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getProviderColor(model.provider)}`}>
                        {model.provider}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Type: {model.model_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleModel(model)}
                    disabled={toggleModelActive.isPending}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {model.is_active ? (
                      <div className="flex items-center text-green-600">
                        <span className="text-sm font-medium mr-2">Active</span>
                        <ToggleRight className="h-8 w-8" />
                      </div>
                    ) : (
                      <div className="flex items-center text-muted-foreground">
                        <span className="text-sm font-medium mr-2">Inactive</span>
                        <ToggleLeft className="h-8 w-8" />
                      </div>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (selectedModel?.id === model.id) {
                        setSelectedModel(null);
                        setLocalConfig({});
                      } else {
                        setSelectedModel(model);
                        setLocalConfig({
                          temperature: model.config.temperature,
                          maxTokens: model.config.maxTokens,
                        });
                      }
                    }}
                    className={selectedModel?.id === model.id ? 'bg-primary/10 border-primary text-primary' : ''}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {model.is_active && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Fast Response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Enterprise Grade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span>Hosted in US</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 sticky top-6">
            {selectedModel ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={selectedModel.id}
              >
                <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-foreground">Model Parameters</h3>
                </div>

                {selectedModel.model_type === 'text' ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Temperature</Label>
                        <span className="text-sm text-muted-foreground">
                          {localConfig.temperature ?? selectedModel.config.temperature ?? 0.7}
                        </span>
                      </div>
                      <Slider
                        value={[localConfig.temperature ?? selectedModel.config.temperature ?? 0.7]}
                        max={1}
                        step={0.1}
                        onValueChange={([val]) => handleConfigChange('temperature', val)}
                      />
                      <p className="text-xs text-muted-foreground">Controls randomness: Lowering results in less random completions.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Max Tokens</Label>
                        <span className="text-sm text-muted-foreground">
                          {localConfig.maxTokens ?? selectedModel.config.maxTokens ?? 4096}
                        </span>
                      </div>
                      <Slider
                        value={[localConfig.maxTokens ?? selectedModel.config.maxTokens ?? 4096]}
                        min={256}
                        max={8192}
                        step={256}
                        onValueChange={([val]) => handleConfigChange('maxTokens', val)}
                      />
                      <p className="text-xs text-muted-foreground">The maximum number of tokens to generate.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Advanced configuration not available for image models in this version.</p>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-border">
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    onClick={handleSaveConfig}
                    disabled={updateModelConfig.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateModelConfig.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Settings2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="font-medium">Select a model</p>
                <p className="text-sm mt-1">Click the settings icon on a model card to configure parameters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGovernanceModels;
