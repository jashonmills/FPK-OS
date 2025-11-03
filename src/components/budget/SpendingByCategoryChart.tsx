import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Category {
  id: string;
  name: string;
  allocated_amount: number;
}

interface Expense {
  category_id: string;
  amount: number;
}

interface SpendingByCategoryChartProps {
  categories: Category[];
  expenses: Expense[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--warning))',
  'hsl(var(--success))',
  'hsl(var(--destructive))',
];

export const SpendingByCategoryChart = ({ categories, expenses }: SpendingByCategoryChartProps) => {
  const data = categories.map((cat, index) => {
    const spent = expenses
      .filter(exp => exp.category_id === cat.id)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      name: cat.name,
      value: spent,
      color: COLORS[index % COLORS.length],
    };
  }).filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No expenses recorded yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `$${value.toLocaleString()}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
