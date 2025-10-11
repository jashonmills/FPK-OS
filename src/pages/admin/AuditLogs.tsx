import { useState } from 'react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const { logs, loading, totalCount, page, pageSize, setPage, setFilters } = useAuditLogs(
    { search, action: actionFilter, status: statusFilter, dateFrom, dateTo },
    20
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on filter change
  };

  const handleFilterChange = () => {
    setFilters({
      search,
      action: actionFilter || undefined,
      status: statusFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setActionFilter('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setFilters({});
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    return status === 'success' ? (
      <Badge variant="default" className="bg-success text-success-foreground">
        Success
      </Badge>
    ) : (
      <Badge variant="destructive">Failure</Badge>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground mt-2">
          View and search through all administrative actions and security events
        </p>
      </div>

      {/* Filters Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or ID..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Action Filter */}
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Actions</SelectItem>
                <SelectItem value="user.login">User Login</SelectItem>
                <SelectItem value="user.created">User Created</SelectItem>
                <SelectItem value="user.deleted">User Deleted</SelectItem>
                <SelectItem value="user.updated">User Updated</SelectItem>
                <SelectItem value="course.created">Course Created</SelectItem>
                <SelectItem value="course.published">Course Published</SelectItem>
                <SelectItem value="organization.created">Organization Created</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">From Date</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">To Date</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleFilterChange} className="w-full md:w-auto">
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {logs.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
        {Math.min(page * pageSize, totalCount)} of {totalCount} entries
      </div>

      {/* Audit Logs Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No audit logs found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              // Audit log entries
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{log.actor_email || 'System'}</span>
                      {log.user_id && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {log.user_id.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {log.action_type}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{log.resource_type || 'N/A'}</span>
                      {log.resource_id && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {log.resource_id.substring(0, 12)}...
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this audit log entry
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Timestamp
                  </label>
                  <p className="font-mono text-sm">
                    {format(new Date(selectedLog.created_at), 'PPpp')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Actor Email
                  </label>
                  <p className="text-sm">{selectedLog.actor_email || 'System'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Actor User ID
                  </label>
                  <p className="font-mono text-xs break-all">
                    {selectedLog.user_id || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Action</label>
                  <p className="text-sm">
                    <code className="bg-muted px-2 py-1 rounded">
                      {selectedLog.action_type}
                    </code>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Resource Type
                  </label>
                  <p className="text-sm">{selectedLog.resource_type || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Resource ID
                  </label>
                  <p className="font-mono text-xs break-all">
                    {selectedLog.resource_id || 'N/A'}
                  </p>
                </div>
                {selectedLog.target_user_id && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Target User ID
                    </label>
                    <p className="font-mono text-xs break-all">
                      {selectedLog.target_user_id}
                    </p>
                  </div>
                )}
              </div>

              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Additional Details (JSON)
                  </label>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
