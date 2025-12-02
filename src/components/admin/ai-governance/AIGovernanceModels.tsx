import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Save, Zap, Lock, Server, ToggleLeft, ToggleRight, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';

interface ModelConfig {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  quality?: string;
  size?: string;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'text' | 'image';
  active: boolean;
  config: ModelConfig;
}

const AIGovernanceModels: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>(() => {
    const saved = localStorage.getItem('aiModels');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'gpt-4', 
        name: 'GPT-4 Turbo', 
        provider: 'OpenAI', 
        type: 'text',
        active: true,
        config: { temperature: 0.7, maxTokens: 4096, topP: 1.0 }
      },
      { 
        id: 'claude-3-opus', 
        name: 'Claude 3 Opus', 
        provider: 'Anthropic', 
        type: 'text',
        active: true,
        config: { temperature: 0.5, maxTokens: 4096, topP: 0.9 }
      },
      { 
        id: 'llama-3-70b', 
        name: 'Llama 3 70B', 
        provider: 'Meta', 
        type: 'text',
        active: false,
        config: { temperature: 0.8, maxTokens: 2048, topP: 0.95 }
      },
      { 
        id: 'dall-e-3', 
        name: 'DALL-E 3', 
        provider: 'OpenAI', 
        type: 'image',
        active: true,
        config: { quality: 'standard', size: '1024x1024' }
      }
    ];
  });

  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);

  useEffect(() => {
    localStorage.setItem('aiModels', JSON.stringify(models));
  }, [models]);

  const toggleModel = (id: string) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, active: !model.active } : model
    ));
    toast({
      title: "Model Status Updated",
      description: "The AI model availability has been changed.",
    });
  };

  const handleConfigChange = (id: string, key: string, value: number) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, config: { ...model.config, [key]: value } } : model
    ));
    if (selectedModel?.id === id) {
      setSelectedModel(prev => prev ? { ...prev, config: { ...prev.config, [key]: value } } : null);
    }
  };

  const getProviderColor = (provider: string) => {
    switch(provider) {
      case 'OpenAI': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Anthropic': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Meta': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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
                      <h3 className="text-lg font-bold text-foreground">{model.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getProviderColor(model.provider)}`}>
                        {model.provider}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Type: {model.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleModel(model.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {model.active ? (
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
                    onClick={() => setSelectedModel(selectedModel?.id === model.id ? null : model)}
                    className={selectedModel?.id === model.id ? 'bg-primary/10 border-primary text-primary' : ''}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {model.active && (
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

                {selectedModel.type === 'text' ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Temperature</Label>
                        <span className="text-sm text-muted-foreground">{selectedModel.config.temperature}</span>
                      </div>
                      <Slider
                        value={[selectedModel.config.temperature || 0.7]}
                        max={1}
                        step={0.1}
                        onValueChange={([val]) => handleConfigChange(selectedModel.id, 'temperature', val)}
                      />
                      <p className="text-xs text-muted-foreground">Controls randomness: Lowering results in less random completions.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Max Tokens</Label>
                        <span className="text-sm text-muted-foreground">{selectedModel.config.maxTokens}</span>
                      </div>
                      <Slider
                        value={[selectedModel.config.maxTokens || 4096]}
                        min={256}
                        max={8192}
                        step={256}
                        onValueChange={([val]) => handleConfigChange(selectedModel.id, 'maxTokens', val)}
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
                    onClick={() => toast({ title: "Configuration Saved", description: `Settings for ${selectedModel.name} have been saved.` })}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
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
