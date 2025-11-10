import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface CalloutSectionProps {
  content: string;
  style?: 'info' | 'warning' | 'success' | 'error' | 'teaching';
}

export const CalloutSection: React.FC<CalloutSectionProps> = ({ content, style = 'info' }) => {
  const getCalloutStyles = () => {
    switch (style) {
      case 'info':
        return {
          container: 'bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500',
          icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
          text: 'text-blue-900 dark:text-blue-100'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
          text: 'text-yellow-900 dark:text-yellow-100'
        };
      case 'success':
        return {
          container: 'bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500',
          icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
          text: 'text-green-900 dark:text-green-100'
        };
      case 'error':
        return {
          container: 'bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500',
          icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
          text: 'text-red-900 dark:text-red-100'
        };
      case 'teaching':
        return {
          container: 'bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500',
          icon: <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
          text: 'text-purple-900 dark:text-purple-100'
        };
      default:
        return {
          container: 'bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500',
          icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
          text: 'text-blue-900 dark:text-blue-100'
        };
    }
  };

  const styles = getCalloutStyles();

  return (
    <div className={`${styles.container} p-4 rounded-r mb-4`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {styles.icon}
        </div>
        <p className={`${styles.text} leading-relaxed`}>
          {content}
        </p>
      </div>
    </div>
  );
};
