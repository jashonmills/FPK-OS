import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

export const createOnboardingTour = (onComplete: () => void, onSkip: () => void) => {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: {
        enabled: true,
      },
      classes: 'shepherd-theme-custom',
      scrollTo: { behavior: 'smooth', block: 'center' },
    },
  });

  tour.addStep({
    id: 'welcome',
    title: 'Welcome to FPK Pulse! 👋',
    text: '<p class="mb-3">Let\'s take a quick 60-second tour of the key features to get you started.</p><p class="text-sm text-muted-foreground">You can skip this tour at any time.</p>',
    buttons: [
      {
        text: 'Skip Tour',
        action: () => {
          tour.cancel();
          onSkip();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Start Tour',
        action: tour.next,
      },
    ],
  });

  tour.addStep({
    id: 'dashboard',
    title: 'Your Dashboard',
    text: 'This is your command center, where you can see an overview of your projects and tasks at a glance.',
    attachTo: {
      element: 'main',
      on: 'bottom',
    },
    buttons: [
      {
        text: 'Skip',
        action: () => {
          tour.cancel();
          onSkip();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: () => {
          window.location.href = '/kanban';
          setTimeout(() => tour.next(), 500);
        },
      },
    ],
  });

  tour.addStep({
    id: 'kanban',
    title: 'Kanban Board',
    text: 'Here is where you will manage your tasks. You can drag and drop cards to update their status between columns.',
    attachTo: {
      element: 'main',
      on: 'bottom',
    },
    buttons: [
      {
        text: 'Skip',
        action: () => {
          tour.cancel();
          onSkip();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Back',
        action: () => {
          window.location.href = '/';
          setTimeout(() => tour.back(), 500);
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: tour.next,
      },
    ],
  });

  tour.addStep({
    id: 'time-clock',
    title: 'Time Clock Widget',
    text: 'This is your most important tool! Click the Time Clock to start tracking time against tasks. It is available on every page.',
    attachTo: {
      element: '[data-time-clock-widget]',
      on: 'left',
    },
    buttons: [
      {
        text: 'Skip',
        action: () => {
          tour.cancel();
          onSkip();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Back',
        action: tour.back,
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: () => {
          window.location.href = '/my-timesheet';
          setTimeout(() => tour.next(), 500);
        },
      },
    ],
  });

  tour.addStep({
    id: 'timesheet',
    title: 'My Timesheet',
    text: 'At the end of each week, you will come here to review your hours and submit your timesheet for payroll approval.',
    attachTo: {
      element: 'main',
      on: 'bottom',
    },
    buttons: [
      {
        text: 'Skip',
        action: () => {
          tour.cancel();
          onSkip();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Back',
        action: () => {
          window.location.href = '/kanban';
          setTimeout(() => tour.back(), 500);
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: tour.next,
      },
    ],
  });

  tour.addStep({
    id: 'help',
    title: 'Help Center',
    text: 'Need help? Click this button anytime to access our complete user guide with detailed articles and tutorials.',
    attachTo: {
      element: '[data-help-button]',
      on: 'bottom',
    },
    buttons: [
      {
        text: 'Back',
        action: tour.back,
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Finish Tour',
        action: () => {
          tour.complete();
          onComplete();
        },
      },
    ],
  });

  tour.addStep({
    id: 'complete',
    title: 'You\'re All Set! 🎉',
    text: '<p class="mb-3">That\'s the basic flow! You can always restart this tour from the Help Center.</p><p class="text-sm text-muted-foreground">Click anywhere to close this message and start using FPK Pulse.</p>',
    buttons: [
      {
        text: 'Go to Dashboard',
        action: () => {
          window.location.href = '/';
          tour.complete();
        },
      },
    ],
  });

  return tour;
};
