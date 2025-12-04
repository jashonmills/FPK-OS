import { ErrorCode2004, CMI2004Data, READ_ONLY_ELEMENTS_2004, WRITE_ONLY_ELEMENTS_2004 } from '@/types/cmi2004';

export function validateTimeInterval(time: string): boolean {
  // PT[#H][#M][#S] format (ISO 8601 duration)
  const timeRegex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/;
  return timeRegex.test(time);
}

export function validateScaledScore(score: string): boolean {
  const num = parseFloat(score);
  return !isNaN(num) && num >= -1.0 && num <= 1.0;
}

export function validateProgressMeasure(measure: string): boolean {
  const num = parseFloat(measure);
  return !isNaN(num) && num >= 0.0 && num <= 1.0;
}

export function validateCompletionStatus(status: string): boolean {
  return ['completed', 'incomplete', 'not attempted', 'unknown'].includes(status);
}

export function validateSuccessStatus(status: string): boolean {
  return ['passed', 'failed', 'unknown'].includes(status);
}

export function validateCredit2004(credit: string): boolean {
  return ['credit', 'no-credit'].includes(credit);
}

export function validateEntry2004(entry: string): boolean {
  return ['ab-initio', 'resume', ''].includes(entry);
}

export function validateExit2004(exit: string): boolean {
  return ['time-out', 'suspend', 'logout', 'normal', ''].includes(exit);
}

export function validateMode(mode: string): boolean {
  return ['browse', 'normal', 'review'].includes(mode);
}

export function validateInteractionType2004(type: string): boolean {
  const validTypes = ['true-false', 'choice', 'fill-in', 'long-fill-in', 'matching', 'performance', 'sequencing', 'likert', 'numeric', 'other'];
  return validTypes.includes(type);
}

export function validateInteractionResult2004(result: string): boolean {
  return ['correct', 'incorrect', 'unanticipated', 'neutral'].includes(result);
}

export function validateTimestamp(timestamp: string): boolean {
  // ISO 8601 format validation
  const date = new Date(timestamp);
  return !isNaN(date.getTime());
}

export function isReadOnlyElement2004(element: string): boolean {
  return READ_ONLY_ELEMENTS_2004.includes(element);
}

export function isWriteOnlyElement2004(element: string): boolean {
  return WRITE_ONLY_ELEMENTS_2004.includes(element);
}

export function isValidElement2004(element: string): boolean {
  const validPatterns = [
    /^cmi\.(learner_id|learner_name|location|completion_status|success_status|credit|entry|exit|mode)$/,
    /^cmi\.(progress_measure|scaled_passing_score|suspend_data|launch_data)$/,
    /^cmi\.(max_time_allowed|time_limit_action|total_time|session_time)$/,
    /^cmi\.score\.(scaled|raw|min|max)$/,
    /^cmi\.learner_preference\.(audio_level|language|delivery_speed|audio_captioning)$/,
    /^cmi\.objectives\.\d+\.(id|success_status|completion_status|progress_measure|description)$/,
    /^cmi\.objectives\.\d+\.score\.(scaled|raw|min|max)$/,
    /^cmi\.interactions\.\d+\.(id|type|timestamp|learner_response|result|latency|description)$/,
    /^cmi\.interactions\.\d+\.(objectives\.\d+\.id|correct_responses\.\d+\.pattern)$/,
    /^cmi\.comments_from_(learner|lms)\.\d+\.(comment|location|timestamp)$/,
    /^cmi\.(objectives|interactions|comments_from_learner|comments_from_lms)\._children$/,
    /^cmi\.(objectives|interactions|comments_from_learner|comments_from_lms)\._count$/,
    /^cmi\._version$/
  ];
  
  return validPatterns.some(pattern => pattern.test(element));
}

export interface ValidationResult2004 {
  ok: boolean;
  error?: ErrorCode2004;
  value?: any;
}

export function getValue2004(cmi: CMI2004Data, element: string): ValidationResult2004 {
  if (!isValidElement2004(element)) {
    return { ok: false, error: "401" }; // Undefined data model element
  }
  
  if (isWriteOnlyElement2004(element)) {
    return { ok: false, error: "405" }; // Data model element is write only
  }
  
  try {
    // Handle direct properties
    if (element === 'cmi.learner_id') return { ok: true, value: cmi.learner_id };
    if (element === 'cmi.learner_name') return { ok: true, value: cmi.learner_name };
    if (element === 'cmi.location') return { ok: true, value: cmi.location };
    if (element === 'cmi.completion_status') return { ok: true, value: cmi.completion_status };
    if (element === 'cmi.success_status') return { ok: true, value: cmi.success_status };
    if (element === 'cmi.credit') return { ok: true, value: cmi.credit };
    if (element === 'cmi.entry') return { ok: true, value: cmi.entry };
    if (element === 'cmi.exit') return { ok: true, value: cmi.exit };
    if (element === 'cmi.mode') return { ok: true, value: cmi.mode };
    if (element === 'cmi.progress_measure') return { ok: true, value: cmi.progress_measure };
    if (element === 'cmi.scaled_passing_score') return { ok: true, value: cmi.scaled_passing_score };
    if (element === 'cmi.suspend_data') return { ok: true, value: cmi.suspend_data };
    if (element === 'cmi.launch_data') return { ok: true, value: cmi.launch_data };
    if (element === 'cmi.total_time') return { ok: true, value: cmi.total_time };
    if (element === 'cmi.session_time') return { ok: true, value: cmi.session_time };
    if (element === 'cmi.max_time_allowed') return { ok: true, value: cmi.max_time_allowed };
    if (element === 'cmi.time_limit_action') return { ok: true, value: cmi.time_limit_action };
    
    // Handle score elements
    if (element.startsWith('cmi.score.')) {
      const prop = element.replace('cmi.score.', '');
      return { ok: true, value: (cmi.score as any)[prop] || '' };
    }
    
    // Handle learner preference
    if (element.startsWith('cmi.learner_preference.')) {
      const prop = element.replace('cmi.learner_preference.', '');
      return { ok: true, value: (cmi.learner_preference as any)[prop] || '' };
    }
    
    // Handle objectives
    const objectiveMatch = element.match(/^cmi\.objectives\.(\d+)\.(.+)$/);
    if (objectiveMatch) {
      const index = parseInt(objectiveMatch[1], 10);
      const prop = objectiveMatch[2];
      const objective = cmi.objectives[index];
      
      if (!objective) return { ok: true, value: '' };
      
      if (prop.includes('.')) {
        const [parent, child] = prop.split('.');
        return { ok: true, value: (objective as any)[parent]?.[child] || '' };
      }
      return { ok: true, value: (objective as any)[prop] || '' };
    }
    
    // Handle interactions
    const interactionMatch = element.match(/^cmi\.interactions\.(\d+)\.(.+)$/);
    if (interactionMatch) {
      const index = parseInt(interactionMatch[1], 10);
      const prop = interactionMatch[2];
      const interaction = cmi.interactions[index];
      
      if (!interaction) return { ok: true, value: '' };
      return { ok: true, value: (interaction as any)[prop] || '' };
    }
    
    // Handle _children and _count
    if (element === 'cmi.objectives._children') {
      return { ok: true, value: 'id,score,success_status,completion_status,progress_measure,description' };
    }
    if (element === 'cmi.objectives._count') {
      return { ok: true, value: cmi.objectives.length.toString() };
    }
    if (element === 'cmi.interactions._children') {
      return { ok: true, value: 'id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description' };
    }
    if (element === 'cmi.interactions._count') {
      return { ok: true, value: cmi.interactions.length.toString() };
    }
    
    // Handle version
    if (element === 'cmi._version') {
      return { ok: true, value: '1.0' };
    }
    
    return { ok: true, value: '' };
  } catch (error) {
    return { ok: false, error: "301" }; // General get failure
  }
}

export function setValue2004(cmi: CMI2004Data, element: string, value: string): ValidationResult2004 {
  if (!isValidElement2004(element)) {
    return { ok: false, error: "401" }; // Undefined data model element
  }
  
  if (isReadOnlyElement2004(element)) {
    return { ok: false, error: "404" }; // Data model element is read only
  }
  
  try {
    // Validate specific elements
    if (element === 'cmi.completion_status' && !validateCompletionStatus(value)) {
      return { ok: false, error: "406" }; // Data model element type mismatch
    }
    
    if (element === 'cmi.success_status' && !validateSuccessStatus(value)) {
      return { ok: false, error: "406" }; // Data model element type mismatch
    }
    
    if (element === 'cmi.credit' && !validateCredit2004(value)) {
      return { ok: false, error: "406" }; // Data model element type mismatch
    }
    
    if (element === 'cmi.entry' && !validateEntry2004(value)) {
      return { ok: false, error: "406" }; // Data model element type mismatch
    }
    
    if (element === 'cmi.exit' && !validateExit2004(value)) {
      return { ok: false, error: "406" }; // Data model element type mismatch
    }
    
    if (element === 'cmi.mode' && !validateMode(value)) {
      return { ok: false, error: "406" }; // Data model element type mismatch
    }
    
    if ((element === 'cmi.session_time' || element === 'cmi.total_time') && value !== '' && !validateTimeInterval(value)) {
      return { ok: false, error: "406" }; // Data model element type mismatch
    }
    
    if (element === 'cmi.score.scaled' && value !== '' && !validateScaledScore(value)) {
      return { ok: false, error: "407" }; // Data model element value out of range
    }
    
    if (element === 'cmi.progress_measure' && value !== '' && !validateProgressMeasure(value)) {
      return { ok: false, error: "407" }; // Data model element value out of range
    }
    
    // Set the value
    if (element === 'cmi.location') cmi.location = value;
    else if (element === 'cmi.completion_status') cmi.completion_status = value as any;
    else if (element === 'cmi.success_status') cmi.success_status = value as any;
    else if (element === 'cmi.exit') cmi.exit = value as any;
    else if (element === 'cmi.progress_measure') cmi.progress_measure = value;
    else if (element === 'cmi.suspend_data') cmi.suspend_data = value;
    else if (element === 'cmi.session_time') cmi.session_time = value;
    else if (element.startsWith('cmi.score.')) {
      const prop = element.replace('cmi.score.', '');
      (cmi.score as any)[prop] = value;
    }
    // Handle objectives and interactions setting here...
    
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "351" }; // General set failure
  }
}