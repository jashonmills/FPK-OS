import { ErrorCode, CMI12Data, READ_ONLY_ELEMENTS, WRITE_ONLY_ELEMENTS } from '@/types/cmi12';

export function validateTimeFormat(time: string): boolean {
  // HH:MM:SS[.SS] format
  const timeRegex = /^(\d{2}):(\d{2}):(\d{2})(\.\d{2})?$/;
  const match = time.match(timeRegex);
  
  if (!match) return false;
  
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  
  return hours >= 0 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60;
}

export function validateScoreRange(score: string, min = 0, max = 100): boolean {
  const num = parseFloat(score);
  return !isNaN(num) && num >= min && num <= max;
}

export function validateLessonStatus(status: string): boolean {
  const validStatuses = ['not attempted', 'completed', 'incomplete', 'browsed', 'failed', 'passed'];
  return validStatuses.includes(status);
}

export function validateCredit(credit: string): boolean {
  return ['credit', 'no-credit'].includes(credit);
}

export function validateEntry(entry: string): boolean {
  return ['ab-initio', 'resume', ''].includes(entry);
}

export function validateExit(exit: string): boolean {
  return ['time-out', 'suspend', 'logout', ''].includes(exit);
}

export function validateInteractionType(type: string): boolean {
  const validTypes = ['true-false', 'choice', 'fill-in', 'matching', 'performance', 'sequencing', 'likert', 'numeric'];
  return validTypes.includes(type);
}

export function validateInteractionResult(result: string): boolean {
  return ['correct', 'wrong', 'unanticipated', 'neutral'].includes(result);
}

export function isReadOnlyElement(element: string): boolean {
  return READ_ONLY_ELEMENTS.includes(element);
}

export function isWriteOnlyElement(element: string): boolean {
  return WRITE_ONLY_ELEMENTS.includes(element);
}

export function isValidElement(element: string): boolean {
  // Check if element exists in SCORM 1.2 data model
  const validPatterns = [
    /^cmi\.core\.(student_id|student_name|lesson_location|lesson_status|credit|entry|exit)$/,
    /^cmi\.core\.score\.(raw|min|max)$/,
    /^cmi\.core\.(total_time|session_time)$/,
    /^cmi\.(suspend_data|launch_data|comments|comments_from_lms)$/,
    /^cmi\.objectives\.\d+\.(id|status)$/,
    /^cmi\.objectives\.\d+\.score\.(raw|min|max)$/,
    /^cmi\.interactions\.\d+\.(id|time|type|student_response|result|latency)$/,
    /^cmi\.interactions\.\d+\.(objectives\.\d+\.id|correct_responses\.\d+\.pattern)$/,
    /^cmi\.(objectives|interactions)\._children$/,
    /^cmi\.(objectives|interactions)\._count$/
  ];
  
  return validPatterns.some(pattern => pattern.test(element));
}

export interface ValidationResult {
  ok: boolean;
  error?: ErrorCode;
  value?: any;
}

export function getValue12(cmi: CMI12Data, element: string): ValidationResult {
  if (!isValidElement(element)) {
    return { ok: false, error: "401" }; // Not implemented error
  }
  
  if (isWriteOnlyElement(element)) {
    return { ok: false, error: "404" }; // Element is write only
  }
  
  try {
    // Handle core elements
    if (element.startsWith('cmi.core.')) {
      const prop = element.replace('cmi.core.', '');
      if (prop.includes('.')) {
        const [parent, child] = prop.split('.');
        return { ok: true, value: (cmi.core as any)[parent]?.[child] || '' };
      }
      return { ok: true, value: (cmi.core as any)[prop] || '' };
    }
    
    // Handle direct CMI properties
    if (element === 'cmi.suspend_data') return { ok: true, value: cmi.suspend_data };
    if (element === 'cmi.launch_data') return { ok: true, value: cmi.launch_data };
    if (element === 'cmi.comments') return { ok: true, value: cmi.comments };
    if (element === 'cmi.comments_from_lms') return { ok: true, value: cmi.comments_from_lms };
    
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
      return { ok: true, value: 'id,score,status' };
    }
    if (element === 'cmi.objectives._count') {
      return { ok: true, value: cmi.objectives.length.toString() };
    }
    if (element === 'cmi.interactions._children') {
      return { ok: true, value: 'id,time,type,correct_responses,weighting,student_response,result,latency' };
    }
    if (element === 'cmi.interactions._count') {
      return { ok: true, value: cmi.interactions.length.toString() };
    }
    
    return { ok: true, value: '' };
  } catch (error) {
    return { ok: false, error: "101" }; // General exception
  }
}

export function setValue12(cmi: CMI12Data, element: string, value: string): ValidationResult {
  if (!isValidElement(element)) {
    return { ok: false, error: "401" }; // Not implemented error
  }
  
  if (isReadOnlyElement(element)) {
    return { ok: false, error: "403" }; // Element is read only
  }
  
  try {
    // Validate specific elements
    if (element === 'cmi.core.lesson_status' && !validateLessonStatus(value)) {
      return { ok: false, error: "405" }; // Incorrect data type
    }
    
    if (element === 'cmi.core.credit' && !validateCredit(value)) {
      return { ok: false, error: "405" }; // Incorrect data type
    }
    
    if (element === 'cmi.core.entry' && !validateEntry(value)) {
      return { ok: false, error: "405" }; // Incorrect data type
    }
    
    if (element === 'cmi.core.exit' && !validateExit(value)) {
      return { ok: false, error: "405" }; // Incorrect data type
    }
    
    if ((element === 'cmi.core.session_time' || element === 'cmi.core.total_time') && !validateTimeFormat(value)) {
      return { ok: false, error: "405" }; // Incorrect data type
    }
    
    if (element.includes('.score.') && value !== '' && !validateScoreRange(value)) {
      return { ok: false, error: "406" }; // Element value out of range
    }
    
    // Set the value
    if (element.startsWith('cmi.core.')) {
      const prop = element.replace('cmi.core.', '');
      if (prop.includes('.')) {
        const [parent, child] = prop.split('.');
        if (!cmi.core[parent as keyof typeof cmi.core]) {
          (cmi.core as any)[parent] = {};
        }
        (cmi.core as any)[parent][child] = value;
      } else {
        (cmi.core as any)[prop] = value;
      }
    } else if (element === 'cmi.suspend_data') {
      cmi.suspend_data = value;
    } else if (element === 'cmi.comments') {
      cmi.comments = value;
    }
    // Handle objectives and interactions setting here...
    
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "391" }; // General set failure
  }
}