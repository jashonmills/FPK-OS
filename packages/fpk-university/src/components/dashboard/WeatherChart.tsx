
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import { WeatherData } from '@/services/WeatherService';

interface WeatherChartProps {
  data: WeatherData;
  onInteract?: () => void;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      fullTime: string;
      temperature: number;
      precipitation: number;
    };
  }>;
  label?: string;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ data, onInteract }) => {
  const chartData = data.hourly.map(hour => ({
    time: format(new Date(hour.dt * 1000), 'HH:mm'),
    fullTime: format(new Date(hour.dt * 1000), 'MMM dd, HH:mm'),
    temperature: Math.round(hour.temp),
    precipitation: Math.round(hour.pop * 100),
  }));

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/35 backdrop-blur-sm p-3 border border-white/30 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.fullTime}</p>
          <p className="text-blue-600">
            🌡️ Temperature: {data.temperature}°C
          </p>
          <p className="text-purple-600">
            🌧️ Precipitation: {data.precipitation}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          onMouseMove={onInteract}
          onClick={onInteract}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="time" 
            fontSize={12}
            stroke="#64748b"
            interval="preserveStartEnd"
          />
          <YAxis 
            yAxisId="temp"
            orientation="left"
            fontSize={12}
            stroke="#3b82f6"
            label={{ value: '°C', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="precip"
            orientation="right"
            fontSize={12}
            stroke="#8b5cf6"
            label={{ value: '%', angle: 90, position: 'insideRight' }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temperature"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3, fill: '#3b82f6' }}
            name="Temperature (°C)"
            activeDot={{ r: 5, fill: '#3b82f6' }}
          />
          <Line
            yAxisId="precip"
            type="monotone"
            dataKey="precipitation"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ r: 3, fill: '#8b5cf6' }}
            name="Precipitation (%)"
            activeDot={{ r: 5, fill: '#8b5cf6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
