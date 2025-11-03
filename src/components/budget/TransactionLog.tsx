import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';

interface Expense {
  id: string;
  amount: number;
  description: string;
  expense_date: string;
  is_auto_generated: boolean;
  receipt_url: string | null;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

interface TransactionLogProps {
  expenses: Expense[];
  categories: Category[];
}

export const TransactionLog = ({ expenses, categories }: TransactionLogProps) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = expenses.filter(exp => {
    const matchesSearch = exp.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || exp.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(exp.expense_date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryName(exp.category_id)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={exp.is_auto_generated ? 'secondary' : 'default'}>
                      {exp.is_auto_generated ? 'Auto' : 'Manual'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${exp.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {exp.receipt_url && (
                      <a href={exp.receipt_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
