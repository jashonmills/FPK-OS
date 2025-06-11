
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Role, AVAILABLE_ROLES, getRoleBadgeVariant } from '@/types/user';
import { Plus, X } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface UsersTableProps {
  users: User[];
  onAssignRole: (userId: string, role: Role) => void;
  onRemoveRole: (userId: string, role: Role) => void;
  isAssigning: boolean;
  isRemoving: boolean;
}

export function UsersTable({ users, onAssignRole, onRemoveRole, isAssigning, isRemoving }: UsersTableProps) {
  const { getAccessibilityClasses } = useAccessibility();
  
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={textClasses}>User</TableHead>
            <TableHead className={textClasses}>Email</TableHead>
            <TableHead className={textClasses}>Roles</TableHead>
            <TableHead className={textClasses}>Created</TableHead>
            <TableHead className={textClasses}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <div className={`font-medium ${textClasses}`}>{user.full_name}</div>
                  <div className={`text-sm text-muted-foreground ${textClasses}`}>{user.display_name}</div>
                </div>
              </TableCell>
              <TableCell className={textClasses}>{user.email}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <div key={role} className="flex items-center gap-1">
                      <Badge variant={getRoleBadgeVariant(role)} className={textClasses}>
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
              <TableCell className={textClasses}>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Select onValueChange={(value) => handleRoleAssign(user.id, value)}>
                  <SelectTrigger className={`w-32 ${textClasses}`}>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
