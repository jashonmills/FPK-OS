import { Star, Bug, Mountain, Settings } from 'lucide-react';

type TaskType = 'story' | 'bug' | 'epic' | 'chore';

interface TaskTypeIconProps {
  type: TaskType;
  className?: string;
}

export const TaskTypeIcon = ({ type, className = "h-4 w-4" }: TaskTypeIconProps) => {
  const icons = {
    story: <Star className={className} />,
    bug: <Bug className={className} />,
    epic: <Mountain className={className} />,
    chore: <Settings className={className} />
  };

  return icons[type] || icons.story;
};

export const getTaskTypeLabel = (type: TaskType): string => {
  const labels = {
    story: 'Story',
    bug: 'Bug',
    epic: 'Epic',
    chore: 'Chore'
  };
  return labels[type] || 'Story';
};

export const BUG_TEMPLATE = `### Steps to Reproduce
1. 
2. 
3. 

### Expected Behavior
- 

### Actual Behavior
- 

### Environment
- **Browser/Device:** 
- **OS:** `;
