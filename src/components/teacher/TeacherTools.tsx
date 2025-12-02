import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Brain, Scroll, PenTool, BarChart3, Bot, ArrowRight, Layout } from 'lucide-react';
import LessonPlanner from './tools/LessonPlanner';
import QuizGenerator from './tools/QuizGenerator';
import RubricCreator from './tools/RubricCreator';
import GradingAssistant from './tools/GradingAssistant';
import CourseBuilder from './tools/CourseBuilder';
import PerformanceAnalyzer from './tools/PerformanceAnalyzer';
import AIChatInterface from './tools/AIChatInterface';
import type { LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
  component?: React.FC<{ onBack: () => void }>;
  type?: 'chat';
  systemPrompt?: string;
}

const TeacherTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools: Tool[] = [
    {
      id: 'lesson-planner',
      name: 'Lesson Planner',
      icon: BookOpen,
      description: 'Generate comprehensive lesson plans with objectives, activities, and resources.',
      color: 'from-blue-500 to-cyan-500',
      component: LessonPlanner
    },
    {
      id: 'quiz-generator',
      name: 'Quiz Generator',
      icon: Brain,
      description: 'Create interactive quizzes and tests from any topic or text content.',
      color: 'from-purple-500 to-pink-500',
      component: QuizGenerator
    },
    {
      id: 'rubric-creator',
      name: 'Rubric Creator',
      icon: Scroll,
      description: 'Design detailed grading rubrics for essays, projects, and presentations.',
      color: 'from-orange-500 to-red-500',
      component: RubricCreator
    },
    {
      id: 'grading-assistant',
      name: 'Grading Assistant',
      icon: PenTool,
      description: 'Get AI feedback and grading suggestions for student assignments.',
      color: 'from-green-500 to-emerald-500',
      component: GradingAssistant
    },
    {
      id: 'course-builder',
      name: 'Course Builder',
      icon: Layout,
      description: 'Structure entire courses, curriculums, and semester schedules.',
      color: 'from-indigo-500 to-violet-500',
      component: CourseBuilder
    },
    {
      id: 'performance',
      name: 'Performance Analyzer',
      icon: BarChart3,
      description: 'Analyze student data to identify trends and learning gaps.',
      color: 'from-yellow-500 to-orange-500',
      component: PerformanceAnalyzer
    },
    {
      id: 'assistant',
      name: 'Teaching Assistant',
      icon: Bot,
      description: 'Your personal AI co-teacher for quick questions and brainstorming.',
      color: 'from-slate-700 to-slate-900',
      type: 'chat',
      systemPrompt: "I am your expert AI Teaching Assistant. I can help you with classroom management strategies, educational psychology, administrative tasks, and creative teaching ideas."
    }
  ];

  const renderTool = () => {
    const tool = tools.find(t => t.id === activeTool);
    if (!tool) return null;

    if (tool.type === 'chat' && tool.systemPrompt) {
      return (
        <AIChatInterface 
          toolName={tool.name}
          systemPrompt={tool.systemPrompt}
          onBack={() => setActiveTool(null)}
          icon={tool.icon}
          accentColor={tool.color}
        />
      );
    }

    if (tool.component) {
      const Component = tool.component;
      return <Component onBack={() => setActiveTool(null)} />;
    }

    return null;
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <AnimatePresence mode="wait">
        {!activeTool ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground">Teacher AI Suite</h2>
              <p className="text-muted-foreground mt-1">Powerful tools to automate your workflow and enhance instruction</p>
            </div>

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
                    className="group bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${tool.color} opacity-5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500`}></div>
                    
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color} w-fit mb-4 shadow-sm group-hover:shadow-md transition-all`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{tool.description}</p>
                    <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                      Launch Tool <ArrowRight className="h-4 w-4 ml-1" />
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
            className="h-full"
          >
            {renderTool()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherTools;
