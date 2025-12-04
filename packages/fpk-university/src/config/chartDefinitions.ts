
export interface ChartDefinition {
  id: string;
  title: string;
  description: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  dataSource: {
    query: string;
    params?: Record<string, any>;
    transform?: string;
  };
  config: {
    xAxis?: {
      dataKey: string;
      label?: string;
      type?: 'category' | 'number';
    };
    yAxis?: {
      label?: string;
      domain?: [number, number];
    };
    series: Array<{
      dataKey: string;
      name: string;
      color: string;
      type?: 'monotone' | 'basis' | 'linear';
    }>;
    legend?: {
      show: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      show: boolean;
      formatter?: string;
    };
  };
  filters?: Array<{
    key: string;
    label: string;
    type: 'date' | 'select' | 'number';
    options?: string[];
    defaultValue?: any;
  }>;
  refreshInterval?: number; // seconds
  enableRealtime?: boolean;
  featureFlag?: string;
}

export const CHART_DEFINITIONS: Record<string, ChartDefinition> = {
  weeklyActivity: {
    id: 'weeklyActivity',
    title: 'Weekly Learning Activity',
    description: 'Study sessions and time spent per day',
    type: 'bar',
    dataSource: {
      query: 'weekly_activity',
      transform: 'groupByDay'
    },
    config: {
      xAxis: {
        dataKey: 'day',
        label: 'Day of Week'
      },
      yAxis: {
        label: 'Minutes / Sessions'
      },
      series: [
        {
          dataKey: 'studyTime',
          name: 'Study Time (min)',
          color: '#F59E0B'
        },
        {
          dataKey: 'studySessions',
          name: 'Sessions',
          color: '#8B5CF6'
        }
      ],
      legend: {
        show: true,
        position: 'bottom'
      },
      tooltip: {
        show: true
      }
    },
    enableRealtime: true,
    featureFlag: 'weekly_activity_chart'
  },

  readingProgress: {
    id: 'readingProgress',
    title: 'Reading Time Trends',
    description: 'Daily reading time over the past week',
    type: 'area',
    dataSource: {
      query: 'reading_trends',
      params: { days: 7 }
    },
    config: {
      xAxis: {
        dataKey: 'day',
        label: 'Day'
      },
      yAxis: {
        label: 'Reading Time (minutes)'
      },
      series: [
        {
          dataKey: 'reading_time',
          name: 'Reading Time',
          color: '#3B82F6',
          type: 'monotone'
        }
      ],
      legend: {
        show: false
      },
      tooltip: {
        show: true,
        formatter: '{value} minutes'
      }
    },
    refreshInterval: 300,
    enableRealtime: true,
    featureFlag: 'reading_trends_chart'
  },

  xpBreakdown: {
    id: 'xpBreakdown',
    title: 'XP Sources Distribution',
    description: 'XP earned from different activities',
    type: 'pie',
    dataSource: {
      query: 'xp_breakdown',
      params: { period: '7d' }
    },
    config: {
      series: [
        {
          dataKey: 'value',
          name: 'XP Source',
          color: '#8B5CF6'
        }
      ],
      legend: {
        show: true,
        position: 'right'
      },
      tooltip: {
        show: true,
        formatter: '{name}: {value} XP'
      }
    },
    filters: [
      {
        key: 'period',
        label: 'Time Period',
        type: 'select',
        options: ['1d', '7d', '30d', '90d'],
        defaultValue: '7d'
      }
    ],
    featureFlag: 'xp_breakdown_chart'
  },

  studyAccuracy: {
    id: 'studyAccuracy',
    title: 'Study Accuracy Over Time',
    description: 'Accuracy percentage in study sessions',
    type: 'line',
    dataSource: {
      query: 'study_accuracy',
      params: { days: 30 }
    },
    config: {
      xAxis: {
        dataKey: 'date',
        label: 'Date'
      },
      yAxis: {
        label: 'Accuracy (%)',
        domain: [0, 100]
      },
      series: [
        {
          dataKey: 'accuracy',
          name: 'Accuracy',
          color: '#10B981',
          type: 'monotone'
        },
        {
          dataKey: 'target',
          name: 'Target',
          color: '#EF4444',
          type: 'linear'
        }
      ],
      legend: {
        show: true,
        position: 'top'
      },
      tooltip: {
        show: true
      }
    },
    featureFlag: 'study_accuracy_chart'
  }
};
