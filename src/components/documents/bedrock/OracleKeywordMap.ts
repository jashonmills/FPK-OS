// FPK-X Oracle: Master Keyword-to-Category Mapping System

export const ORACLE_KEYWORD_MAP: Record<string, string> = {
  // --- IEP & Related Plans ---
  'individualized education program': 'IEP',
  'iep': 'IEP',
  'goals': 'IEP',
  'annual goals': 'IEP',
  'present levels': 'IEP',
  'accommodations': 'IEP',
  'modifications': 'IEP',
  'school plan': 'IEP',
  'sped': 'IEP',
  'special ed': 'IEP',
  'iep annual review': 'IEP_ANNUAL',
  'annual review': 'IEP_ANNUAL',
  'iep amendment': 'IEP_AMENDMENT',
  'amendment': 'IEP_AMENDMENT',
  'ifsp': 'IFSP',
  'family service plan': 'IFSP',
  'early intervention': 'IFSP',
  'toddler': 'IFSP',
  'birth to three': 'IFSP',
  'itp': 'ITP',
  'transition plan': 'ITP',
  'post-secondary': 'ITP',
  'after high school': 'ITP',
  'section 504': '504_PLAN',
  '504': '504_PLAN',
  'accommodation plan': '504_PLAN',

  // --- Behavioral Documents ---
  'behavior intervention plan': 'BIP',
  'bip': 'BIP',
  'behavior plan': 'BIP',
  'behavior intervention': 'BIP',
  'target behavior': 'BIP',
  'replacement behavior': 'BIP',
  'functional behavior assessment': 'FBA',
  'fba': 'FBA',
  'functional behavior': 'FBA',
  'abc data': 'FBA',
  'antecedent': 'FBA',
  'consequence': 'FBA',
  'behavior assessment': 'FBA',
  'mdr': 'MDR',
  'manifestation': 'MDR',
  'suspension': 'MDR',
  'expulsion': 'MDR',
  'incident log': 'INCIDENT_LOG',
  'behavior log': 'INCIDENT_LOG',

  // --- Evaluations & Assessments ---
  'psychoeducational evaluation': 'PSYCH_EVAL',
  'psych eval': 'PSYCH_EVAL',
  'evaluation': 'EVAL_REPORT',
  'eval': 'EVAL_REPORT',
  'assessment': 'EVAL_REPORT',
  'testing': 'EVAL_REPORT',
  'test results': 'EVAL_REPORT',
  'scores': 'EVAL_REPORT',
  'psychoeducational': 'PSYCH_EVAL',
  'psych ed': 'PSYCH_EVAL',
  'school psychologist': 'PSYCH_EVAL',
  'wisc': 'PSYCH_EVAL',
  'wiat': 'PSYCH_EVAL',
  'woodcock': 'PSYCH_EVAL',
  'wj-iv': 'PSYCH_EVAL',
  'kaufman': 'PSYCH_EVAL',
  'ktea': 'PSYCH_EVAL',
  'triennial evaluation': 'TRIENNIAL_EVAL',
  'triennial': 'TRIENNIAL_EVAL',
  'three year evaluation': 'TRIENNIAL_EVAL',
  'diagnostic report': 'DIAGNOSTIC_REPORT',
  'diagnosis': 'DIAGNOSTIC_REPORT',
  'doctor letter': 'DIAGNOSTIC_REPORT',
  'autism diagnosis': 'DIAGNOSTIC_REPORT',
  'adhd diagnosis': 'DIAGNOSTIC_REPORT',
  'ados': 'ADOS',
  'ados-2': 'ADOS',
  'autism observation': 'ADOS',
  'vineland': 'VINELAND',
  'vabs': 'VINELAND',
  'adaptive behavior': 'VINELAND',
  'daily living skills': 'VINELAND',
  'abas': 'VINELAND',
  'conners': 'CONNERS',
  'brief': 'BRIEF',
  'executive function': 'BRIEF',
  'srs': 'SRS',
  'social responsiveness': 'SRS',
  'scq': 'SCQ',
  'social communication': 'SCQ',
  'celf': 'CELF',
  'language test': 'CELF',
  'expressive language': 'CELF',
  'receptive language': 'CELF',
  'ctopp': 'CTOPP',
  'phonological': 'CTOPP',
  'reading test': 'CTOPP',
  'speech-language evaluation': 'SPEECH_EVAL',
  'speech eval': 'SPEECH_EVAL',
  'slp': 'SPEECH_EVAL',
  'occupational therapy evaluation': 'OT_EVAL',
  'ot eval': 'OT_EVAL',
  'sensory': 'OT_EVAL',
  'physical therapy evaluation': 'PT_EVAL',
  'pt eval': 'PT_EVAL',
  'vision therapy': 'VISION_EVAL',
  'vision assessment': 'VISION_EVAL',
  'audiology': 'AUDIOLOGY',
  'hearing test': 'AUDIOLOGY',
  'assistive technology': 'ASSISTIVE_TECH',
  'assistive tech': 'ASSISTIVE_TECH',

  // --- Progress & Therapy Notes ---
  'progress report': 'PROGRESS_REPORT',
  'progress note': 'PROGRESS_REPORT',
  'goal update': 'PROGRESS_REPORT',
  'quarterly report': 'PROGRESS_REPORT',
  'soap note': 'SOAP_NOTE',
  'therapy note': 'SOAP_NOTE',
  'session note': 'SOAP_NOTE',
  'aba data': 'SOAP_NOTE',
  'slp note': 'SOAP_NOTE',
  'ot note': 'SOAP_NOTE',
  'communication log': 'COMM_LOG',
  'home note': 'COMM_LOG',
  'daily note': 'COMM_LOG',
  'report card': 'REPORT_CARD',
  'grades': 'REPORT_CARD',
  'standardized test': 'STANDARDIZED_TEST',
  'standardized test results': 'STANDARDIZED_TEST',
  'classroom observation': 'CLASSROOM_OBS',

  // --- Medical & Insurance ---
  'explanation of benefits': 'EOB',
  'eob': 'EOB',
  'insurance statement': 'EOB',
  'claim': 'EOB',
  'superbill': 'SUPERBILL',
  'insurance receipt': 'SUPERBILL',
  'letter of medical necessity': 'LMN',
  'lmn': 'LMN',
  'medical necessity': 'LMN',
  'medical justification': 'LMN',
  'prior auth': 'PRIOR_AUTH',
  'authorization': 'PRIOR_AUTH',
  'denial': 'DENIAL_LETTER',
  'insurance denial': 'DENIAL_LETTER',
  'appeal': 'APPEAL_LETTER',
  'hospital discharge': 'HOSPITAL_DISCHARGE',
  'discharge summary': 'HOSPITAL_DISCHARGE',
  'medication log': 'MEDICATION_LOG',

  // --- Legal & Administrative ---
  'prior written notice': 'PWN',
  'pwn': 'PWN',
  'consent': 'CONSENT_FORM',
  'permission': 'CONSENT_FORM',
  'release of information': 'CONSENT_FORM',
  'roi': 'CONSENT_FORM',
  'meeting notice': 'MEETING_NOTICE',
  'iep meeting': 'MEETING_NOTICE',
  'independent evaluation': 'IEE',
  'iee': 'IEE',
  'due process': 'DUE_PROCESS',
  'state complaint': 'DUE_PROCESS',

  // --- Additional ---
  'rti': 'RTI',
  'mtss': 'RTI',
};

// Map Oracle codes to actual document category values
export const ORACLE_TO_CATEGORY_MAP: Record<string, string> = {
  'IEP': 'iep',
  'IEP_ANNUAL': 'iep_annual_review',
  'IEP_AMENDMENT': 'iep_amendment',
  '504_PLAN': '504_plan',
  'ITP': 'transition_plan',
  'BIP': 'bip',
  'FBA': 'fba',
  'INCIDENT_LOG': 'incident_log',
  'PSYCH_EVAL': 'psych_eval',
  'EVAL_REPORT': 'psych_eval',
  'TRIENNIAL_EVAL': 'triennial_eval',
  'SPEECH_EVAL': 'speech_eval',
  'OT_EVAL': 'ot_eval',
  'PT_EVAL': 'pt_eval',
  'VISION_EVAL': 'vision_eval',
  'AUDIOLOGY': 'audiology',
  'ASSISTIVE_TECH': 'assistive_tech',
  'PROGRESS_REPORT': 'progress_report',
  'REPORT_CARD': 'report_card',
  'STANDARDIZED_TEST': 'standardized_test',
  'CLASSROOM_OBS': 'classroom_observation',
  'EOB': 'eob',
  'LMN': 'medical_justification',
  'HOSPITAL_DISCHARGE': 'hospital_discharge',
  'MEDICATION_LOG': 'medication_log',
  'RTI': 'rti',
  // Additional mappings for partial matches
  'DIAGNOSTIC_REPORT': 'psych_eval',
  'ADOS': 'psych_eval',
  'VINELAND': 'psych_eval',
  'CONNERS': 'psych_eval',
  'BRIEF': 'psych_eval',
  'SRS': 'psych_eval',
  'SCQ': 'psych_eval',
  'CELF': 'speech_eval',
  'CTOPP': 'psych_eval',
  'SOAP_NOTE': 'progress_report',
  'COMM_LOG': 'incident_log',
  'SUPERBILL': 'eob',
  'PRIOR_AUTH': 'eob',
  'DENIAL_LETTER': 'eob',
  'APPEAL_LETTER': 'eob',
  'PWN': 'iep',
  'CONSENT_FORM': 'iep',
  'MEETING_NOTICE': 'iep',
  'IEE': 'psych_eval',
  'DUE_PROCESS': 'iep',
  'MDR': 'bip',
  'IFSP': 'iep',
};

export interface OracleMatch {
  category: string;
  matchedKeyword: string;
  confidence: 'high' | 'medium';
}

/**
 * FPK-X Oracle Search Function
 * Finds the best matching document category based on user input
 */
export function findCategoryByKeyword(userInput: string): OracleMatch | null {
  if (!userInput || userInput.trim().length === 0) {
    return null;
  }

  const normalized = userInput.toLowerCase().trim();

  // Sort keywords by length (longest first) for better specificity
  const sortedKeywords = Object.keys(ORACLE_KEYWORD_MAP).sort(
    (a, b) => b.length - a.length
  );

  // Find first match
  for (const keyword of sortedKeywords) {
    if (normalized.includes(keyword)) {
      const oracleCode = ORACLE_KEYWORD_MAP[keyword];
      const categoryValue = ORACLE_TO_CATEGORY_MAP[oracleCode];

      if (categoryValue) {
        return {
          category: categoryValue,
          matchedKeyword: keyword,
          confidence: keyword.length > 5 ? 'high' : 'medium',
        };
      }
    }
  }

  return null;
}
