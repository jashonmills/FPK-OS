
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, LineChart, AreaChart, PieChart, ScatterChart, Bar, Line, Area, Pie, Cell, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ChartDefinition } from '@/config/chartDefinitions';
import { ChartDataPoint } from '@/types/analytics-data';

interface DeclarativeChartProps {
  definition: ChartDefinition;
  data: ChartDataPoint[];
  filters?: Record<string, unknown>;
  className?: string;
}

export const DeclarativeChart: React.FC<DeclarativeChartProps> = ({
  definition,
  data,
  filters = {},
  className = 'h-[300px]'
}) => {
  const chartConfig = useMemo(() => {
    return definition.config.series.reduce((acc, series) => {
      acc[series.dataKey] = {
        label: series.name,
        color: series.color
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>);
  }, [definition.config.series]);

  const filteredData = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return data;
    
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return item[key] === value || item[key]?.toString().includes(value.toString());
      });
    });
  }, [data, filters]);

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 10, right: 10, left: 10, bottom: 10 }
    };

    switch (definition.type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            {definition.config.xAxis && (
              <XAxis 
                dataKey={definition.config.xAxis.dataKey}
                fontSize={10}
              />
            )}
            {definition.config.yAxis && (
              <YAxis 
                fontSize={10}
                domain={definition.config.yAxis.domain}
              />
            )}
            <ChartTooltip content={<ChartTooltipContent />} />
            {definition.config.legend?.show && <Legend />}
            {definition.config.series.map((series, index) => (
              <Bar
                key={series.dataKey}
                dataKey={series.dataKey}
                fill={series.color}
                name={series.name}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            {definition.config.xAxis && (
              <XAxis 
                dataKey={definition.config.xAxis.dataKey}
                fontSize={10}
              />
            )}
            {definition.config.yAxis && (
              <YAxis 
                fontSize={10}
                domain={definition.config.yAxis.domain}
              />
            )}
            <ChartTooltip content={<ChartTooltipContent />} />
            {definition.config.legend?.show && <Legend />}
            {definition.config.series.map((series, index) => (
              <Line
                key={series.dataKey}
                type={series.type || 'monotone'}
                dataKey={series.dataKey}
                stroke={series.color}
                name={series.name}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            {definition.config.xAxis && (
              <XAxis 
                dataKey={definition.config.xAxis.dataKey}
                fontSize={10}
              />
            )}
            {definition.config.yAxis && (
              <YAxis 
                fontSize={10}
                domain={definition.config.yAxis.domain}
              />
            )}
            <ChartTooltip content={<ChartTooltipContent />} />
            {definition.config.legend?.show && <Legend />}
            {definition.config.series.map((series, index) => (
              <Area
                key={series.dataKey}
                type={series.type || 'monotone'}
                dataKey={series.dataKey}
                stroke={series.color}
                fill={series.color}
                fillOpacity={0.6}
                name={series.name}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie
              data={filteredData as any}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey={definition.config.series[0]?.dataKey || 'value'}
              nameKey="name"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={(entry as any).color || definition.config.series[0]?.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            {definition.config.legend?.show && <Legend />}
          </PieChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Unsupported chart type: {definition.type}</p>
          </div>
        );
    }
  };

  return (
    <ChartContainer config={chartConfig} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </ChartContainer>
  );
};
