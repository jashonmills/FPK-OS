import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminUserDetail } from "@/hooks/admin/useAdminUserDetail";
import { useAdminUserActions } from "@/hooks/admin/useAdminUserActions";
import { format } from "date-fns";
import { Mail, Calendar, Shield, Users, Activity } from "lucide-react";

interface UserDetailPanelProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailPanel({ userId, isOpen, onClose }: UserDetailPanelProps) {
  const { data: user, isLoading } = useAdminUserDetail(userId);
  const { suspendUser, activateUser, resetPassword } = useAdminUserActions();

  if (!isOpen || !userId) return null;

  const handleSuspend = () => {
    const reason = prompt("Please enter the reason for suspension:");
    if (reason) {
      suspendUser.mutate({ userId, reason });
    }
  };

  const handleActivate = () => {
    activateUser.mutate(userId);
  };

  const handleResetPassword = () => {
    if (user && confirm(`Send password reset email to ${user.email}?`)) {
      resetPassword.mutate({ userId, email: user.email });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        {isLoading || !user ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <SheetHeader className="pb-4 border-b">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.photoUrl || undefined} />
                  <AvatarFallback className="text-xl">
                    {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <SheetTitle className="text-2xl">
                    {user.displayName || user.fullName || "No Name"}
                  </SheetTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role.replace('_', ' ')}
                      </Badge>
                    ))}
                    <Badge
                      variant={
                        user.accountStatus === 'active'
                          ? 'default'
                          : user.accountStatus === 'suspended'
                          ? 'destructive'
                          : 'outline'
                      }
                    >
                      {user.accountStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </SheetHeader>

            <Tabs defaultValue="profile" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="families">Families</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">User ID</div>
                      <div className="text-sm font-mono">{user.userId}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Full Name</div>
                      <div className="text-sm">{user.fullName || "Not provided"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Created</div>
                      <div className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(user.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last Login</div>
                      <div className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {user.lastLogin
                          ? format(new Date(user.lastLogin), "MMMM d, yyyy 'at' h:mm a")
                          : "Never"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {user.accountStatus === 'active' ? (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleSuspend}
                        disabled={suspendUser.isPending}
                      >
                        Suspend Account
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={handleActivate}
                        disabled={activateUser.isPending}
                      >
                        Activate Account
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleResetPassword}
                      disabled={resetPassword.isPending}
                    >
                      Send Password Reset
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="families" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Family Memberships
                    </CardTitle>
                    <CardDescription>
                      User belongs to {user.families.length}{" "}
                      {user.families.length === 1 ? "family" : "families"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {user.families.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Not a member of any families</p>
                    ) : (
                      user.families.map((family) => (
                        <div
                          key={family.familyId}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{family.familyName}</div>
                            <div className="text-sm text-muted-foreground">
                              Role: {family.roleInFamily}
                              {family.isPrimaryAccountHolder && " (Primary)"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {family.memberCount} members, {family.studentCount} students
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {user.engagementMetrics.documentsUploaded}
                      </div>
                      <p className="text-xs text-muted-foreground">Uploaded</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {user.engagementMetrics.logsCreated}
                      </div>
                      <p className="text-xs text-muted-foreground">Created</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">AI Credits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.round(user.engagementMetrics.aiCreditsUsed)}
                      </div>
                      <p className="text-xs text-muted-foreground">Used</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {user.engagementMetrics.aiInteractions}
                      </div>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </CardContent>
                  </Card>
                </div>

                {user.engagementMetrics.lastActivityDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Last Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        {format(
                          new Date(user.engagementMetrics.lastActivityDate),
                          "MMMM d, yyyy 'at' h:mm a"
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
