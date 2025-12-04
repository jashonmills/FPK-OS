// SCORM 1.2 CMI Data Model Types
export type ErrorCode = "0"|"101"|"201"|"202"|"203"|"301"|"351"|"391"|"401"|"402"|"403"|"404"|"405"|"406"|"407"|"408"|"409"|"410"|"411"|"412"|"413"|"414"|"415";

export interface CMI12Core {
  student_id: string;
  student_name: string;
  lesson_location: string;
  lesson_status: 'not attempted' | 'completed' | 'incomplete' | 'browsed' | 'failed' | 'passed';
  credit: 'credit' | 'no-credit';
  entry: 'ab-initio' | 'resume' | '';
  exit: 'time-out' | 'suspend' | 'logout' | '';
  score: {
    raw: string;
    min: string;
    max: string;
  };
  total_time: string; // HH:MM:SS[.SS]
  session_time: string; // HH:MM:SS[.SS]
}

export interface CMI12Objective {
  id: string;
  score: {
    raw: string;
    min: string;
    max: string;
  };
  status: 'not attempted' | 'completed' | 'incomplete' | 'browsed' | 'failed' | 'passed';
}

export interface CMI12Interaction {
  id: string;
  objectives: Array<{ id: string }>;
  time: string;
  type: 'true-false' | 'choice' | 'fill-in' | 'matching' | 'performance' | 'sequencing' | 'likert' | 'numeric';
  correct_responses: Array<{ pattern: string }>;
  weighting: string;
  student_response: string;
  result: 'correct' | 'wrong' | 'unanticipated' | 'neutral';
  latency: string;
}

export interface CMI12Data {
  core: CMI12Core;
  suspend_data: string;
  launch_data: string;
  comments: string;
  comments_from_lms: string;
  objectives: CMI12Objective[];
  interactions: CMI12Interaction[];
}

export type CMI12Element = 
  | 'cmi.core.student_id' | 'cmi.core.student_name' | 'cmi.core.lesson_location'
  | 'cmi.core.lesson_status' | 'cmi.core.credit' | 'cmi.core.entry' | 'cmi.core.exit'
  | 'cmi.core.score.raw' | 'cmi.core.score.min' | 'cmi.core.score.max'
  | 'cmi.core.total_time' | 'cmi.core.session_time'
  | 'cmi.suspend_data' | 'cmi.launch_data' | 'cmi.comments' | 'cmi.comments_from_lms'
  | `cmi.objectives.${number}.id` | `cmi.objectives.${number}.score.raw`
  | `cmi.objectives.${number}.score.min` | `cmi.objectives.${number}.score.max`
  | `cmi.objectives.${number}.status`
  | `cmi.interactions.${number}.id` | `cmi.interactions.${number}.time`
  | `cmi.interactions.${number}.type` | `cmi.interactions.${number}.student_response`
  | `cmi.interactions.${number}.result` | `cmi.interactions.${number}.latency`
  | '_children' | '_count';

export const ERROR_STRINGS: Record<ErrorCode, string> = {
  "0": "No error",
  "101": "General exception",
  "201": "Invalid argument error",
  "202": "Element cannot have children",
  "203": "Element not an array - cannot have count",
  "301": "Not initialized",
  "351": "Not implemented error",
  "391": "Not initialized",
  "401": "Not implemented error",
  "402": "Invalid set value, element is a keyword",
  "403": "Element is read only",
  "404": "Element is write only",
  "405": "Incorrect data type",
  "406": "Element value out of range",
  "407": "Data model dependency not established",
  "408": "Data model element conflict",
  "409": "Data model dependency not satisfied",
  "410": "Data model element collection limit reached",
  "411": "Data model element value not initialized",
  "412": "Data model element already initialized",
  "413": "Data model element value not initialized",
  "414": "Data model element value is write only",
  "415": "Data model element value is read only"
};

export const READ_ONLY_ELEMENTS = [
  'cmi.core.student_id',
  'cmi.core.student_name',
  'cmi.core.credit',
  'cmi.core.entry',
  'cmi.core.total_time',
  'cmi.launch_data',
  'cmi.comments_from_lms'
];

export const WRITE_ONLY_ELEMENTS = [
  'cmi.core.exit',
  'cmi.core.session_time'
];