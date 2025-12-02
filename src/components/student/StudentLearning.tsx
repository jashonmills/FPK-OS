import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Code, Sparkles, MessageSquare, Calculator, Languages, ArrowLeft, Star, Clock, Loader2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AIChatInterface from '@/components/student/tools/AIChatInterface';
import CodeTutor from '@/components/student/tools/CodeTutor';
import EssayHelper from '@/components/student/tools/EssayHelper';
import ResearchAssistant from '@/components/student/tools/ResearchAssistant';
import { useStudentAIAnalytics } from '@/hooks/useStudentAIAnalytics';
import type { LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  toolId: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
  type: 'chat' | 'custom';
  component?: React.ComponentType<{ onBack: () => void }>;
}

const StudentLearning: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orgId = searchParams.get('org') || undefined;
  const { recommendations, isLoading } = useStudentAIAnalytics(orgId);

  const tools: Tool[] = [
    { 
      id: 'tutor',
      toolId: 'ai-personal-tutor',
      name: 'AI Personal Tutor', 
      icon: MessageSquare, 
      description: 'Get help with any subject through natural conversation', 
      color: 'from-blue-500 to-indigo-600',
      type: 'chat',
    },
    { 
      id: 'math',
      toolId: 'math-solver',
      name: 'Math Problem Solver', 
      icon: Calculator, 
      description: 'Step-by-step solutions for algebra, calculus, and more', 
      color: 'from-purple-500 to-pink-600',
      type: 'chat',
    },
    { 
      id: 'essay',
      toolId: 'essay-coach',
      name: 'Essay Writing Helper', 
      icon: BookOpen, 
      description: 'Structure arguments, check grammar, and improve flow', 
      color: 'from-orange-500 to-red-600',
      type: 'custom',
      component: EssayHelper
    },
    { 
      id: 'code',
      toolId: 'code-companion',
      name: 'Code Learning Companion', 
      icon: Code, 
      description: 'Interactive code reviews and programming concepts', 
      color: 'from-green-500 to-emerald-600',
      type: 'custom',
      component: CodeTutor
    },
    { 
      id: 'language',
      toolId: 'language-practice',
      name: 'Language Practice', 
      icon: Languages, 
      description: 'Conversation practice in Spanish, French, and more', 
      color: 'from-teal-500 to-cyan-600',
      type: 'chat',
    },
    { 
      id: 'research',
      toolId: 'research-assistant',
      name: 'Research Assistant', 
      icon: Sparkles, 
      description: 'Find sources, summarize papers, and organize citations', 
      color: 'from-violet-500 to-purple-600',
      type: 'custom',
      component: ResearchAssistant
    },
  ];

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/player/${courseId}`);
  };

  const renderTool = () => {
    const tool = tools.find(t => t.id === activeTool);
    if (!tool) return null;

    if (tool.type === 'custom' && tool.component) {
      const Component = tool.component;
      return <Component onBack={() => setActiveTool(null)} />;
    }

    return (
      <AIChatInterface 
        toolId={tool.toolId}
        toolName={tool.name}
        onBack={() => setActiveTool(null)}
        icon={tool.icon}
        accentColor={tool.color}
      />
    );
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!activeTool ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground">AI Learning Hub</h2>
              <p className="text-muted-foreground mt-1">Access your personalized AI tools and tracking</p>
            </div>

            {/* Recommendations Section - Only show if there are recommendations */}
            {isLoading ? (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                </div>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-semibold text-foreground">Continue Learning</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.map((rec) => (
                    <div 
                      key={rec.id} 
                      onClick={() => handleCourseClick(rec.id)}
                      className="bg-card p-4 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">{rec.subject}</span>
                        <span className={`text-xs font-medium ${
                          rec.difficulty === 'Easy' ? 'text-green-600 dark:text-green-400' : 
                          rec.difficulty === 'Medium' ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                        }`}>{rec.progress}% complete</span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2 line-clamp-2">{rec.title}</h4>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {rec.duration} spent
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-semibold text-foreground">Get Started</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Enroll in courses to see your personalized learning recommendations here.
                </p>
              </div>
            )}

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveTool(tool.id)}
                    className="group bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tool.description}</p>
                    <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                      Open Tool <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="tool-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="min-h-[700px] h-[calc(100vh-200px)]"
          >
            {renderTool()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentLearning;
