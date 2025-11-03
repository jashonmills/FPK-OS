import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, User, Briefcase, DollarSign, Settings, Eye } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermission {
  role: string;
  permissionIds: string[];
}

const roleConfig = [
  { value: 'admin', label: 'Super Admin', icon: Shield, color: 'text-red-500' },
  { value: 'manager', label: 'Manager', icon: Briefcase, color: 'text-blue-500' },
  { value: 'hr', label: 'HR', icon: DollarSign, color: 'text-green-500' },
  { value: 'member', label: 'Member', icon: User, color: 'text-gray-500' },
  { value: 'it', label: 'IT', icon: Settings, color: 'text-purple-500' },
  { value: 'viewer', label: 'Viewer', icon: Eye, color: 'text-amber-500' },
];

export const RolesPermissionsManager = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Map<string, Set<string>>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all permissions
      const { data: perms } = await supabase
        .from('permissions')
        .select('*')
        .order('category, name');

      if (perms) setPermissions(perms);

      // Fetch role permissions
      const { data: rolePerms } = await supabase
        .from('role_permissions')
        .select('role, permission_id');

      if (rolePerms) {
        const rolePermMap = new Map<string, Set<string>>();
        rolePerms.forEach((rp: any) => {
          if (!rolePermMap.has(rp.role)) {
            rolePermMap.set(rp.role, new Set());
          }
          rolePermMap.get(rp.role)?.add(rp.permission_id);
        });
        setRolePermissions(rolePermMap);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const toggleRolePermission = async (role: string, permissionId: string) => {
    const rolePerms = rolePermissions.get(role) || new Set();
    const hasPermission = rolePerms.has(permissionId);

    try {
      if (hasPermission) {
        // Remove permission
        await supabase
          .from('role_permissions')
          .delete()
          .eq('role', role as any)
          .eq('permission_id', permissionId);
        
        rolePerms.delete(permissionId);
      } else {
        // Add permission
        await supabase
          .from('role_permissions')
          .insert([{ role: role as any, permission_id: permissionId }]);
        
        rolePerms.add(permissionId);
      }

      const newMap = new Map(rolePermissions);
      newMap.set(role, rolePerms);
      setRolePermissions(newMap);
      
      toast.success(`Permission ${hasPermission ? 'removed' : 'added'}`);
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    }
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles & Permissions</CardTitle>
        <CardDescription>
          Manage default permissions for each role. Changes affect all users with that role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Object.entries(groupedPermissions).map(([category, perms]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize">{category} Permissions</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Permission</TableHead>
                    {roleConfig.map((role) => (
                      <TableHead key={role.value} className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <role.icon className={`h-4 w-4 ${role.color}`} />
                          <span>{role.label}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {perms.map((perm) => (
                    <TableRow key={perm.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{perm.name.replace(/_/g, ' ')}</div>
                          <div className="text-xs text-muted-foreground">{perm.description}</div>
                        </div>
                      </TableCell>
                      {roleConfig.map((role) => (
                        <TableCell key={role.value} className="text-center">
                          <Checkbox
                            checked={rolePermissions.get(role.value)?.has(perm.id) || false}
                            onCheckedChange={() => toggleRolePermission(role.value, perm.id)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
