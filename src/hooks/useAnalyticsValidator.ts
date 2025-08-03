import { useAnalyticsEventBus } from '@/hooks/useAnalyticsEventBus';

interface AnalyticsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingEvents: string[];
  recommendations: string[];
}

interface EventValidation {
  eventType: string;
  required: boolean;
  expectedCount?: number;
  timeWindow?: string;
}

export const useAnalyticsValidator = () => {
  const { getEventsByType, getEventHistory } = useAnalyticsEventBus();

  const CRITICAL_EVENTS: EventValidation[] = [
    { eventType: 'goal_created', required: true, timeWindow: '7d' },
    { eventType: 'goal_completed', required: true, timeWindow: '7d' },
    { eventType: 'module_completed', required: true, timeWindow: '7d' },
    { eventType: 'course_completed', required: false, timeWindow: '7d' },
    { eventType: 'page_view', required: true, expectedCount: 10, timeWindow: '1d' },
    { eventType: 'progress_updated', required: true, timeWindow: '7d' }
  ];

  const MEDIA_EVENTS: EventValidation[] = [
    { eventType: 'media_played', required: false, timeWindow: '7d' },
    { eventType: 'module_viewed', required: false, timeWindow: '7d' },
    { eventType: 'audio_played', required: false, timeWindow: '7d' },
    { eventType: 'video_played', required: false, timeWindow: '7d' }
  ];

  const validateEventStructure = (events: any[]): string[] => {
    const errors: string[] = [];
    
    events.forEach((event, index) => {
      // Check required fields
      if (!event.userId) {
        errors.push(`Event ${index}: Missing userId`);
      }
      
      if (!event.eventType) {
        errors.push(`Event ${index}: Missing eventType`);
      }
      
      if (!event.timestamp) {
        errors.push(`Event ${index}: Missing timestamp`);
      }
      
      // Check metadata structure for specific events
      if (event.eventType === 'goal_created' && !event.metadata?.goalId) {
        errors.push(`Event ${index}: goal_created missing goalId in metadata`);
      }
      
      if (event.eventType === 'module_completed' && !event.metadata?.moduleId) {
        errors.push(`Event ${index}: module_completed missing moduleId in metadata`);
      }
      
      if (event.eventType === 'progress_updated' && 
          (event.metadata?.newProgress === undefined || event.metadata?.oldProgress === undefined)) {
        errors.push(`Event ${index}: progress_updated missing progress values`);
      }
    });
    
    return errors;
  };

  const validateEventCounts = (validations: EventValidation[]): { warnings: string[], missingEvents: string[] } => {
    const warnings: string[] = [];
    const missingEvents: string[] = [];
    
    validations.forEach(validation => {
      const events = getEventsByType(validation.eventType);
      
      if (validation.required && events.length === 0) {
        missingEvents.push(validation.eventType);
      }
      
      if (validation.expectedCount && events.length < validation.expectedCount) {
        warnings.push(
          `${validation.eventType}: Expected ${validation.expectedCount}, found ${events.length}`
        );
      }
    });
    
    return { warnings, missingEvents };
  };

  const validateDataConsistency = (): string[] => {
    const errors: string[] = [];
    const allEvents = getEventHistory();
    
    // Check for duplicate events
    const eventMap = new Map<string, number>();
    allEvents.forEach(event => {
      const key = `${event.eventType}-${event.userId}-${event.timestamp}`;
      eventMap.set(key, (eventMap.get(key) || 0) + 1);
    });
    
    eventMap.forEach((count, key) => {
      if (count > 1) {
        errors.push(`Duplicate event detected: ${key} (${count} times)`);
      }
    });
    
    // Check temporal consistency
    const goalCreated = getEventsByType('goal_created');
    const goalCompleted = getEventsByType('goal_completed');
    
    goalCompleted.forEach(completed => {
      const goalId = completed.metadata?.goalId;
      if (goalId) {
        const created = goalCreated.find(c => c.metadata?.goalId === goalId);
        if (!created) {
          errors.push(`Goal completed without creation event: ${goalId}`);
        } else if (new Date(completed.timestamp) < new Date(created.timestamp)) {
          errors.push(`Goal completed before creation: ${goalId}`);
        }
      }
    });
    
    return errors;
  };

  const validateAnalytics = (): AnalyticsValidationResult => {
    const allEvents = getEventHistory();
    const structureErrors = validateEventStructure(allEvents);
    const consistencyErrors = validateDataConsistency();
    
    const criticalValidation = validateEventCounts(CRITICAL_EVENTS);
    const mediaValidation = validateEventCounts(MEDIA_EVENTS);
    
    const errors = [
      ...structureErrors,
      ...consistencyErrors
    ];
    
    const warnings = [
      ...criticalValidation.warnings,
      ...mediaValidation.warnings
    ];
    
    const missingEvents = [
      ...criticalValidation.missingEvents,
      ...mediaValidation.missingEvents
    ];
    
    const recommendations: string[] = [];
    
    // Generate recommendations based on findings
    if (missingEvents.includes('module_viewed')) {
      recommendations.push('Add module view tracking to iframe components');
    }
    
    if (missingEvents.includes('media_played')) {
      recommendations.push('Implement media play tracking in course components');
    }
    
    if (warnings.some(w => w.includes('page_view'))) {
      recommendations.push('Verify page view tracking is firing on all routes');
    }
    
    if (errors.some(e => e.includes('Duplicate'))) {
      recommendations.push('Implement event deduplication logic');
    }
    
    const isValid = errors.length === 0 && missingEvents.length === 0;
    
    return {
      isValid,
      errors,
      warnings,
      missingEvents,
      recommendations
    };
  };

  const generateAnalyticsReport = () => {
    const validation = validateAnalytics();
    const allEvents = getEventHistory();
    const eventTypes = [...new Set(allEvents.map(e => e.eventType))];
    
    const report = {
      summary: {
        totalEvents: allEvents.length,
        uniqueEventTypes: eventTypes.length,
        isHealthy: validation.isValid,
        lastEvent: allEvents[0]?.timestamp || 'No events recorded'
      },
      validation,
      eventBreakdown: eventTypes.map(type => ({
        type,
        count: getEventsByType(type).length,
        lastOccurrence: getEventsByType(type)[0]?.timestamp || 'Never'
      })).sort((a, b) => b.count - a.count)
    };
    
    return report;
  };

  return {
    validateAnalytics,
    generateAnalyticsReport,
    validateEventStructure,
    validateEventCounts,
    validateDataConsistency
  };
};