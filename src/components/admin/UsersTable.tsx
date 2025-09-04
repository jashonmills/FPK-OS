
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Role, AVAILABLE_ROLES, getRoleBadgeVariant } from '@/types/user';
import { Plus, X, BarChart3 } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useNavigate } from 'react-router-dom';

interface UsersTableProps {
  users: User[];
  onAssignRole: (userId: string, role: Role) => void;
  onRemoveRole: (userId: string, role: Role) => void;
  isAssigning: boolean;
  isRemoving: boolean;
}

export function UsersTable({ users, onAssignRole, onRemoveRole, isAssigning, isRemoving }: UsersTableProps) {
  const { getAccessibilityClasses } = useAccessibility();
  const navigate = useNavigate();
  
  const handleRoleAssign = (userId: string, roleValue: string) => {
    if (AVAILABLE_ROLES.includes(roleValue as Role)) {
      onAssignRole(userId, roleValue as Role);
    }
  };

  const tableClasses = getAccessibilityClasses('container');
  const textClasses = getAccessibilityClasses('text');
  
  console.log('📊 UsersTable: Applied accessibility classes:', { tableClasses, textClasses });

  return (
    <div className={`${tableClasses} accessibility-mobile-override`}>
      <div className="min-w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`${textClasses} text-left`}>User</TableHead>
              <TableHead className={`${textClasses} text-left hidden sm:table-cell`}>Email</TableHead>
              <TableHead className={`${textClasses} text-left`}>Roles</TableHead>
              <TableHead className={`${textClasses} text-left hidden md:table-cell`}>Created</TableHead>
              <TableHead className={`${textClasses} text-left`}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className={`font-medium ${textClasses} text-sm sm:text-base`}>{user.full_name}</div>
                    <div className={`text-xs sm:text-sm text-muted-foreground ${textClasses}`}>{user.display_name}</div>
                    <div className={`text-xs text-muted-foreground sm:hidden ${textClasses}`}>{user.email}</div>
                  </div>
                </TableCell>
                <TableCell className={`${textClasses} hidden sm:table-cell`}>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <div key={role} className="flex items-center gap-1">
                        <Badge variant={getRoleBadgeVariant(role)} className={`${textClasses} text-xs`}>
                          {role}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0"
                          onClick={() => onRemoveRole(user.id, role)}
                          disabled={isRemoving}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className={`${textClasses} hidden md:table-cell text-sm`}>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select onValueChange={(value) => handleRoleAssign(user.id, value)}>
                      <SelectTrigger className={`w-full sm:w-32 ${textClasses} text-xs sm:text-sm`}>
                        <SelectValue placeholder="Add role" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_ROLES.filter(role => !user.roles.includes(role)).map((role) => (
                          <SelectItem key={role} value={role} className={textClasses}>
                            <div className="flex items-center gap-2">
                              <Plus className="h-3 w-3" />
                              {role}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/dashboard/admin/users/${user.id}/analytics`)}
                      className="flex items-center gap-2 text-xs sm:text-sm"
                    >
                      <BarChart3 className="h-3 w-3" />
                      <span className="hidden sm:inline">Analytics</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
