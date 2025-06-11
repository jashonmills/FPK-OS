
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail } from 'lucide-react';
import { UserProfile, UserRole, getRoleBadgeVariant, isValidRole } from '@/types/userManagement';

interface UserManagementRowProps {
  user: UserProfile;
  onAssignRole: (userId: string, role: UserRole) => void;
  onRemoveRole: (userId: string, role: string) => void;
}

export const UserManagementRow = ({ user, onAssignRole, onRemoveRole }: UserManagementRowProps) => {
  const handleRoleSelection = (value: string) => {
    if (isValidRole(value)) {
      onAssignRole(user.id, value);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-medium">{user.full_name}</div>
            <div className="text-sm text-muted-foreground">{user.display_name}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {user.email}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1 flex-wrap">
          {user.roles.map((role) => (
            <Badge
              key={role}
              variant={getRoleBadgeVariant(role)}
              className="text-xs"
            >
              {role}
              <button
                onClick={() => onRemoveRole(user.id, role)}
                className="ml-1 hover:bg-black/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Select onValueChange={handleRoleSelection}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Add role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="learner">Learner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TableCell>
    </TableRow>
  );
};
