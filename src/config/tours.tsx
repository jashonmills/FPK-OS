import { Step } from 'react-joyride';
import type { TourName } from '@/contexts/TourContext';

export const tourConfigs: Record<TourName, Step[]> = {
  dashboard: [
    {
      target: '[data-tour="welcome-card"]',
      content: 'Welcome to your FPK University command center! This tour will guide you through the key features. Let\'s get started.',
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '[data-tour="navigation-sidebar"]',
      content: 'This is your main navigation menu. You can access every part of the platform from here.',
      placement: 'right',
    },
    {
      target: '[data-tour="key-metrics"]',
      content: 'These cards give you a live, at-a-glance overview of your organization\'s most important metrics.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="recent-activity"]',
      content: 'This feed shows you a real-time log of important events, like student logins and course completions.',
      placement: 'top',
    },
    {
      target: '[data-tour="students-nav"]',
      content: 'Your first step is usually to add students. Let\'s head to the Students page, where another short guide will show you how.',
      placement: 'right',
    },
  ],
  
  students: [
    {
      target: 'body',
      content: 'This is your central hub for managing all student profiles. You can add students one-by-one or in bulk.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="student-roster"]',
      content: 'Your students will be listed here. You can see their status, grade level, and access actions like editing their profile.',
      placement: 'top',
    },
    {
      target: '[data-tour="import-csv"]',
      content: 'This is the most powerful feature here. Click this to download our template and upload your entire student roster in minutes.',
      placement: 'bottom',
    },
    {
      target: 'body',
      content: 'Our template uses these columns: full_name, grade_level, student_id, date_of_birth, parent_email, and notes. full_name is the only required field.',
      placement: 'center',
    },
    {
      target: '[data-tour="search-filter"]',
      content: 'Once you have a large roster, use the search and filter tools to quickly find the students you need.',
      placement: 'bottom',
    },
  ],
  
  groups: [
    {
      target: 'body',
      content: 'Groups allow you to organize students into classes or cohorts, like "Grade 9 Math" or "Reading Support".',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="create-group"]',
      content: 'Creating groups makes assigning courses and tracking progress for a whole class incredibly simple. Click here to create your first group.',
      placement: 'bottom',
    },
  ],
  
  courses: [
    {
      target: 'body',
      content: 'This is your complete course catalog. You can assign our pre-built Platform Courses or create your own.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="create-course"]',
      content: 'Click here to launch our Course Creation Wizard, where you can build custom learning modules from scratch.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="upload-course"]',
      content: 'Already have content? Use this button to import industry-standard SCORM packages or FPK University\'s native JSON files.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="course-actions"]',
      content: 'To assign a course, click the action menu and select "Assign to Students". You can assign to individuals or entire groups.',
      placement: 'left',
    },
  ],
  
  iep: [
    {
      target: '[data-tour="start-iep"]',
      content: 'This is our guided, 13-step wizard for creating comprehensive IEPs. It supports both US and Irish frameworks.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="parent-invite"]',
      content: 'A critical part of the IEP process is parent input. Use this tool to send an invite to parents, allowing them to fill out preparation forms securely.',
      placement: 'top',
    },
    {
      target: '[data-tour="active-invites"]',
      content: 'You can track the status of all your parent invites right here to ensure everyone has contributed.',
      placement: 'top',
    },
  ],
  
  goals_notes: [
    {
      target: '[data-tour="tabs"]',
      content: 'This section has two functions: tracking measurable Goals and documenting observational Notes.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="add-goal"]',
      content: 'Use the Goals tab to set and track SMART goals for students. You can link these directly to courses to monitor progress.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="add-note"]',
      content: 'Use the Notes tab to log important observations. You can keep notes private for your staff or share them with parents to facilitate communication.',
      placement: 'bottom',
    },
  ],
  
  ai_assistant: [
    {
      target: '[data-tour="chat-input"]',
      content: 'This is your AI Assistant. Think of it as an intelligent helper that knows everything about the platform and your organization\'s data.',
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: 'You can ask it things like, "What courses do you recommend for a student struggling with fractions?" or "Show me all students who haven\'t logged in this week." Give it a try!',
      placement: 'center',
    },
  ],
  
  settings: [
    {
      target: 'body',
      content: 'This page allows you to configure your organization\'s core settings.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="capacity-usage"]',
      content: 'Keep an eye on your student and instructor limits here to manage your subscription.',
      placement: 'top',
    },
    {
      target: '[data-tour="danger-zone"]',
      content: 'Be careful here! This section contains irreversible actions like deleting your entire organization. It is only visible to the owner.',
      placement: 'top',
    },
  ],
};

export const tourStyles = {
  options: {
    primaryColor: 'hsl(var(--primary))',
    textColor: 'hsl(var(--foreground))',
    backgroundColor: 'hsl(var(--background))',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    arrowColor: 'hsl(var(--background))',
    zIndex: 10000,
  },
  tooltip: {
    borderRadius: '8px',
    fontSize: '14px',
  },
  tooltipContainer: {
    textAlign: 'left' as const,
  },
  buttonNext: {
    backgroundColor: 'hsl(var(--primary))',
    color: 'hsl(var(--primary-foreground))',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
  },
  buttonBack: {
    color: 'hsl(var(--muted-foreground))',
    marginRight: '10px',
  },
  buttonSkip: {
    color: 'hsl(var(--muted-foreground))',
  },
};
