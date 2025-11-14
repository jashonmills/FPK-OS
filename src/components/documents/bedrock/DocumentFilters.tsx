import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, SlidersHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DOCUMENT_TYPE_CATEGORIES } from './BedrockDocumentPage';

interface DocumentFiltersProps {
  statusFilter: string;
  categoryFilter: string;
  dateFromFilter: string;
  dateToFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onStatusFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onDateFromFilterChange: (value: string) => void;
  onDateToFilterChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}

export function DocumentFilters({
  statusFilter,
  categoryFilter,
  dateFromFilter,
  dateToFilter,
  sortBy,
  sortOrder,
  onStatusFilterChange,
  onCategoryFilterChange,
  onDateFromFilterChange,
  onDateToFilterChange,
  onSortByChange,
  onSortOrderChange,
  onClearFilters,
}: DocumentFiltersProps) {
  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || 
                          dateFromFilter || dateToFilter;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Label className="text-sm whitespace-nowrap">Status:</Label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="analyzing">Analyzing</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <Label className="text-sm whitespace-nowrap">Category:</Label>
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(DOCUMENT_TYPE_CATEGORIES).map(([categoryKey, category]) => (
              <div key={categoryKey}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {category.label}
                </div>
                {category.types.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">Date Range</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateFromFilter}
                  onChange={(e) => onDateFromFilterChange(e.target.value)}
                  placeholder="From"
                />
                <Input
                  type="date"
                  value={dateToFilter}
                  onChange={(e) => onDateToFilterChange(e.target.value)}
                  placeholder="To"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm mb-2 block">Sort By</Label>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={onSortByChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date</SelectItem>
                    <SelectItem value="file_name">Name</SelectItem>
                    <SelectItem value="file_size">Size</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={(v) => onSortOrderChange(v as 'asc' | 'desc')}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Asc</SelectItem>
                    <SelectItem value="desc">Desc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
