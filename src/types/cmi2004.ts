// SCORM 2004 CMI Data Model Types
export type ErrorCode2004 = "0"|"101"|"102"|"103"|"104"|"111"|"112"|"113"|"122"|"123"|"132"|"133"|"142"|"143"|"201"|"301"|"351"|"391"|"401"|"402"|"403"|"404"|"405"|"406"|"407"|"408";

export interface CMI2004Data {
  learner_id: string;
  learner_name: string;
  learner_preference: {
    audio_level: string;
    language: string;
    delivery_speed: string;
    audio_captioning: string;
  };
  location: string;
  completion_status: 'completed' | 'incomplete' | 'not attempted' | 'unknown';
  success_status: 'passed' | 'failed' | 'unknown';
  credit: 'credit' | 'no-credit';
  entry: 'ab-initio' | 'resume' | '';
  exit: 'time-out' | 'suspend' | 'logout' | 'normal' | '';
  mode: 'browse' | 'normal' | 'review';
  progress_measure: string; // 0.0 to 1.0
  score: {
    scaled: string; // -1.0 to 1.0
    raw: string;
    min: string;
    max: string;
  };
  total_time: string; // PT[#H][#M][#S]
  session_time: string; // PT[#H][#M][#S]
  max_time_allowed: string;
  time_limit_action: 'exit,message' | 'exit,no message' | 'continue,message' | 'continue,no message';
  scaled_passing_score: string;
  suspend_data: string;
  launch_data: string;
  objectives: CMI2004Objective[];
  interactions: CMI2004Interaction[];
  comments_from_learner: CMI2004Comment[];
  comments_from_lms: CMI2004Comment[];
}

export interface CMI2004Objective {
  id: string;
  score: {
    scaled: string;
    raw: string;
    min: string;
    max: string;
  };
  success_status: 'passed' | 'failed' | 'unknown';
  completion_status: 'completed' | 'incomplete' | 'not attempted' | 'unknown';
  progress_measure: string;
  description: string;
}

export interface CMI2004Interaction {
  id: string;
  type: 'true-false' | 'choice' | 'fill-in' | 'long-fill-in' | 'matching' | 'performance' | 'sequencing' | 'likert' | 'numeric' | 'other';
  objectives: Array<{ id: string }>;
  timestamp: string; // ISO 8601
  correct_responses: Array<{ pattern: string }>;
  weighting: string;
  learner_response: string;
  result: 'correct' | 'incorrect' | 'unanticipated' | 'neutral';
  latency: string; // PT[#H][#M][#S]
  description: string;
}

export interface CMI2004Comment {
  comment: string;
  location: string;
  timestamp: string; // ISO 8601
}

export type CMI2004Element = 
  | 'cmi.learner_id' | 'cmi.learner_name' 
  | 'cmi.location' | 'cmi.completion_status' | 'cmi.success_status'
  | 'cmi.credit' | 'cmi.entry' | 'cmi.exit' | 'cmi.mode'
  | 'cmi.progress_measure' | 'cmi.scaled_passing_score'
  | 'cmi.score.scaled' | 'cmi.score.raw' | 'cmi.score.min' | 'cmi.score.max'
  | 'cmi.total_time' | 'cmi.session_time' | 'cmi.max_time_allowed' | 'cmi.time_limit_action'
  | 'cmi.suspend_data' | 'cmi.launch_data'
  | `cmi.objectives.${number}.id` | `cmi.objectives.${number}.score.scaled`
  | `cmi.objectives.${number}.score.raw` | `cmi.objectives.${number}.score.min`
  | `cmi.objectives.${number}.score.max` | `cmi.objectives.${number}.success_status`
  | `cmi.objectives.${number}.completion_status` | `cmi.objectives.${number}.progress_measure`
  | `cmi.objectives.${number}.description`
  | `cmi.interactions.${number}.id` | `cmi.interactions.${number}.type`
  | `cmi.interactions.${number}.timestamp` | `cmi.interactions.${number}.learner_response`
  | `cmi.interactions.${number}.result` | `cmi.interactions.${number}.latency`
  | `cmi.interactions.${number}.description`
  | '_children' | '_count' | '_version';

export const ERROR_STRINGS_2004: Record<ErrorCode2004, string> = {
  "0": "No error",
  "101": "General exception",
  "102": "General initialization failure",
  "103": "Already initialized",
  "104": "Content instance terminated",
  "111": "General termination failure",
  "112": "Termination before initialization",
  "113": "Termination after termination",
  "122": "Retrieve data before initialization",
  "123": "Retrieve data after termination",
  "132": "Store data before initialization",
  "133": "Store data after termination",
  "142": "Commit before initialization",
  "143": "Commit after termination",
  "201": "General argument error",
  "301": "General get failure",
  "351": "General set failure",
  "391": "General commit failure",
  "401": "Undefined data model element",
  "402": "Unimplemented data model element",
  "403": "Data model element value not initialized",
  "404": "Data model element is read only",
  "405": "Data model element is write only",
  "406": "Data model element type mismatch",
  "407": "Data model element value out of range",
  "408": "Data model dependency not established"
};

export const READ_ONLY_ELEMENTS_2004 = [
  'cmi.learner_id',
  'cmi.learner_name',
  'cmi.credit',
  'cmi.entry',
  'cmi.mode',
  'cmi.total_time',
  'cmi.launch_data',
  'cmi.max_time_allowed',
  'cmi.time_limit_action',
  'cmi.scaled_passing_score'
];

export const WRITE_ONLY_ELEMENTS_2004 = [
  'cmi.exit',
  'cmi.session_time'
];