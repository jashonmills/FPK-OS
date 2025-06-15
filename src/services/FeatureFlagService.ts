export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  conditions?: {
    userAgent?: string[];
    versions?: string[];
    userGroups?: string[];
  };
}

export class FeatureFlagService {
  private flags: Map<string, FeatureFlag> = new Map();
  private userHash: string;

  constructor() {
    this.userHash = this.generateUserHash();
    this.initializeDefaultFlags();
  }

  private initializeDefaultFlags(): void {
    const defaultFlags: FeatureFlag[] = [
      {
        id: 'enhanced_pdf_viewer',
        name: 'Enhanced PDF Viewer',
        description: 'Use the new enhanced PDF viewer with improved performance',
        enabled: true,
        rolloutPercentage: 100
      },
      {
        id: 'optimized_epub_renderer',
        name: 'Optimized EPUB Renderer',
        description: 'Use the optimized EPUB rendering engine',
        enabled: true,
        rolloutPercentage: 80
      },
      {
        id: 'offline_cache',
        name: 'Offline Document Cache',
        description: 'Enable service worker caching for offline reading',
        enabled: false,
        rolloutPercentage: 30
      },
      {
        id: 'advanced_telemetry',
        name: 'Advanced Telemetry',
        description: 'Collect detailed performance and usage metrics',
        enabled: true,
        rolloutPercentage: 100
      },
      {
        id: 'experimental_reader_ui',
        name: 'Experimental Reader UI',
        description: 'Test new reader interface components',
        enabled: false,
        rolloutPercentage: 10
      },
      // Analytics feature flags
      {
        id: 'reading_analytics_card',
        name: 'Reading Analytics Card',
        description: 'Show reading analytics in dashboard',
        enabled: true,
        rolloutPercentage: 100
      },
      {
        id: 'xp_breakdown_card',
        name: 'XP Breakdown Card',
        description: 'Show XP source breakdown analytics',
        enabled: true,
        rolloutPercentage: 100
      },
      {
        id: 'study_performance_card',
        name: 'Study Performance Card',
        description: 'Show study performance metrics',
        enabled: true,
        rolloutPercentage: 80
      },
      {
        id: 'ai_coach_analytics_card',
        name: 'AI Coach Analytics Card',
        description: 'Show AI coach engagement metrics',
        enabled: true,
        rolloutPercentage: 100
      },
      {
        id: 'weekly_activity_chart',
        name: 'Weekly Activity Chart',
        description: 'Show weekly learning activity chart',
        enabled: true,
        rolloutPercentage: 100
      },
      {
        id: 'reading_trends_chart',
        name: 'Reading Trends Chart',
        description: 'Show reading time trends',
        enabled: true,
        rolloutPercentage: 90
      },
      {
        id: 'study_accuracy_chart',
        name: 'Study Accuracy Chart',
        description: 'Show study accuracy over time',
        enabled: true,
        rolloutPercentage: 70
      },
      {
        id: 'realtime_analytics',
        name: 'Real-time Analytics',
        description: 'Enable real-time updates for analytics',
        enabled: true,
        rolloutPercentage: 85
      },
      // NASA Image Explorer feature flag
      {
        id: 'enableNASAImageExplorer',
        name: 'NASA Image Explorer',
        description: 'Enable NASA Astronomy Picture of the Day integration',
        enabled: true,
        rolloutPercentage: 100
      },
      // Quote of the Day widget feature flag
      {
        id: 'quotesWidget',
        name: 'Quote of the Day Widget',
        description: 'Enable daily inspirational quotes on the learner home page',
        enabled: true,
        rolloutPercentage: 100
      },
      // Collapsible Notes feature flag
      {
        id: 'collapsibleNotes',
        name: 'Collapsible Note Accordions',
        description: 'Render notes as collapsible accordions to save vertical space',
        enabled: true,
        rolloutPercentage: 100
      },
      // Quizlet Integration feature flag
      {
        id: 'quizletIntegration',
        name: 'Quizlet Integration',
        description: 'Enable Quizlet flashcard search and import functionality',
        enabled: true,
        rolloutPercentage: 100
      },
      // Dual AI Mode feature flag - ENABLED
      {
        id: 'dualAIMode',
        name: 'Dual AI Chat Modes',
        description: 'Enable dual-model chat toggle between personal data and general knowledge modes with Claude and OpenAI',
        enabled: true,
        rolloutPercentage: 100
      },
      // Voice Play Button feature flag
      {
        id: 'voicePlayButton',
        name: 'Voice Play Button',
        description: 'Enable inline speaker icon button for AI message bubbles to play voice responses',
        enabled: true,
        rolloutPercentage: 100
      },
      // Widget Chat Deletion feature flag
      {
        id: 'widgetChatDeletion',
        name: 'Widget Chat Deletion',
        description: 'Enable per-message deletion and clear chat functionality in widget chat with separate histories',
        enabled: true,
        rolloutPercentage: 100
      }
    ];

    defaultFlags.forEach(flag => this.flags.set(flag.id, flag));
  }

  isEnabled(flagId: string): boolean {
    const flag = this.flags.get(flagId);
    if (!flag) {
      console.warn(`⚠️ Feature flag '${flagId}' not found`);
      return false;
    }

    if (!flag.enabled) return false;

    const hashNumber = this.hashStringToNumber(this.userHash + flagId);
    const userPercentile = hashNumber % 100;
    
    const isInRollout = userPercentile < flag.rolloutPercentage;
    
    if (flag.conditions) {
      if (flag.conditions.userAgent && !this.matchesUserAgent(flag.conditions.userAgent)) {
        return false;
      }
    }

    return isInRollout;
  }

  getFlag(flagId: string): FeatureFlag | undefined {
    return this.flags.get(flagId);
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  updateFlag(flagId: string, updates: Partial<FeatureFlag>): void {
    const flag = this.flags.get(flagId);
    if (flag) {
      this.flags.set(flagId, { ...flag, ...updates });
      console.log(`🚩 Updated feature flag '${flagId}':`, updates);
    }
  }

  private generateUserHash(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('User fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return this.hashString(fingerprint);
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  private hashStringToNumber(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private matchesUserAgent(patterns: string[]): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return patterns.some(pattern => userAgent.includes(pattern.toLowerCase()));
  }
}

export const featureFlagService = new FeatureFlagService();
