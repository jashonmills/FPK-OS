import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfWeek, addWeeks } from 'date-fns';

interface Expense {
  expense_date: string;
  amount: number;
}

interface CashFlowChartProps {
  expenses: Expense[];
}

export const CashFlowChart = ({ expenses }: CashFlowChartProps) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No expense data available
      </div>
    );
  }

  // Group expenses by week
  const weeklyData = expenses.reduce((acc, exp) => {
    const weekStart = format(startOfWeek(parseISO(exp.expense_date)), 'MMM dd');
    
    if (!acc[weekStart]) {
      acc[weekStart] = 0;
    }
    acc[weekStart] += exp.amount;
    
    return acc;
  }, {} as Record<string, number>);

  // Convert to cumulative data
  const sortedWeeks = Object.keys(weeklyData).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  let cumulative = 0;
  const data = sortedWeeks.map(week => {
    cumulative += weeklyData[week];
    return {
      week,
      total: cumulative,
      weekly: weeklyData[week],
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => `$${value.toLocaleString()}`}
          labelFormatter={(label) => `Week of ${label}`}
        />
        <Area 
          type="monotone" 
          dataKey="total" 
          stroke="hsl(var(--primary))" 
          fillOpacity={1} 
          fill="url(#colorTotal)" 
          name="Cumulative Spend"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
