export interface KBSource {
  name: string;
  baseUrl?: string;
  apiEndpoint?: string;
  requiresApiKey: boolean;
  description: string;
  focusAreas: string[];
  icon?: string;
}

export interface KBSourceCatalog {
  academic_databases: KBSource[];
  clinical_resources: KBSource[];
  institutional_resources: KBSource[];
  specialized_resources: KBSource[];
}

export const KB_SOURCES: KBSourceCatalog = {
  academic_databases: [
    {
      name: 'PubMed',
      apiEndpoint: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',
      requiresApiKey: false,
      description: 'Medical research papers and studies',
      focusAreas: ['research', 'medical', 'scientific'],
      icon: 'FileText'
    },
    {
      name: 'Semantic Scholar',
      apiEndpoint: 'https://api.semanticscholar.org/graph/v1/',
      requiresApiKey: false,
      description: 'AI-powered academic paper search',
      focusAreas: ['research', 'academic', 'scientific'],
      icon: 'GraduationCap'
    },
    {
      name: 'ERIC',
      baseUrl: 'https://eric.ed.gov',
      requiresApiKey: false,
      description: 'Education Resources Information Center - education research library',
      focusAreas: ['education', 'research', 'academic'],
      icon: 'BookOpen'
    },
    {
      name: 'Google Scholar',
      baseUrl: 'https://scholar.google.com',
      requiresApiKey: false,
      description: 'Scholarly literature search across disciplines',
      focusAreas: ['research', 'academic', 'multidisciplinary'],
      icon: 'Search'
    }
  ],
  clinical_resources: [
    {
      name: 'CDC',
      baseUrl: 'https://www.cdc.gov',
      requiresApiKey: false,
      description: 'Centers for Disease Control and Prevention',
      focusAreas: ['autism', 'developmental-disabilities', 'health'],
      icon: 'Activity'
    },
    {
      name: 'IDEA',
      baseUrl: 'https://sites.ed.gov/idea/',
      requiresApiKey: false,
      description: 'Individuals with Disabilities Education Act',
      focusAreas: ['iep', 'special-education', 'policy'],
      icon: 'BookOpen'
    },
    {
      name: 'OSEP',
      baseUrl: 'https://sites.ed.gov/osers/osep/',
      requiresApiKey: false,
      description: 'Office of Special Education Programs',
      focusAreas: ['special-education', 'policy'],
      icon: 'School'
    },
    {
      name: 'WWC',
      baseUrl: 'https://ies.ed.gov/ncee/wwc/',
      requiresApiKey: false,
      description: 'What Works Clearinghouse',
      focusAreas: ['evidence-based', 'education'],
      icon: 'CheckCircle'
    },
    {
      name: 'BACB',
      baseUrl: 'https://www.bacb.com',
      requiresApiKey: false,
      description: 'Behavior Analyst Certification Board',
      focusAreas: ['aba', 'autism', 'behavioral'],
      icon: 'Brain'
    },
    {
      name: 'NAS',
      baseUrl: 'https://www.autism.org.uk',
      requiresApiKey: false,
      description: 'National Autistic Society',
      focusAreas: ['autism', 'support'],
      icon: 'Heart'
    },
    {
      name: 'AAP',
      baseUrl: 'https://www.aap.org',
      requiresApiKey: false,
      description: 'American Academy of Pediatrics',
      focusAreas: ['medical', 'pediatric'],
      icon: 'Stethoscope'
    },
    {
      name: 'CEC',
      baseUrl: 'https://www.cec.sped.org',
      requiresApiKey: false,
      description: 'Council for Exceptional Children',
      focusAreas: ['special-education', 'teaching'],
      icon: 'Users'
    },
    {
      name: 'British Dyslexia Association',
      baseUrl: 'https://www.bdadyslexia.org.uk',
      requiresApiKey: false,
      description: 'UK\'s leading dyslexia organization - assessments and teaching strategies',
      focusAreas: ['dyslexia', 'learning-disabilities', 'education'],
      icon: 'BookMarked'
    },
    {
      name: 'ADHD Foundation UK',
      baseUrl: 'https://www.adhdfoundation.org.uk',
      requiresApiKey: false,
      description: 'Europe\'s largest ADHD charity - training and therapy models',
      focusAreas: ['adhd', 'neurodiversity', 'support'],
      icon: 'Zap'
    },
    {
      name: 'ASHA',
      baseUrl: 'https://www.asha.org',
      requiresApiKey: false,
      description: 'American Speech-Language-Hearing Association - communication disorders',
      focusAreas: ['speech', 'language', 'communication'],
      icon: 'MessageSquare'
    },
    {
      name: 'WFOT',
      baseUrl: 'https://www.wfot.org',
      requiresApiKey: false,
      description: 'World Federation of Occupational Therapists - sensory integration',
      focusAreas: ['occupational-therapy', 'sensory', 'global'],
      icon: 'Globe'
    },
    {
      name: 'Hanen Centre',
      baseUrl: 'https://www.hanen.org',
      requiresApiKey: false,
      description: 'Canadian leader in early childhood language intervention',
      focusAreas: ['language', 'early-intervention', 'autism'],
      icon: 'Baby'
    },
    {
      name: 'Autism CRC',
      baseUrl: 'https://www.autismcrc.com.au',
      requiresApiKey: false,
      description: 'Australia\'s autism research center - community-driven resources',
      focusAreas: ['autism', 'research', 'community'],
      icon: 'Building2'
    }
  ],
  institutional_resources: [
    {
      name: 'Kennedy Krieger Institute',
      baseUrl: 'https://www.kennedykrieger.org',
      requiresApiKey: false,
      description: 'Leading autism and developmental disabilities research',
      focusAreas: ['research', 'autism', 'developmental'],
      icon: 'Building'
    },
    {
      name: 'UC Davis MIND Institute',
      baseUrl: 'https://health.ucdavis.edu/mindinstitute/',
      requiresApiKey: false,
      description: 'Neurodevelopmental disorder research',
      focusAreas: ['research', 'autism', 'neurodiversity'],
      icon: 'Microscope'
    },
    {
      name: 'Vanderbilt Kennedy Center',
      baseUrl: 'https://vkc.vumc.org',
      requiresApiKey: false,
      description: 'Research on developmental disabilities',
      focusAreas: ['research', 'developmental'],
      icon: 'FlaskConical'
    },
    {
      name: 'Autism Speaks',
      baseUrl: 'https://www.autismspeaks.org',
      requiresApiKey: false,
      description: 'Autism advocacy and resources',
      focusAreas: ['autism', 'advocacy', 'support'],
      icon: 'Megaphone'
    },
    {
      name: 'CHADD',
      baseUrl: 'https://chadd.org',
      requiresApiKey: false,
      description: 'Children and Adults with ADHD',
      focusAreas: ['adhd', 'support', 'education'],
      icon: 'Zap'
    },
    {
      name: 'Understood.org',
      baseUrl: 'https://www.understood.org',
      requiresApiKey: false,
      description: 'Learning and thinking differences resources',
      focusAreas: ['learning-disabilities', 'adhd', 'support'],
      icon: 'Lightbulb'
    },
    {
      name: 'AANE',
      baseUrl: 'https://www.aane.org',
      requiresApiKey: false,
      description: 'Asperger/Autism Network',
      focusAreas: ['autism', 'aspergers', 'support'],
      icon: 'Network'
    },
    {
      name: 'State DOE Handbooks',
      baseUrl: 'https://www2.ed.gov/about/contacts/state/index.html',
      requiresApiKey: false,
      description: 'State-specific special education guidelines',
      focusAreas: ['policy', 'special-education', 'iep'],
      icon: 'MapPin'
    },
    {
      name: 'NCSE Ireland',
      baseUrl: 'https://ncse.ie',
      requiresApiKey: false,
      description: 'National Council for Special Education - Ireland\'s special education policy',
      focusAreas: ['policy', 'special-education', 'ireland'],
      icon: 'Flag'
    },
    {
      name: 'AsIAm',
      baseUrl: 'https://asiam.ie',
      requiresApiKey: false,
      description: 'Ireland\'s National Autism Charity - Irish autism advocacy',
      focusAreas: ['autism', 'advocacy', 'ireland'],
      icon: 'Heart'
    },
    {
      name: 'LD OnLine',
      baseUrl: 'https://www.ldonline.org',
      requiresApiKey: false,
      description: 'Comprehensive US resource on learning disabilities and ADHD',
      focusAreas: ['learning-disabilities', 'adhd', 'education'],
      icon: 'Library'
    },
    {
      name: 'The Arc',
      baseUrl: 'https://thearc.org',
      requiresApiKey: false,
      description: 'US advocacy for intellectual and developmental disabilities',
      focusAreas: ['developmental-disabilities', 'advocacy', 'support'],
      icon: 'Users2'
    }
  ],
  specialized_resources: [
    {
      name: 'PRT',
      baseUrl: 'https://autismprthelp.com',
      requiresApiKey: false,
      description: 'Pivotal Response Treatment resources',
      focusAreas: ['autism', 'intervention', 'aba'],
      icon: 'Target'
    },
    {
      name: 'ESDM',
      baseUrl: 'https://www.esdm.co',
      requiresApiKey: false,
      description: 'Early Start Denver Model',
      focusAreas: ['autism', 'early-intervention'],
      icon: 'Baby'
    },
    {
      name: 'Social Thinking',
      baseUrl: 'https://www.socialthinking.com',
      requiresApiKey: false,
      description: 'Social thinking methodology',
      focusAreas: ['autism', 'social-skills'],
      icon: 'MessageCircle'
    },
    {
      name: 'MIT OpenCourseWare',
      baseUrl: 'https://ocw.mit.edu',
      requiresApiKey: false,
      description: 'Free educational resources from MIT',
      focusAreas: ['education', 'academic'],
      icon: 'GraduationCap'
    },
    {
      name: 'ADDitude Magazine',
      baseUrl: 'https://www.additudemag.com',
      requiresApiKey: false,
      description: 'Practical ADHD strategies and life hacks',
      focusAreas: ['adhd', 'strategies', 'lifestyle'],
      icon: 'Newspaper'
    },
    {
      name: 'Zones of Regulation',
      baseUrl: 'https://www.zonesofregulation.com',
      requiresApiKey: false,
      description: 'Self-regulation framework using color-coded zones',
      focusAreas: ['self-regulation', 'emotions', 'curriculum'],
      icon: 'Palette'
    },
    {
      name: 'Lives in the Balance',
      baseUrl: 'https://www.livesinthebalance.org',
      requiresApiKey: false,
      description: 'Ross Greene\'s Collaborative & Proactive Solutions (CPS) model',
      focusAreas: ['behavior', 'cps', 'problem-solving'],
      icon: 'Scale'
    },
    {
      name: 'TEACCH',
      baseUrl: 'https://teacch.com',
      requiresApiKey: false,
      description: 'Structured Teaching method for autism - visual supports',
      focusAreas: ['autism', 'structured-teaching', 'visual-supports'],
      icon: 'Layout'
    },
    {
      name: 'Interoception Curriculum',
      baseUrl: 'https://www.kelly-mahler.com',
      requiresApiKey: false,
      description: 'Kelly Mahler\'s interoception and self-regulation curriculum',
      focusAreas: ['interoception', 'self-regulation', 'sensory'],
      icon: 'Heart'
    }
  ]
};

export function getAllSources(): KBSource[] {
  return [
    ...KB_SOURCES.academic_databases,
    ...KB_SOURCES.clinical_resources,
    ...KB_SOURCES.institutional_resources,
    ...KB_SOURCES.specialized_resources
  ];
}

export function getSourceByName(name: string): KBSource | undefined {
  return getAllSources().find(s => s.name === name);
}

export function getSourcesByType(type: keyof KBSourceCatalog): KBSource[] {
  return KB_SOURCES[type];
}
