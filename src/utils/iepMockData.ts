/**
 * Comprehensive IEP Mock Data for Jace Mills
 * Based on standard IEP form structure with full dataset for testing
 */

export interface IEPMockData {
  // Step 1: Student Profile
  studentProfile: {
    firstName: string;
    lastName: string;
    studentId: string;
    dateOfBirth: string;
    grade: string;
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  
  // Step 2: Jurisdiction & Consent
  jurisdictionConsent: {
    jurisdiction: 'US_IDEA' | 'IE_EPSEN';
    consentDate: string;
    meetingDate: string;
    reviewDueDate: string;
    consentGiven: boolean;
    parentSignature: string;
    interpreterNeeded: boolean;
    language: string;
  };
  
  // Step 3: Concerns & Referral
  concernsReferral: {
    primaryConcerns: string[];
    referralReason: string;
    referralDate: string;
    referredBy: string;
    previousInterventions: string[];
    parentConcerns: string;
  };
  
  // Step 4: Screening & Eligibility
  screeningEligibility: {
    disabilityCategory: string;
    eligibilityDate: string;
    evaluationSummary: string;
    meetsCriteria: boolean;
    assessmentsUsed: string[];
    evaluators: string[];
  };
  
  // Step 5: Present Levels (PLAAFP)
  presentLevels: {
    academic: {
      strengths: string[];
      needs: string[];
      currentPerformance: string;
    };
    functional: {
      strengths: string[];
      needs: string[];
      currentPerformance: string;
    };
    behavioral: {
      strengths: string[];
      needs: string[];
      currentPerformance: string;
    };
    impactStatement: string;
  };
  
  // Step 6: Goals & Objectives
  goalsObjectives: {
    goals: Array<{
      id: string;
      area: string;
      description: string;
      measurable: string;
      timeline: string;
      criteria: string;
      method: string;
      shortTermObjectives: Array<{
        id: string;
        description: string;
        timeline: string;
        criteria: string;
      }>;
    }>;
  };
  
  // Step 7: Services & Supports
  servicesSupports: {
    specialEducationServices: Array<{
      service: string;
      provider: string;
      frequency: string;
      duration: string;
      location: string;
      startDate: string;
    }>;
    relatedServices: Array<{
      service: string;
      provider: string;
      frequency: string;
      duration: string;
      location: string;
      startDate: string;
    }>;
    supplementaryAids: string[];
  };
  
  // Step 8: LRE & Placement
  lrePlacement: {
    placement: string;
    justification: string;
    timeOutsideGenEd: string;
    removalJustification: string;
    alternativesConsidered: string[];
  };
  
  // Step 9: Transition Planning
  transitionPlanning: {
    postSecondaryGoals: {
      education: string;
      employment: string;
      livingSkills: string;
    };
    transitionServices: string[];
    agencies: string[];
    coursework: string[];
  };
  
  // Step 10: Assessment Participation
  assessmentParticipation: {
    stateAssessments: Array<{
      name: string;
      participates: boolean;
      accommodations: string[];
      alternativeAssessment: boolean;
    }>;
  };
  
  // Step 11: Parent & Student Input
  parentStudentInput: {
    parentPriorities: string[];
    studentVoice: string;
    parentConcerns: string;
    studentGoals: string[];
    culturalConsiderations: string;
  };
  
  // Step 12: Progress Monitoring
  progressMonitoring: {
    reportingMethod: string;
    reportingFrequency: string;
    dataCollection: string[];
    responsiblePersons: string[];
    parentNotification: string;
  };
  
  // Step 13: Review & Finalize
  reviewFinalize: {
    teamMembers: Array<{
      name: string;
      role: string;
      signature: string;
      date: string;
    }>;
    nextReviewDate: string;
    distributionList: string[];
    additionalNotes: string;
  };
}

export const jaceMillsMockData: IEPMockData = {
  studentProfile: {
    firstName: "Jace",
    lastName: "Mills",
    studentId: "123456",
    dateOfBirth: "2012-12-30",
    grade: "7",
    parentName: "Contact - 5034223821",
    parentEmail: "jashon@fpkuniversity.com",
    parentPhone: "5034223821",
    address: "123 Main Street, Portland, OR 97201",
    emergencyContact: "Contact - 5034223821",
    emergencyPhone: "5034223821"
  },
  
  jurisdictionConsent: {
    jurisdiction: 'US_IDEA',
    consentDate: "2025-09-15",
    meetingDate: "2025-09-20",
    reviewDueDate: "2026-09-19",
    consentGiven: true,
    parentSignature: "Contact - 5034223821",
    interpreterNeeded: false,
    language: "English"
  },
  
  concernsReferral: {
    primaryConcerns: [
      "Reading comprehension below grade level",
      "Written expression difficulties",
      "Task completion challenges",
      "Organizational skills"
    ],
    referralReason: "Student demonstrates significant difficulties with reading comprehension and written expression that impact academic performance across curriculum areas.",
    referralDate: "2025-08-15",
    referredBy: "General Education Teacher - Ms. Johnson",
    previousInterventions: [
      "Small group reading intervention (6 months)",
      "Peer tutoring program",
      "Extended time on assignments",
      "Graphic organizers for writing"
    ],
    parentConcerns: "Jace becomes frustrated with homework and often needs significant support to complete reading and writing tasks."
  },
  
  screeningEligibility: {
    disabilityCategory: "Specific Learning Disability (SLD) in Reading Comprehension and Written Expression",
    eligibilityDate: "2025-09-10",
    evaluationSummary: "Comprehensive evaluation indicates significant discrepancy between intellectual ability and academic achievement in reading and writing. Processing speed and working memory weaknesses impact academic performance.",
    meetsCriteria: true,
    assessmentsUsed: [
      "WIAT-4 (Academic Achievement)",
      "WISC-V (Cognitive Assessment)", 
      "Classroom observations",
      "Curriculum-based measurements",
      "Work samples analysis"
    ],
    evaluators: [
      "School Psychologist - Dr. Smith",
      "Learning Specialist - Mrs. Davis",
      "General Education Teacher - Ms. Johnson"
    ]
  },
  
  presentLevels: {
    academic: {
      strengths: [
        "Strong foundational math skills",
        "Good oral communication abilities",
        "Excellent problem-solving skills in mathematics",
        "Helpful and collaborative with peers"
      ],
      needs: [
        "Reading fluency and comprehension",
        "Written expression and organization",
        "Spelling and sentence structure",
        "Independent task completion"
      ],
      currentPerformance: "Jace demonstrates strong foundational math skills but struggles significantly with reading comprehension and written assignments. His reading fluency is below grade level, which impacts his ability to understand complex texts. In writing, he struggles with organizing his thoughts, spelling, and sentence structure."
    },
    functional: {
      strengths: [
        "Well-developed peer relationships",
        "Strong motivation in preferred subjects",
        "Good attendance and punctuality",
        "Responds well to structured environments"
      ],
      needs: [
        "Organization and time management",
        "Task initiation strategies",
        "Self-advocacy skills",
        "Frustration tolerance for challenging tasks"
      ],
      currentPerformance: "Jace is generally well-behaved and cooperative in class. He benefits from a structured environment and can become frustrated and withdrawn when given open-ended tasks or long reading assignments."
    },
    behavioral: {
      strengths: [
        "Cooperative and well-behaved",
        "Strong peer relationships",
        "Willing to help classmates",
        "Generally positive attitude"
      ],
      needs: [
        "Coping strategies for frustration",
        "Confidence in challenging academic areas",
        "Persistence with difficult tasks",
        "Self-regulation during independent work"
      ],
      currentPerformance: "Jace exhibits appropriate classroom behavior and maintains positive relationships with peers and teachers. He may become withdrawn or avoidant when faced with challenging reading or writing tasks."
    },
    impactStatement: "Jace's SLD directly affects his ability to access and progress in the general education curriculum, particularly in subjects like Social Studies and English Language Arts (ELA). It limits his independent completion of homework and tests that require reading or writing."
  },
  
  goalsObjectives: {
    goals: [
      {
        id: "goal1",
        area: "Reading Comprehension",
        description: "By September 2026, Jace will increase his reading comprehension of grade-level informational text from 65% to 80% accuracy as measured by curriculum-based assessments and teacher-created rubrics.",
        measurable: "80% accuracy on curriculum-based assessments",
        timeline: "September 2026",
        criteria: "4 out of 5 consecutive assessments",
        method: "Curriculum-based assessments and teacher-created rubrics",
        shortTermObjectives: [
          {
            id: "obj1a",
            description: "Jace will identify the main idea of a text with 75% accuracy",
            timeline: "January 2026",
            criteria: "3 out of 4 consecutive trials"
          },
          {
            id: "obj1b", 
            description: "Jace will use a graphic organizer to summarize a non-fiction text with 80% accuracy",
            timeline: "June 2026",
            criteria: "4 out of 5 consecutive assignments"
          }
        ]
      },
      {
        id: "goal2",
        area: "Written Expression",
        description: "By September 2026, Jace will write a five-paragraph persuasive essay with a clear introduction, body, and conclusion, earning a score of 3 out of 4 on a writing rubric.",
        measurable: "Score of 3 out of 4 on writing rubric",
        timeline: "September 2026", 
        criteria: "3 out of 4 consecutive writing samples",
        method: "Standardized writing rubric assessment",
        shortTermObjectives: [
          {
            id: "obj2a",
            description: "Jace will use a pre-writing organizer to outline his thoughts before writing with 90% fidelity",
            timeline: "January 2026", 
            criteria: "9 out of 10 writing assignments"
          },
          {
            id: "obj2b",
            description: "Jace will correctly use sentence variety and punctuation in his writing with 80% accuracy", 
            timeline: "June 2026",
            criteria: "4 out of 5 consecutive writing samples"
          }
        ]
      }
    ]
  },
  
  servicesSupports: {
    specialEducationServices: [
      {
        service: "Specialized Academic Instruction (SAI) - Reading",
        provider: "Resource Specialist",
        frequency: "3 times per week",
        duration: "45 minutes",
        location: "Resource Room",
        startDate: "2025-10-01"
      },
      {
        service: "Specialized Academic Instruction (SAI) - Writing", 
        provider: "Resource Specialist",
        frequency: "2 times per week",
        duration: "30 minutes", 
        location: "Resource Room",
        startDate: "2025-10-01"
      }
    ],
    relatedServices: [
      {
        service: "Speech and Language Therapy",
        provider: "Speech-Language Pathologist",
        frequency: "1 time per week",
        duration: "30 minutes",
        location: "Therapy Room",
        startDate: "2025-10-01"
      }
    ],
    supplementaryAids: [
      "Assistive technology (word processor with spell checker)",
      "Graphic organizers",
      "Visual cues and simplified instructions",
      "Preferential seating",
      "Check-in/check-out system with case manager"
    ]
  },
  
  lrePlacement: {
    placement: "General education classroom with resource room support",
    justification: "Jace benefits from interaction with typical peers and can access grade-level curriculum with appropriate supports and accommodations.",
    timeOutsideGenEd: "5.5 hours per week (SAI services)",
    removalJustification: "Specialized instruction in reading and writing requires intensive, individualized support best provided in resource room setting.",
    alternativesConsidered: [
      "Full inclusion with co-teaching model",
      "Consultation model only", 
      "Self-contained special education classroom"
    ]
  },
  
  transitionPlanning: {
    postSecondaryGoals: {
      education: "Jace will explore vocational training programs or community college options related to computer technology.",
      employment: "Jace will develop job readiness skills and explore technology-related career paths.",
      livingSkills: "Jace will develop independent living skills including self-advocacy and organizational strategies."
    },
    transitionServices: [
      "Career exploration class",
      "Counseling services for post-secondary planning",
      "Self-advocacy skills training",
      "Job shadowing opportunities"
    ],
    agencies: [
      "Department of Vocational Rehabilitation",
      "Community college disability services", 
      "Local technology training programs"
    ],
    coursework: [
      "Computer applications courses",
      "Career exploration elective",
      "Self-advocacy and study skills course"
    ]
  },
  
  assessmentParticipation: {
    stateAssessments: [
      {
        name: "State English Language Arts Assessment",
        participates: true,
        accommodations: [
          "Extended time (1.5x)",
          "Read-aloud of questions (excluding reading passages)",
          "Use of word processor for written responses",
          "Small group setting"
        ],
        alternativeAssessment: false
      },
      {
        name: "State Mathematics Assessment", 
        participates: true,
        accommodations: [
          "Extended time (1.5x)",
          "Read-aloud of questions",
          "Use of calculator on non-calculator sections",
          "Small group setting"
        ],
        alternativeAssessment: false
      },
      {
        name: "State Science Assessment",
        participates: true, 
        accommodations: [
          "Extended time (1.5x)",
          "Read-aloud of questions",
          "Use of word processor for written responses"
        ],
        alternativeAssessment: false
      }
    ]
  },
  
  parentStudentInput: {
    parentPriorities: [
      "Improved reading confidence and skills",
      "Better organization and study habits", 
      "Increased independence with homework",
      "Preparation for high school transition"
    ],
    studentVoice: "Jace expresses frustration with reading and writing tasks but is motivated to improve. He enjoys working with computers and is interested in technology careers.",
    parentConcerns: "Parents are concerned about Jace's self-confidence and worry about his preparation for high school academics.",
    studentGoals: [
      "Get better at reading",
      "Learn to organize my work better",
      "Feel more confident in school",
      "Learn about computer jobs"
    ],
    culturalConsiderations: "Family values education highly and is committed to supporting Jace's academic growth. No cultural or linguistic considerations noted."
  },
  
  progressMonitoring: {
    reportingMethod: "Written progress reports and data sheets",
    reportingFrequency: "Every 6 weeks (quarterly)", 
    dataCollection: [
      "Curriculum-based measurement probes",
      "Work sample analysis", 
      "Teacher observation checklists",
      "Standardized assessment scores"
    ],
    responsiblePersons: [
      "Resource Specialist - Primary responsibility",
      "General Education Teacher - Data contribution",
      "Speech-Language Pathologist - Related services data"
    ],
    parentNotification: "Progress reports sent home every 6 weeks with phone conference offered as needed."
  },
  
  reviewFinalize: {
    teamMembers: [
      {
        name: "Contact - 5034223821",
        role: "Parent/Guardian",
        signature: "Contact - 5034223821", 
        date: "2025-09-20"
      },
      {
        name: "Jace Mills",
        role: "Student",
        signature: "Jace Mills",
        date: "2025-09-20"
      },
      {
        name: "Ms. Johnson",
        role: "General Education Teacher", 
        signature: "Ms. Johnson",
        date: "2025-09-20"
      },
      {
        name: "Mrs. Davis",
        role: "Resource Specialist/Case Manager",
        signature: "Mrs. Davis", 
        date: "2025-09-20"
      },
      {
        name: "Dr. Smith", 
        role: "School Psychologist",
        signature: "Dr. Smith",
        date: "2025-09-20"
      },
      {
        name: "Mr. Wilson",
        role: "Speech-Language Pathologist",
        signature: "Mr. Wilson",
        date: "2025-09-20"
      }
    ],
    nextReviewDate: "2026-09-19",
    distributionList: [
      "Parent/Guardian",
      "Student file",
      "General education teachers",
      "Resource specialist", 
      "Special education coordinator"
    ],
    additionalNotes: "Team agrees that Jace shows potential for significant improvement with consistent implementation of supports and services. Regular communication between home and school will be maintained."
  }
};

/**
 * Maps comprehensive IEP mock data to the wizard form structure
 */
export function mapMockDataToIEPWizard(mockData: IEPMockData): Record<number, any> {
  return {
    1: { // Student Profile
      ...mockData.studentProfile
    },
    2: { // Jurisdiction & Consent
      ...mockData.jurisdictionConsent
    },
    3: { // Concerns & Referral  
      ...mockData.concernsReferral
    },
    4: { // Screening & Eligibility
      ...mockData.screeningEligibility
    },
    5: { // Present Levels
      ...mockData.presentLevels
    },
    6: { // Goals & Objectives
      ...mockData.goalsObjectives
    },
    7: { // Services & Supports
      ...mockData.servicesSupports
    },
    8: { // LRE & Placement
      ...mockData.lrePlacement  
    },
    9: { // Transition Planning
      ...mockData.transitionPlanning
    },
    10: { // Assessment Participation
      ...mockData.assessmentParticipation
    },
    11: { // Parent & Student Input
      ...mockData.parentStudentInput
    },
    12: { // Progress Monitoring  
      ...mockData.progressMonitoring
    },
    13: { // Review & Finalize
      ...mockData.reviewFinalize
    }
  };
}