import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface TimeTrackingFiltersProps {
  dateRange: { start: Date; end: Date };
  onDateRangeChange: (range: { start: Date; end: Date }) => void;
}

export const TimeTrackingFilters = ({ dateRange, onDateRangeChange }: TimeTrackingFiltersProps) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Date Range:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.start}
                onSelect={(date) => date && onDateRangeChange({ ...dateRange, start: date })}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const today = new Date();
            onDateRangeChange({ start: today, end: today });
          }}
        >
          Today
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const today = new Date();
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            onDateRangeChange({ start: weekAgo, end: today });
          }}
        >
          Last 7 Days
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const today = new Date();
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            onDateRangeChange({ start: monthAgo, end: today });
          }}
        >
          Last 30 Days
        </Button>
      </div>
    </Card>
  );
};
