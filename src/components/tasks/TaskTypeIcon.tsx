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
*A clear, step-by-step list of actions to trigger the bug.*
1. 
2. 
3. 

### Expected Behavior
*What should have happened?*


### Actual Behavior
*What actually happened? Include error messages if any.*


### Environment
*Help us reproduce the issue.*
- **Browser/Device:** 
- **Operating System:** `;

export const STORY_TEMPLATE = `### User Story
*As a [type of user], I want [an action or feature], so that [I can achieve a benefit].*

**As a** ...
**I want** ...
**so that** ...

### Acceptance Criteria
*A checklist of what must be true for this story to be considered "done."*
- [ ] 
- [ ] 
- [ ] `;

export const EPIC_TEMPLATE = `### Business Goal
*What is the high-level objective we are trying to achieve with this initiative?*


### Scope
*What key features or areas will be included in this epic?*
- 
- 

### Out of Scope
*What will we explicitly NOT be doing as part of this epic?*
- 
- `;

export const CHORE_TEMPLATE = `### Task Description
*A brief explanation of the technical task to be performed.*


### Justification
*Why does this need to be done? (e.g., "To apply the latest security patches and improve database performance.")*
`;

export const getTaskTemplate = (type: TaskType): string => {
  const templates = {
    story: STORY_TEMPLATE,
    bug: BUG_TEMPLATE,
    epic: EPIC_TEMPLATE,
    chore: CHORE_TEMPLATE
  };
  return templates[type] || STORY_TEMPLATE;
};
