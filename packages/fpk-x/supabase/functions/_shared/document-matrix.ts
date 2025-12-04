export interface DocumentType {
  doc_type: string;
  category: 'Education' | 'Medical' | 'Therapy' | 'Legal' | 'Behavioral' | 'Daily Living';
  keywords: string[];
  expected_data: string;
  generates_chart?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const DOCUMENT_INTELLIGENCE_MATRIX: DocumentType[] = [
  // Education Documents
  {
    doc_type: "Individualized Education Program (IEP)",
    category: "Education",
    keywords: ["Individualized Education Program", "IEP", "Annual Goal", "Specially Designed Instruction", "Present Levels", "PLOP"],
    expected_data: "Goals (with baseline/current/target values), Services (minutes/frequency), Accommodations, Modifications, Present Levels of Performance (PLOP)",
    generates_chart: "iep_goal_service_tracker",
    priority: "critical"
  },
  {
    doc_type: "IEP Amendment",
    category: "Education",
    keywords: ["IEP Amendment", "Amendment to IEP", "IEP Addendum"],
    expected_data: "Updated goals, Changed services or accommodations, Reasons for amendment",
    generates_chart: "iep_goal_service_tracker",
    priority: "high"
  },
  {
    doc_type: "Progress Report",
    category: "Education",
    keywords: ["Progress Report", "IEP Progress", "Goal Progress", "Quarterly Report"],
    expected_data: "Goal progress percentages, Current performance levels, Areas of growth",
    generates_chart: "iep_goal_service_tracker",
    priority: "high"
  },
  {
    doc_type: "Report Card",
    category: "Education",
    keywords: ["Report Card", "Grade Report", "Academic Progress", "Semester Grades"],
    expected_data: "Letter grades, Subject-specific scores, Teacher comments, Academic trends",
    generates_chart: "academic_fluency_trends",
    priority: "medium"
  },
  {
    doc_type: "Evaluation Team Report (ETR)",
    category: "Education",
    keywords: ["Evaluation Team Report", "ETR", "Re-evaluation", "Comprehensive Evaluation"],
    expected_data: "Cognitive scores, Academic achievement levels, Areas of need, Recommended services",
    generates_chart: "academic_fluency_trends",
    priority: "critical"
  },
  {
    doc_type: "504 Plan",
    category: "Education",
    keywords: ["504 Plan", "Section 504", "Accommodation Plan"],
    expected_data: "List of accommodations, Support services, Implementation guidelines",
    priority: "high"
  },
  {
    doc_type: "Psychoeducational Evaluation",
    category: "Education",
    keywords: ["Psychoeducational", "Psych Ed Evaluation", "Cognitive Assessment"],
    expected_data: "IQ scores, Processing speed, Working memory, Achievement test results",
    generates_chart: "academic_fluency_trends",
    priority: "high"
  },
  {
    doc_type: "Transition Plan",
    category: "Education",
    keywords: ["Transition Plan", "Post-Secondary Goals", "Transition Services"],
    expected_data: "Post-secondary education goals, Employment goals, Independent living skills",
    priority: "medium"
  },
  {
    doc_type: "Prior Written Notice (PWN)",
    category: "Education",
    keywords: ["Prior Written Notice", "PWN", "Notice of Action"],
    expected_data: "Proposed or refused actions, Reasons for decision, Procedural safeguards",
    priority: "low"
  },
  {
    doc_type: "Teacher Progress Notes",
    category: "Education",
    keywords: ["Teacher Notes", "Daily Notes", "Classroom Observations"],
    expected_data: "Daily behavior observations, Academic performance, Social interactions",
    priority: "medium"
  },
  {
    doc_type: "Attendance Record",
    category: "Education",
    keywords: ["Attendance", "Absence Record", "School Attendance"],
    expected_data: "Dates of absences, Attendance percentage, Patterns",
    priority: "low"
  },
  {
    doc_type: "Standardized Test Results",
    category: "Education",
    keywords: ["Standardized Test", "State Testing", "Achievement Test", "MAP", "STAR"],
    expected_data: "Scaled scores, Percentile ranks, Grade equivalents, Growth metrics",
    generates_chart: "academic_fluency_trends",
    priority: "high"
  },

  // Medical Documents
  {
    doc_type: "Neuropsychological Evaluation",
    category: "Medical",
    keywords: ["Neuropsychological", "Neuropsych Evaluation", "Cognitive Testing"],
    expected_data: "IQ, Memory scores, Executive functioning, Attention/concentration, Processing speed",
    generates_chart: "academic_fluency_trends",
    priority: "critical"
  },
  {
    doc_type: "Psychiatric Evaluation",
    category: "Medical",
    keywords: ["Psychiatric Evaluation", "Mental Health Assessment", "Psych Evaluation"],
    expected_data: "Diagnoses (DSM codes), Medication recommendations, Behavioral observations",
    priority: "critical"
  },
  {
    doc_type: "Medical Records Summary",
    category: "Medical",
    keywords: ["Medical Records", "Medical History", "Health Summary"],
    expected_data: "Diagnoses, Medications, Allergies, Medical history",
    priority: "high"
  },
  {
    doc_type: "Medication List",
    category: "Medical",
    keywords: ["Medication List", "Prescription List", "Current Medications"],
    expected_data: "Drug names, Dosages, Frequencies, Start dates, Purpose",
    priority: "medium"
  },
  {
    doc_type: "Lab Results",
    category: "Medical",
    keywords: ["Lab Results", "Blood Work", "Laboratory Report"],
    expected_data: "Test names, Values, Reference ranges, Abnormal flags",
    priority: "medium"
  },
  {
    doc_type: "Genetic Testing Results",
    category: "Medical",
    keywords: ["Genetic Test", "DNA Test", "Chromosomal Analysis", "Microarray"],
    expected_data: "Genetic variants, Syndrome identification, Clinical significance",
    priority: "high"
  },
  {
    doc_type: "Developmental Pediatrician Notes",
    category: "Medical",
    keywords: ["Developmental Pediatrician", "Dev Ped", "Pediatric Notes"],
    expected_data: "Developmental milestones, Diagnoses, Recommendations, Referrals",
    priority: "high"
  },
  {
    doc_type: "Neurology Report",
    category: "Medical",
    keywords: ["Neurology", "Neurologist", "Seizure Disorder", "EEG"],
    expected_data: "Neurological findings, EEG results, Medication adjustments",
    priority: "high"
  },
  {
    doc_type: "Allergy Test Results",
    category: "Medical",
    keywords: ["Allergy Test", "Allergen Panel", "Skin Prick Test"],
    expected_data: "Allergens identified, Severity levels, Avoidance recommendations",
    priority: "medium"
  },
  {
    doc_type: "Vision/Hearing Screening",
    category: "Medical",
    keywords: ["Vision Screening", "Hearing Test", "Audiogram", "Visual Acuity"],
    expected_data: "Test results, Pass/fail status, Recommendations for follow-up",
    priority: "medium"
  },
  {
    doc_type: "Immunization Record",
    category: "Medical",
    keywords: ["Immunization", "Vaccination Record", "Shot Record"],
    expected_data: "Vaccine names, Dates administered, Next due dates",
    priority: "low"
  },
  {
    doc_type: "Sleep Study Results",
    category: "Medical",
    keywords: ["Sleep Study", "Polysomnography", "Sleep Apnea Test"],
    expected_data: "AHI score, Sleep stages, Oxygen saturation, Recommendations",
    priority: "medium"
  },
  {
    doc_type: "Hospital Discharge Summary",
    category: "Medical",
    keywords: ["Discharge Summary", "Hospital Summary", "Admission Summary"],
    expected_data: "Admission reason, Procedures performed, Discharge diagnosis, Follow-up plan",
    priority: "high"
  },
  {
    doc_type: "Specialist Consultation",
    category: "Medical",
    keywords: ["Specialist Consult", "Referral Report", "Specialist Report"],
    expected_data: "Consultation reason, Findings, Diagnoses, Treatment recommendations",
    priority: "medium"
  },
  {
    doc_type: "Insurance Authorization",
    category: "Medical",
    keywords: ["Insurance Authorization", "Prior Auth", "Coverage Letter"],
    expected_data: "Approved services, Authorization dates, Coverage limits",
    priority: "low"
  },

  // Therapy Documents
  {
    doc_type: "Speech-Language Evaluation",
    category: "Therapy",
    keywords: ["Speech Evaluation", "Language Evaluation", "SLP Evaluation", "Speech Therapy Eval"],
    expected_data: "Articulation scores, Language scores, Pragmatic skills, Recommended frequency/duration",
    generates_chart: "iep_goal_service_tracker",
    priority: "high"
  },
  {
    doc_type: "Speech Therapy Progress Notes",
    category: "Therapy",
    keywords: ["Speech Therapy Notes", "SLP Notes", "Speech Progress"],
    expected_data: "Goals addressed, Data collected, Progress observations, Next steps",
    generates_chart: "iep_goal_service_tracker",
    priority: "medium"
  },
  {
    doc_type: "Occupational Therapy Evaluation",
    category: "Therapy",
    keywords: ["OT Evaluation", "Occupational Therapy Eval", "Fine Motor Assessment"],
    expected_data: "Fine motor skills, Sensory processing, ADL skills, Recommended services",
    generates_chart: "sensory_profile_heatmap",
    priority: "high"
  },
  {
    doc_type: "OT Progress Notes",
    category: "Therapy",
    keywords: ["OT Notes", "Occupational Therapy Notes", "OT Progress"],
    expected_data: "Goals addressed, Skill development, Sensory strategies used",
    generates_chart: "sensory_profile_heatmap",
    priority: "medium"
  },
  {
    doc_type: "Physical Therapy Evaluation",
    category: "Therapy",
    keywords: ["PT Evaluation", "Physical Therapy Eval", "Gross Motor Assessment"],
    expected_data: "Gross motor skills, Strength, Range of motion, Gait analysis",
    priority: "high"
  },
  {
    doc_type: "PT Progress Report",
    category: "Therapy",
    keywords: ["PT Progress", "Physical Therapy Progress", "PT Notes"],
    expected_data: "Goal progress, Functional mobility, Exercise compliance",
    priority: "medium"
  },
  {
    doc_type: "ABA Therapy Data Sheets",
    category: "Therapy",
    keywords: ["ABA Data", "Behavior Data Sheet", "Discrete Trial Data", "ABA Session Notes"],
    expected_data: "Target behaviors, Trial-by-trial data, Mastery percentages, Prompt levels",
    generates_chart: "behavior_function_analysis",
    priority: "high"
  },
  {
    doc_type: "ABA Progress Report",
    category: "Therapy",
    keywords: ["ABA Progress", "Behavior Analyst Report", "BCBA Report"],
    expected_data: "Skill acquisition, Behavior reduction data, Revised goals",
    generates_chart: "behavior_function_analysis",
    priority: "high"
  },
  {
    doc_type: "Counseling/Therapy Notes",
    category: "Therapy",
    keywords: ["Counseling Notes", "Therapy Session", "Mental Health Therapy"],
    expected_data: "Session focus, Coping strategies discussed, Progress notes",
    priority: "medium"
  },
  {
    doc_type: "Social Skills Group Report",
    category: "Therapy",
    keywords: ["Social Skills Group", "Social Group", "Peer Interaction Group"],
    expected_data: "Social interaction observations, Peer relationships, Skills practiced",
    generates_chart: "social_interaction_funnel",
    priority: "medium"
  },

  // Behavioral Documents
  {
    doc_type: "Functional Behavior Assessment (FBA)",
    category: "Behavioral",
    keywords: ["Functional Behavior Assessment", "FBA", "function of behavior", "ABC data", "antecedent", "consequence"],
    expected_data: "Target behaviors, Hypothesized functions (Escape, Attention, Tangible, Sensory), Antecedent-Behavior-Consequence (ABC) data, Baseline frequency/duration",
    generates_chart: "behavior_function_analysis",
    priority: "critical"
  },
  {
    doc_type: "Behavior Intervention Plan (BIP)",
    category: "Behavioral",
    keywords: ["Behavior Intervention Plan", "BIP", "intervention strategies", "replacement behavior"],
    expected_data: "Target behaviors, Replacement behaviors, Intervention strategies, Data collection methods, Success criteria",
    generates_chart: "intervention_effectiveness",
    priority: "critical"
  },
  {
    doc_type: "Incident Reports",
    category: "Behavioral",
    keywords: ["Incident Report", "Behavior Incident", "Disciplinary Report"],
    expected_data: "Incident date/time, Behavior description, Triggers, Consequences, Staff involved",
    priority: "high"
  },
  {
    doc_type: "ABC Data Collection Sheets",
    category: "Behavioral",
    keywords: ["ABC Data", "Antecedent Behavior Consequence", "Behavior Log"],
    expected_data: "Antecedents, Behaviors, Consequences, Time stamps, Settings",
    generates_chart: "behavior_function_analysis",
    priority: "high"
  },
  {
    doc_type: "Behavior Tracking Chart",
    category: "Behavioral",
    keywords: ["Behavior Chart", "Behavior Tracking", "Frequency Data"],
    expected_data: "Behavior counts, Durations, Daily/weekly trends",
    generates_chart: "behavior_function_analysis",
    priority: "medium"
  },
  {
    doc_type: "Sensory Profile",
    category: "Behavioral",
    keywords: ["Sensory Profile", "Sensory Processing", "Sensory Assessment"],
    expected_data: "Sensory seeking/avoiding behaviors, Modulation patterns, Recommended strategies",
    generates_chart: "sensory_profile_heatmap",
    priority: "high"
  },
  {
    doc_type: "Crisis Plan",
    category: "Behavioral",
    keywords: ["Crisis Plan", "Safety Plan", "Emergency Behavior Plan"],
    expected_data: "Crisis triggers, De-escalation strategies, Emergency contacts",
    priority: "high"
  },
  {
    doc_type: "Social-Emotional Assessment",
    category: "Behavioral",
    keywords: ["Social Emotional", "SEL Assessment", "Emotional Regulation"],
    expected_data: "Social skills scores, Emotional regulation, Behavioral concerns",
    generates_chart: "social_interaction_funnel",
    priority: "medium"
  },

  // Legal/Administrative Documents
  {
    doc_type: "Independent Educational Evaluation (IEE) Request",
    category: "Legal",
    keywords: ["IEE", "Independent Evaluation", "IEE Request"],
    expected_data: "Areas of disagreement, Requested evaluation types, Timelines",
    priority: "high"
  },
  {
    doc_type: "Due Process Complaint",
    category: "Legal",
    keywords: ["Due Process", "Complaint Notice", "IDEA Complaint"],
    expected_data: "Dispute details, Requested remedies, Timeline of events",
    priority: "high"
  },
  {
    doc_type: "Manifestation Determination Review",
    category: "Legal",
    keywords: ["Manifestation Determination", "MDR", "Disciplinary Review"],
    expected_data: "Incident description, Relationship to disability determination, Outcome",
    priority: "high"
  },
  {
    doc_type: "Consent Forms",
    category: "Legal",
    keywords: ["Consent Form", "Parental Consent", "Permission to Evaluate"],
    expected_data: "Consent type, Date signed, Services consented to",
    priority: "low"
  },
  {
    doc_type: "Procedural Safeguards Notice",
    category: "Legal",
    keywords: ["Procedural Safeguards", "Parent Rights", "IDEA Rights"],
    expected_data: "Rights outlined, Contact information for advocacy",
    priority: "low"
  },
  {
    doc_type: "Settlement Agreement",
    category: "Legal",
    keywords: ["Settlement", "Resolution Agreement", "Mediation Agreement"],
    expected_data: "Agreed-upon services, Compensatory services, Implementation timeline",
    priority: "high"
  },
  {
    doc_type: "Evaluation Consent",
    category: "Legal",
    keywords: ["Evaluation Consent", "Consent to Test", "Assessment Permission"],
    expected_data: "Evaluation areas, Parental consent status, Evaluation timeline",
    priority: "medium"
  },
  {
    doc_type: "Guardianship/Custody Papers",
    category: "Legal",
    keywords: ["Guardianship", "Custody", "Legal Guardian"],
    expected_data: "Guardian names, Custody arrangement, Legal authority",
    priority: "medium"
  },

  // Daily Living Documents
  {
    doc_type: "Sleep Log",
    category: "Daily Living",
    keywords: ["Sleep Log", "Sleep Diary", "Bedtime Routine"],
    expected_data: "Bedtime, Wake time, Total sleep hours, Night wakings, Sleep quality",
    priority: "medium"
  },
  {
    doc_type: "Food Diary/Nutrition Log",
    category: "Daily Living",
    keywords: ["Food Diary", "Meal Log", "Nutrition Tracker"],
    expected_data: "Foods eaten, Times, Portions, Reactions",
    priority: "medium"
  },
  {
    doc_type: "Medication Log",
    category: "Daily Living",
    keywords: ["Medication Log", "Med Tracker", "Dose Record"],
    expected_data: "Medications given, Dosages, Times, Missed doses, Side effects",
    priority: "medium"
  },
  {
    doc_type: "Daily Schedule/Visual Schedule",
    category: "Daily Living",
    keywords: ["Daily Schedule", "Visual Schedule", "Routine Chart"],
    expected_data: "Daily activities, Time blocks, Visual supports used",
    priority: "low"
  },
  {
    doc_type: "Communication Log (Parent-Teacher)",
    category: "Daily Living",
    keywords: ["Communication Log", "Home-School Log", "Daily Notes"],
    expected_data: "Messages exchanged, Behavioral notes, Academic updates",
    priority: "medium"
  },
  {
    doc_type: "Seizure Log",
    category: "Daily Living",
    keywords: ["Seizure Log", "Seizure Diary", "Epilepsy Tracker"],
    expected_data: "Seizure dates/times, Duration, Type, Triggers, Recovery time",
    priority: "high"
  },
  {
    doc_type: "Toileting/Bathroom Log",
    category: "Daily Living",
    keywords: ["Toileting Log", "Bathroom Chart", "Potty Training"],
    expected_data: "Successful attempts, Accidents, Times, Patterns",
    priority: "low"
  },
  {
    doc_type: "Activity Preferences Inventory",
    category: "Daily Living",
    keywords: ["Preferences", "Interests Inventory", "Reinforcer Survey"],
    expected_data: "Preferred activities, Motivators, Dislikes",
    priority: "low"
  },
];

// Helper function to match document to type
export function identifyDocumentType(text: string): DocumentType | null {
  const lowerText = text.toLowerCase();
  
  // Sort by priority (critical first) to match most important docs first
  const sortedMatrix = [...DOCUMENT_INTELLIGENCE_MATRIX].sort((a, b) => {
    const priorities = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorities[a.priority] - priorities[b.priority];
  });
  
  for (const docType of sortedMatrix) {
    // Check if any keywords match
    const matchCount = docType.keywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    ).length;
    
    // Require at least 2 keyword matches for high confidence
    if (matchCount >= 2) {
      return docType;
    }
  }
  
  // Fallback: check for single keyword match on critical/high priority docs
  for (const docType of sortedMatrix.filter(d => d.priority === 'critical' || d.priority === 'high')) {
    const hasMatch = docType.keywords.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      return docType;
    }
  }
  
  return null;
}
