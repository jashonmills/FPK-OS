import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useIsAdmin } from "@/hooks/admin/useIsAdmin";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { UserFilterBar } from "@/components/admin/users/UserFilterBar";
import { UserResultsTable } from "@/components/admin/users/UserResultsTable";
import { UserDetailPanel } from "@/components/admin/users/UserDetailPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Navigate } from "react-router-dom";
import type { IUserFilters, IUserSort } from "@/types/admin/users";

export default function UserManagement() {
  const { data: adminStatus, isLoading: isCheckingAdmin } = useIsAdmin();
  const [filters, setFilters] = useState<IUserFilters>({});
  const [sort, setSort] = useState<IUserSort>({
    field: 'createdAt',
    direction: 'desc'
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError
  } = useAdminUsers({
    filters,
    sort,
    search,
    page,
    pageSize: 25
  });

  if (isCheckingAdmin) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6 space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96" />
        </div>
      </AppLayout>
    );
  }

  if (!adminStatus?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Search, view, and manage all user accounts on the platform
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersData?.totalCount ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {usersData?.users.filter(u => u.accountStatus === 'active').length ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {usersData?.users.filter(u => u.accountStatus === 'suspended').length ?? 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <UserFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          search={search}
          onSearchChange={setSearch}
        />

        {/* Error State */}
        {usersError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {usersError.message || "Failed to load users"}
            </AlertDescription>
          </Alert>
        )}

        {/* Results Table */}
        <UserResultsTable
          users={usersData?.users ?? []}
          isLoading={isLoadingUsers}
          sort={sort}
          onSortChange={setSort}
          onUserSelect={setSelectedUserId}
          currentPage={page}
          totalPages={Math.ceil((usersData?.totalCount ?? 0) / 25)}
          onPageChange={setPage}
        />

        {/* Detail Panel */}
        <UserDetailPanel
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      </div>
    </AppLayout>
  );
}
