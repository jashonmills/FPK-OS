
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserProfile } from '@/types/userManagement';
import { UserManagementRow } from './UserManagementRow';

interface UserManagementTableProps {
  users: UserProfile[];
  onAssignRole: (userId: string, role: string) => void;
  onRemoveRole: (userId: string, role: string) => void;
}

export const UserManagementTable = ({ users, onAssignRole, onRemoveRole }: UserManagementTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserManagementRow
            key={user.id}
            user={user}
            onAssignRole={onAssignRole}
            onRemoveRole={onRemoveRole}
          />
        ))}
      </TableBody>
    </Table>
  );
};
