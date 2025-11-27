import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface TopicDataPoint {
  topic: string;
  study_time: number;
  mastery_score: number;
  session_count: number;
}

interface TopicBreakdownChartProps {
  data: TopicDataPoint[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(220, 70%, 50%)',
  'hsl(280, 70%, 50%)',
  'hsl(160, 70%, 50%)',
  'hsl(40, 90%, 50%)',
  'hsl(340, 70%, 50%)',
];

export function TopicBreakdownChart({ data }: TopicBreakdownChartProps) {
  const formattedData = data.map((item, index) => ({
    name: item.topic,
    size: item.study_time,
    mastery: item.mastery_score,
    sessions: item.session_count,
    fill: COLORS[index % COLORS.length],
  }));

  const CustomContent = (props: any) => {
    const { x, y, width, height, name, size, mastery } = props;
    
    if (width < 80 || height < 60) return null;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: props.fill,
            stroke: 'hsl(var(--border))',
            strokeWidth: 2,
            opacity: 0.9,
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 - 10}
          textAnchor="middle"
          fill="white"
          fontSize={14}
          fontWeight="bold"
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          fill="white"
          fontSize={12}
        >
          {Math.floor(size / 60)}h {size % 60}m
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 30}
          textAnchor="middle"
          fill="white"
          fontSize={11}
        >
          Mastery: {mastery}/3.0
        </text>
      </g>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Topic Breakdown (Time & Mastery)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <Treemap
          data={formattedData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="hsl(var(--border))"
          content={<CustomContent />}
        >
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: any, name: string, props: any) => {
              if (name === 'size') {
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                return [
                  <div key="tooltip">
                    <div>Time: {hours}h {minutes}m</div>
                    <div>Mastery: {props.payload.mastery}/3.0</div>
                    <div>Sessions: {props.payload.sessions}</div>
                  </div>,
                  props.payload.name,
                ];
              }
              return [value, name];
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}
