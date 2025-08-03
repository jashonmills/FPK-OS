import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Target, Star, Users, BookOpen, Calculator, MessageSquare, FileText } from 'lucide-react';
import { GOAL_TEMPLATES, type GoalTemplate, getAllCategories } from '@/data/goalTemplates';
import { useDualLanguage } from '@/hooks/useDualLanguage';
import DualLanguageText from '@/components/DualLanguageText';

interface GoalTemplatesSelectorProps {
  onTemplateSelect: (template: GoalTemplate) => void;
  onCustomGoal: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'reading': return <BookOpen className="h-4 w-4" />;
    case 'spelling': return <FileText className="h-4 w-4" />;
    case 'mathematics': return <Calculator className="h-4 w-4" />;
    case 'vocabulary': return <MessageSquare className="h-4 w-4" />;
    case 'study habits': return <Target className="h-4 w-4" />;
    case 'study skills': return <Star className="h-4 w-4" />;
    default: return <Target className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const GoalTemplatesSelector: React.FC<GoalTemplatesSelectorProps> = ({
  onTemplateSelect,
  onCustomGoal
}) => {
  const { t } = useDualLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = getAllCategories();
  const filteredTemplates = selectedCategory === 'all' 
    ? GOAL_TEMPLATES 
    : GOAL_TEMPLATES.filter(template => template.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">
          <DualLanguageText translationKey="goals.templates.title" fallback="Choose a Goal Template" />
        </h2>
        <p className="text-sm text-muted-foreground">
          <DualLanguageText 
            translationKey="goals.templates.subtitle" 
            fallback="Start with a proven structure or create your own custom goal" 
          />
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="all" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            All
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {getCategoryIcon(category)}
              <span className="ml-1 hidden sm:inline">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/20"
                onClick={() => onTemplateSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(template.category)}
                      <CardTitle className="text-sm line-clamp-2">{template.title}</CardTitle>
                    </div>
                    <Badge className={`${getPriorityColor(template.priority)} text-xs`}>
                      {template.priority}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* Template Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{template.estimatedDays} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>{template.xpEstimate} XP</span>
                    </div>
                  </div>
                  
                  {/* Milestones Preview */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium">
                      {template.milestones.length} Milestones:
                    </p>
                    <div className="space-y-1">
                      {template.milestones.slice(0, 2).map((milestone) => (
                        <div key={milestone.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                          <span className="line-clamp-1">{milestone.title}</span>
                        </div>
                      ))}
                      {template.milestones.length > 2 && (
                        <p className="text-xs text-muted-foreground/60 pl-2.5">
                          +{template.milestones.length - 2} more...
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button size="sm" className="w-full text-xs">
                    <DualLanguageText translationKey="goals.templates.use" fallback="Use This Template" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Custom Goal Option */}
          <Card className="border-dashed border-2 border-muted-foreground/20">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Target className="h-8 w-8 text-muted-foreground mb-3" />
              <h3 className="font-medium mb-2">
                <DualLanguageText translationKey="goals.templates.custom.title" fallback="Create Custom Goal" />
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                <DualLanguageText 
                  translationKey="goals.templates.custom.description" 
                  fallback="Start from scratch with your own goal structure" 
                />
              </p>
              <Button variant="outline" onClick={onCustomGoal}>
                <DualLanguageText translationKey="goals.templates.custom.button" fallback="Create Custom Goal" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalTemplatesSelector;