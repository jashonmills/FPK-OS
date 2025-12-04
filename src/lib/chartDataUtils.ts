/**
 * Chart Data Utilities
 * "Data Honesty" functions for FPK-X Analytics
 * 
 * Ensures charts display scientifically accurate representations of data over time
 */

import { format, eachDayOfInterval, parseISO } from 'date-fns';

export type DataPoint = Record<string, any>;

/**
 * Fill missing dates with appropriate values
 * - For COUNT metrics (incidents, frequencies): Fill with 0
 * - For MEASUREMENT metrics (latency, duration): Fill with null
 * 
 * @param data - Array of data points
 * @param dateField - Name of the date field in the data
 * @param valueFields - Array of value field names to fill
 * @param startDate - Start of date range
 * @param endDate - End of date range
 * @param fillValue - Value to use for missing dates (0 for counts, null for measurements)
 * @returns Complete dataset with no missing dates
 */
export function fillMissingDates(
  data: DataPoint[],
  dateField: string,
  valueFields: string[],
  startDate: Date,
  endDate: Date,
  fillValue: number | null = 0
): DataPoint[] {
  if (!data || data.length === 0) {
    // Return empty array with all dates if no data
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });
    return allDates.map(date => {
      const point: DataPoint = {
        [dateField]: format(date, 'yyyy-MM-dd')
      };
      valueFields.forEach(field => {
        point[field] = fillValue;
      });
      return point;
    });
  }

  // Create a map of existing data by date
  const dataByDate = new Map<string, DataPoint>();
  data.forEach(item => {
    const dateStr = typeof item[dateField] === 'string' 
      ? item[dateField] 
      : format(new Date(item[dateField]), 'yyyy-MM-dd');
    dataByDate.set(dateStr, item);
  });

  // Generate complete date range
  const allDates = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Fill in missing dates
  return allDates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingData = dataByDate.get(dateStr);
    
    if (existingData) {
      return existingData;
    }
    
    // Create new data point for missing date
    const point: DataPoint = {
      [dateField]: dateStr
    };
    valueFields.forEach(field => {
      point[field] = fillValue;
    });
    return point;
  });
}

/**
 * Zero-fill for count-based metrics (incidents, frequencies)
 * Missing dates are filled with 0
 */
export function zeroFillData(
  data: DataPoint[],
  dateField: string,
  countFields: string[],
  days: number = 30
): DataPoint[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return fillMissingDates(data, dateField, countFields, startDate, endDate, 0);
}

/**
 * Null-fill for measurement-based metrics (latency, duration)
 * Missing dates are filled with null (creates gaps in line charts)
 */
export function nullFillData(
  data: DataPoint[],
  dateField: string,
  measurementFields: string[],
  days: number = 30
): DataPoint[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return fillMissingDates(data, dateField, measurementFields, startDate, endDate, null);
}

/**
 * Determine if a chart has sufficient data for rendering
 * @param data - The data array
 * @param minimumPoints - Minimum number of non-null data points required
 * @returns Object with status and message
 */
export function getDataStatus(
  data: DataPoint[] | null | undefined,
  minimumPoints: number = 3
): {
  status: 'loading' | 'sufficient' | 'insufficient' | 'no_data' | 'awaiting';
  dataPointCount: number;
  message: string;
} {
  if (data === null || data === undefined) {
    return {
      status: 'loading',
      dataPointCount: 0,
      message: 'Loading data...'
    };
  }

  if (!Array.isArray(data)) {
    return {
      status: 'no_data',
      dataPointCount: 0,
      message: 'Invalid data format'
    };
  }

  const dataPointCount = data.length;

  if (dataPointCount === 0) {
    return {
      status: 'awaiting',
      dataPointCount: 0,
      message: 'Awaiting data'
    };
  }

  if (dataPointCount < minimumPoints) {
    return {
      status: 'insufficient',
      dataPointCount,
      message: `Not enough data for trend analysis (${dataPointCount}/${minimumPoints} points)`
    };
  }

  return {
    status: 'sufficient',
    dataPointCount,
    message: 'Sufficient data available'
  };
}

/**
 * Filter out null/undefined values from data points
 * Useful for preventing broken line charts
 */
export function removeNullValues(
  data: DataPoint[],
  valueFields: string[]
): DataPoint[] {
  return data.filter(item => {
    return valueFields.every(field => 
      item[field] !== null && 
      item[field] !== undefined && 
      !isNaN(Number(item[field]))
    );
  });
}

/**
 * Calculate summary statistics for a dataset
 */
export function calculateStats(
  data: DataPoint[],
  valueField: string
): {
  min: number;
  max: number;
  mean: number;
  median: number;
  total: number;
} | null {
  const values = data
    .map(item => Number(item[valueField]))
    .filter(val => !isNaN(val) && val !== null);

  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / values.length;
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    total: sum
  };
}
