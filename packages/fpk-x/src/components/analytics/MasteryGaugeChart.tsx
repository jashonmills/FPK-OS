// src/components/analytics/MasteryGaugeChart.tsx
// FINAL UPGRADED VERSION - WITH CONTEXT

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricData {
  title: string;
  percentage: number;
  description: string;
  target_value?: number; // The target value for the metric
  unit?: string;         // The unit of measurement (e.g., '%')
}

interface MasteryGaugeChartProps {
  metric: MetricData;
}

// Function to determine the color based on the percentage
const getRingColor = (percentage: number): string => {
  if (percentage >= 80) return 'stroke-green-500';
  if (percentage >= 50) return 'stroke-yellow-500';
  return 'stroke-red-500';
};

export const MasteryGaugeChart = ({ metric }: MasteryGaugeChartProps) => {
  const { title, percentage, description, target_value, unit } = metric;
  const circumference = 2 * Math.PI * 40; // 2 * pi * radius
  const offset = circumference - (percentage / 100) * circumference;
  const ringColor = getRingColor(percentage);

  // --- INTELLIGENT TARGET FORMATTING ---
  // Check if a valid target value exists
  const hasValidTarget = typeof target_value === 'number' && isFinite(target_value);

  return (
    <Card className="flex flex-col h-full bg-background/50 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-base font-medium truncate">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="stroke-current text-gray-700"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            ></circle>
            {/* Progress circle */}
            <circle
              className={cn('stroke-current transition-all duration-1000 ease-out', ringColor)}
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
            ></circle>
            {/* Text in the middle */}
            <text x="50" y="50" fontFamily="Verdana" fontSize="20" textAnchor="middle" alignmentBaseline="middle" className="fill-foreground">
              {`${Math.round(percentage)}${unit || '%'}`}
            </text>
          </svg>
        </div>
        
        {/* +++ CONTEXT IS KING: DISPLAY THE TARGET +++ */}
        <div className="text-center mt-4">
          {hasValidTarget ? (
            <p className="text-sm text-muted-foreground">
              Target: {target_value}{unit || '%'}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">- No Target Set -</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
