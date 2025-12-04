// Conversation State Management Hook - Backend Intelligence Layer
import { useState, useCallback } from 'react';

export interface ConversationState {
  promptType: 'initiate_session' | 'initiate_quiz' | 'evaluate_answer' | 'evaluate_quiz_answer' | 'proactive_help' | 'evaluate_refresher' | 'direct_answer';
  isInQuiz: boolean;
  inRefresherMode: boolean;
  lastAIQuestion: string | null;
  currentTopic: string | null;
  incorrectAnswersCount: number;
  teachingMethods: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const useConversationState = () => {
  const [state, setState] = useState<ConversationState>({
    promptType: 'initiate_session',
    isInQuiz: false,
    inRefresherMode: false,
    lastAIQuestion: null,
    currentTopic: null,
    incorrectAnswersCount: 0,
    teachingMethods: []
  });

  // Analyze conversation history and determine next prompt type
  const analyzeConversation = useCallback((chatHistory: ChatMessage[], currentMessage: string): ConversationState => {
    const trimmed = currentMessage.trim();
    
    // Direct answer command
    if (trimmed.startsWith('/answer')) {
      return { ...state, promptType: 'direct_answer' };
    }

    // Struggle indicators
    if (isStruggleIndicator(trimmed)) {
      return { ...state, promptType: 'proactive_help' };
    }

    // Quiz request
    if (isQuizRequest(trimmed)) {
      return { 
        ...state, 
        promptType: 'initiate_quiz',
        isInQuiz: true,
        currentTopic: extractQuizTopic(trimmed)
      };
    }

    const lastAIMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
    const lastAIQuestion = lastAIMessage?.role === 'assistant' ? extractLastQuestion(lastAIMessage.content) : null;
    
    // Check if user is answering a question
    if (lastAIQuestion && isLikelyAnswer(trimmed, lastAIQuestion)) {
      // In refresher mode
      if (state.inRefresherMode) {
        return { 
          ...state, 
          promptType: 'evaluate_refresher',
          lastAIQuestion 
        };
      }
      
      // In quiz mode
      if (state.isInQuiz || isInQuizSession(chatHistory)) {
        return { 
          ...state, 
          promptType: 'evaluate_quiz_answer',
          isInQuiz: true,
          lastAIQuestion 
        };
      }
      
      // Regular answer evaluation
      const teachingMethods = extractTeachingHistory(chatHistory);
      const incorrectCount = countRecentIncorrectAnswers(chatHistory);
      
      return { 
        ...state, 
        promptType: 'evaluate_answer',
        lastAIQuestion,
        teachingMethods,
        incorrectAnswersCount: incorrectCount
      };
    }

    // Default to initiate session for new questions
    return { 
      ...state, 
      promptType: 'initiate_session',
      lastAIQuestion 
    };
  }, [state]);

  // Helper functions moved from prompt-builder
  const isStruggleIndicator = (message: string): boolean => {
    const struggleKeywords = [
      /i need more help/i,
      /can you help/i,
      /i don't know/i,
      /i'm stuck/i,
      /i need to go back to the basics/i,
      /i'm confused/i,
      /this is hard/i,
      /i don't understand/i
    ];
    return struggleKeywords.some(pattern => pattern.test(message));
  };

  const isQuizRequest = (message: string): boolean => {
    const quizPatterns = [
      /quiz me on/i,
      /give me a quiz on/i,
      /test me on/i,
      /can you quiz me/i,
      /i want a quiz on/i,
      /quiz about/i,
      /test my knowledge/i
    ];
    return quizPatterns.some(pattern => pattern.test(message));
  };

  const extractQuizTopic = (message: string): string => {
    const patterns = [
      /(?:quiz me on|give me a quiz on|test me on|can you quiz me (?:on|about)|i want a quiz on|quiz about|test my knowledge (?:of|on|about))\s+(.+)/i
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/[?.!]*$/, '');
      }
    }
    return message.trim();
  };

  const extractLastQuestion = (content: string): string | null => {
    if (content.includes('?') || 
        content.toLowerCase().includes('what') ||
        content.toLowerCase().includes('how') ||
        content.toLowerCase().includes('why') ||
        content.toLowerCase().includes('when') ||
        content.toLowerCase().includes('where') ||
        content.toLowerCase().includes('tell me about') ||
        content.toLowerCase().includes('explain')) {
      return content;
    }
    return null;
  };

  const isLikelyAnswer = (message: string, lastQuestion: string): boolean => {
    const answerPatterns = [
      /^(yes|no|maybe|i think|i believe|is it|that's|this is|it's|the answer is)/i,
      /^(because|since|due to|as a result)/i,
      /^[a-zA-Z\s]{1,50}$/i,
    ];
    
    const numericAnswer = /^\s*[-+]?\d+(?:\.\d+)?\s*$/;
    const simpleMathExpr = /\b\d+\s*([x*×+\/-])\s*\d+\b/;

    return answerPatterns.some(pattern => pattern.test(message.trim())) ||
           numericAnswer.test(message) ||
           simpleMathExpr.test(message) ||
           message.trim().length < 50;
  };

  const isInQuizSession = (chatHistory: ChatMessage[]): boolean => {
    for (let i = chatHistory.length - 1; i >= Math.max(0, chatHistory.length - 5); i--) {
      const msg = chatHistory[i];
      if (msg.role === 'assistant') {
        const content = msg.content.toLowerCase();
        if (content.includes('quiz') || content.includes('test') || 
            content.includes('let\'s start') || content.includes('great idea! let\'s begin')) {
          return true;
        }
      } else if (msg.role === 'user' && isQuizRequest(msg.content)) {
        return true;
      }
    }
    return false;
  };

  const extractTeachingHistory = (chatHistory: ChatMessage[]): string[] => {
    const teachingMethods: string[] = [];
    
    for (const msg of chatHistory) {
      if (msg.role === 'assistant') {
        const content = msg.content.toLowerCase();
        
        if (content.includes('add') && content.includes('times')) {
          teachingMethods.push('addition breakdown');
        }
        if (content.includes('analogy') || content.includes('like') || content.includes('imagine')) {
          teachingMethods.push('analogy method');
        }
        if (content.includes('break down') || content.includes('step by step')) {
          teachingMethods.push('step-by-step breakdown');
        }
        if (content.includes('example') || content.includes('for instance')) {
          teachingMethods.push('example illustration');
        }
        if (content.includes('visual') || content.includes('picture') || content.includes('draw')) {
          teachingMethods.push('visual approach');
        }
        if (content.includes('simpler') || content.includes('easier')) {
          teachingMethods.push('simplification method');
        }
        if (content.includes('pattern') || content.includes('sequence')) {
          teachingMethods.push('pattern recognition');
        }
        if (content.includes('group') || content.includes('set')) {
          teachingMethods.push('grouping method');
        }
      }
    }
    
    return [...new Set(teachingMethods)];
  };

  const countRecentIncorrectAnswers = (chatHistory: ChatMessage[]): number => {
    let count = 0;
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      const msg = chatHistory[i];
      if (msg.role === 'assistant') {
        const content = msg.content.toLowerCase();
        if (content.includes('not quite') || content.includes('try again') || content.includes('incorrect')) {
          count++;
        } else if (content.includes('correct') || content.includes('exactly') || content.includes('that\'s it')) {
          break;
        }
      }
    }
    return count;
  };

  const updateState = (updates: Partial<ConversationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return {
    state,
    analyzeConversation,
    updateState
  };
};