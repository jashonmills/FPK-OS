import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { PlusCircle, Shield } from "lucide-react";

const mockStaff = [
  { name: "Dr. Eleanor Vance", role: "Principal", department: "Administration", status: "Active" },
  { name: "Marcus Holloway", role: "IT Admin", department: "Technology", status: "Active" },
  { name: "Clara Oswald", role: "Finance Clerk", department: "Finance", status: "Active" },
];

const mockRoles = [
  { name: "Principal", userCount: 1, description: "Full access to school administration and academic oversight." },
  { name: "Teacher", userCount: 12, description: "Access to courses, students, and communication tools." },
  { name: "Finance Clerk", userCount: 2, description: "Limited access to fees and payment systems." },
];

const PermissionRow: React.FC<{
  name: string;
  description?: string;
  level?: number;
  defaultChecked?: boolean;
}> = ({ name, description, level = 0, defaultChecked = false }) => {
  return (
    <div className="flex items-start" style={{ marginLeft: `${level * 20}px` }}>
      <Switch id={name} defaultChecked={defaultChecked} />
      <Label htmlFor={name} className="ml-3">
        <p className="font-medium">{name}</p>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </Label>
    </div>
  );
};

export const StaffManagementPage = () => {
  const [activeRole] = useState("Finance Clerk");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff & Role Management</h1>
        <p className="text-slate-500 mt-1">
          Manage staff profiles, roles, and their granular permissions across the platform.
        </p>
      </div>

      <Tabs defaultValue="staff">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff">Staff Profiles</TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="h-4 w-4 mr-2" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Staff Directory</CardTitle>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Staff
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStaff.map((s) => (
                    <TableRow key={s.name}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.role}</TableCell>
                      <TableCell>{s.department}</TableCell>
                      <TableCell>
                        <Badge>{s.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Roles</CardTitle>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockRoles.map((r) => (
                    <div
                      key={r.name}
                      className="p-3 rounded-lg border bg-slate-50 cursor-pointer hover:bg-slate-100"
                    >
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-sm text-slate-500">{r.userCount} users</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Permissions for "{activeRole}"</CardTitle>
                  <CardDescription>Control exactly what users with this role can see and do.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-primary-700">ISOS Permissions</h4>
                    <div className="space-y-4">
                      <PermissionRow
                        name="Page: Fees & Payments"
                        description="Access to the financial hub."
                        defaultChecked
                      />
                      <PermissionRow
                        name="Feature: View Balances"
                        description="See student account balances."
                        level={1}
                        defaultChecked
                      />
                      <PermissionRow
                        name="Feature: Record Payments"
                        description="Log incoming tuition and fee payments."
                        level={1}
                        defaultChecked
                      />
                      <PermissionRow
                        name="Feature: Issue Refunds"
                        description="Authorize and process refunds."
                        level={1}
                      />
                      <PermissionRow
                        name="AI Tool: Use Financial Forecaster"
                        description="Predict revenue based on historical data."
                        level={1}
                        defaultChecked
                      />
                      <PermissionRow
                        name="Page: Student Info (SIS)"
                        description="Access to student records."
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-primary-700">FPK Pulse Permissions</h4>
                    <div className="space-y-4">
                      <PermissionRow
                        name="Access FPK Pulse"
                        description="Allows user to see the FPK Pulse link and access the dashboard."
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <Button>Save Permissions</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffManagementPage;
