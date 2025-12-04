export interface ClientDocumentType {
  doc_type: string;
  category: 'Education' | 'Medical' | 'Therapy' | 'Legal' | 'Behavioral' | 'Daily Living';
  expected_data: string;
  generates_chart?: string;
}

export const DOCUMENT_TYPES_FOR_CLIENT: ClientDocumentType[] = [
  // Education Documents
  { doc_type: "Individualized Education Program (IEP)", category: "Education", expected_data: "Goals (with baseline/current/target values), Services (minutes/frequency), Accommodations, Modifications, Present Levels of Performance (PLOP)", generates_chart: "iep_goal_service_tracker" },
  { doc_type: "IEP Amendment", category: "Education", expected_data: "Updated goals, Changed services or accommodations, Reasons for amendment", generates_chart: "iep_goal_service_tracker" },
  { doc_type: "Progress Report", category: "Education", expected_data: "Goal progress percentages, Current performance levels, Areas of growth", generates_chart: "iep_goal_service_tracker" },
  { doc_type: "Report Card", category: "Education", expected_data: "Letter grades, Subject-specific scores, Teacher comments, Academic trends", generates_chart: "academic_fluency_trends" },
  { doc_type: "Evaluation Team Report (ETR)", category: "Education", expected_data: "Cognitive scores, Academic achievement levels, Areas of need, Recommended services", generates_chart: "academic_fluency_trends" },
  { doc_type: "504 Plan", category: "Education", expected_data: "List of accommodations, Support services, Implementation guidelines" },
  { doc_type: "Psychoeducational Evaluation", category: "Education", expected_data: "IQ scores, Processing speed, Working memory, Achievement test results", generates_chart: "academic_fluency_trends" },
  { doc_type: "Transition Plan", category: "Education", expected_data: "Post-secondary education goals, Employment goals, Independent living skills" },
  { doc_type: "Prior Written Notice (PWN)", category: "Education", expected_data: "Proposed or refused actions, Reasons for decision, Procedural safeguards" },
  { doc_type: "Teacher Progress Notes", category: "Education", expected_data: "Daily behavior observations, Academic performance, Social interactions" },
  { doc_type: "Attendance Record", category: "Education", expected_data: "Dates of absences, Attendance percentage, Patterns" },
  { doc_type: "Standardized Test Results", category: "Education", expected_data: "Scaled scores, Percentile ranks, Grade equivalents, Growth metrics", generates_chart: "academic_fluency_trends" },

  // Medical Documents
  { doc_type: "Neuropsychological Evaluation", category: "Medical", expected_data: "IQ, Memory scores, Executive functioning, Attention/concentration, Processing speed", generates_chart: "academic_fluency_trends" },
  { doc_type: "Psychiatric Evaluation", category: "Medical", expected_data: "Diagnoses (DSM codes), Medication recommendations, Behavioral observations" },
  { doc_type: "Medical Records Summary", category: "Medical", expected_data: "Diagnoses, Medications, Allergies, Medical history" },
  { doc_type: "Medication List", category: "Medical", expected_data: "Drug names, Dosages, Frequencies, Start dates, Purpose" },
  { doc_type: "Lab Results", category: "Medical", expected_data: "Test names, Values, Reference ranges, Abnormal flags" },
  { doc_type: "Genetic Testing Results", category: "Medical", expected_data: "Genetic variants, Syndrome identification, Clinical significance" },
  { doc_type: "Developmental Pediatrician Notes", category: "Medical", expected_data: "Developmental milestones, Diagnoses, Recommendations, Referrals" },
  { doc_type: "Neurology Report", category: "Medical", expected_data: "Neurological findings, EEG results, Medication adjustments" },
  { doc_type: "Allergy Test Results", category: "Medical", expected_data: "Allergens identified, Severity levels, Avoidance recommendations" },
  { doc_type: "Vision/Hearing Screening", category: "Medical", expected_data: "Test results, Pass/fail status, Recommendations for follow-up" },
  { doc_type: "Immunization Record", category: "Medical", expected_data: "Vaccine names, Dates administered, Next due dates" },
  { doc_type: "Sleep Study Results", category: "Medical", expected_data: "AHI score, Sleep stages, Oxygen saturation, Recommendations" },
  { doc_type: "Hospital Discharge Summary", category: "Medical", expected_data: "Admission reason, Procedures performed, Discharge diagnosis, Follow-up plan" },
  { doc_type: "Specialist Consultation", category: "Medical", expected_data: "Consultation reason, Findings, Diagnoses, Treatment recommendations" },
  { doc_type: "Insurance Authorization", category: "Medical", expected_data: "Approved services, Authorization dates, Coverage limits" },

  // Therapy Documents
  { doc_type: "Speech-Language Evaluation", category: "Therapy", expected_data: "Articulation scores, Language scores, Pragmatic skills, Recommended frequency/duration", generates_chart: "iep_goal_service_tracker" },
  { doc_type: "Speech Therapy Progress Notes", category: "Therapy", expected_data: "Goals addressed, Data collected, Progress observations, Next steps", generates_chart: "iep_goal_service_tracker" },
  { doc_type: "Occupational Therapy Evaluation", category: "Therapy", expected_data: "Fine motor skills, Sensory processing, ADL skills, Recommended services", generates_chart: "sensory_profile_heatmap" },
  { doc_type: "OT Progress Notes", category: "Therapy", expected_data: "Goals addressed, Skill development, Sensory strategies used", generates_chart: "sensory_profile_heatmap" },
  { doc_type: "Physical Therapy Evaluation", category: "Therapy", expected_data: "Gross motor skills, Strength, Range of motion, Gait analysis" },
  { doc_type: "PT Progress Report", category: "Therapy", expected_data: "Goal progress, Functional mobility, Exercise compliance" },
  { doc_type: "ABA Therapy Data Sheets", category: "Therapy", expected_data: "Target behaviors, Trial-by-trial data, Mastery percentages, Prompt levels", generates_chart: "behavior_function_analysis" },
  { doc_type: "ABA Progress Report", category: "Therapy", expected_data: "Skill acquisition, Behavior reduction data, Revised goals", generates_chart: "behavior_function_analysis" },
  { doc_type: "Counseling/Therapy Notes", category: "Therapy", expected_data: "Session focus, Coping strategies discussed, Progress notes" },
  { doc_type: "Social Skills Group Report", category: "Therapy", expected_data: "Social interaction observations, Peer relationships, Skills practiced", generates_chart: "social_interaction_funnel" },

  // Behavioral Documents
  { doc_type: "Functional Behavior Assessment (FBA)", category: "Behavioral", expected_data: "Target behaviors, Hypothesized functions (Escape, Attention, Tangible, Sensory), ABC data, Baseline frequency/duration", generates_chart: "behavior_function_analysis" },
  { doc_type: "Behavior Intervention Plan (BIP)", category: "Behavioral", expected_data: "Target behaviors, Replacement behaviors, Intervention strategies, Data collection methods, Success criteria", generates_chart: "intervention_effectiveness" },
  { doc_type: "Incident Reports", category: "Behavioral", expected_data: "Incident date/time, Behavior description, Triggers, Consequences, Staff involved" },
  { doc_type: "ABC Data Collection Sheets", category: "Behavioral", expected_data: "Antecedents, Behaviors, Consequences, Time stamps, Settings", generates_chart: "behavior_function_analysis" },
  { doc_type: "Behavior Tracking Chart", category: "Behavioral", expected_data: "Behavior counts, Durations, Daily/weekly trends", generates_chart: "behavior_function_analysis" },
  { doc_type: "Sensory Profile", category: "Behavioral", expected_data: "Sensory seeking/avoiding behaviors, Modulation patterns, Recommended strategies", generates_chart: "sensory_profile_heatmap" },
  { doc_type: "Crisis Plan", category: "Behavioral", expected_data: "Crisis triggers, De-escalation strategies, Emergency contacts" },
  { doc_type: "Social-Emotional Assessment", category: "Behavioral", expected_data: "Social skills scores, Emotional regulation, Behavioral concerns", generates_chart: "social_interaction_funnel" },

  // Legal/Administrative Documents
  { doc_type: "Independent Educational Evaluation (IEE) Request", category: "Legal", expected_data: "Areas of disagreement, Requested evaluation types, Timelines" },
  { doc_type: "Due Process Complaint", category: "Legal", expected_data: "Dispute details, Requested remedies, Timeline of events" },
  { doc_type: "Manifestation Determination Review", category: "Legal", expected_data: "Incident description, Relationship to disability determination, Outcome" },
  { doc_type: "Consent Forms", category: "Legal", expected_data: "Consent type, Date signed, Services consented to" },
  { doc_type: "Procedural Safeguards Notice", category: "Legal", expected_data: "Rights outlined, Contact information for advocacy" },
  { doc_type: "Settlement Agreement", category: "Legal", expected_data: "Agreed-upon services, Compensatory services, Implementation timeline" },
  { doc_type: "Evaluation Consent", category: "Legal", expected_data: "Evaluation areas, Parental consent status, Evaluation timeline" },
  { doc_type: "Guardianship/Custody Papers", category: "Legal", expected_data: "Guardian names, Custody arrangement, Legal authority" },

  // Daily Living Documents
  { doc_type: "Sleep Log", category: "Daily Living", expected_data: "Bedtime, Wake time, Total sleep hours, Night wakings, Sleep quality" },
  { doc_type: "Food Diary/Nutrition Log", category: "Daily Living", expected_data: "Foods eaten, Times, Portions, Reactions" },
  { doc_type: "Medication Log", category: "Daily Living", expected_data: "Medications given, Dosages, Times, Missed doses, Side effects" },
  { doc_type: "Daily Schedule/Visual Schedule", category: "Daily Living", expected_data: "Daily activities, Time blocks, Visual supports used" },
  { doc_type: "Communication Log (Parent-Teacher)", category: "Daily Living", expected_data: "Messages exchanged, Behavioral notes, Academic updates" },
  { doc_type: "Seizure Log", category: "Daily Living", expected_data: "Seizure dates/times, Duration, Type, Triggers, Recovery time" },
  { doc_type: "Toileting/Bathroom Log", category: "Daily Living", expected_data: "Successful attempts, Accidents, Times, Patterns" },
  { doc_type: "Activity Preferences Inventory", category: "Daily Living", expected_data: "Preferred activities, Motivators, Dislikes" },
];
