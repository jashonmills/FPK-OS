// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Shield, BarChart2, PieChart, BrainCircuit } from "lucide-react";

const topContributors = [
  { rank: 1, name: "Jashon Mills", posts: 7, comments: 1, messages: 31, total: 39 },
  { rank: 2, name: "Alissa.ada", posts: 1, comments: 0, messages: 9, total: 10 },
  { rank: 3, name: "Al", posts: 1, comments: 0, messages: 3, total: 4 },
];

const featureFlags = [
  { name: "Community Events", description: "Community calendar and event RSVP system" },
  { name: "Community Reflections", description: "Daily prompt system where users share reflections" },
  { name: "Granular Reactions", description: "Five types of reactions instead of just support" },
  { name: "Operation Spearhead", description: "AI-powered moderation for private messages and group chats" },
];

const moderationLogs = [
  {
    type: "Ban",
    severity: "High (8/10)",
    status: "expired",
    reason: "Automatic ban: SHAMING",
    message:
      'Message: "test testing voice messaging right now seems like it works pretty good fuck shit retard"',
    date: "Nov 10, 2025 5:48 PM",
  },
  { type: "AI Action", action: "ALLOWED", message: 'Message: "Hi"', date: "Oct 27, 2025 3:19 PM" },
];

export const FpkNexusPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Shield className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nexus Admin Panel</h1>
          <p className="text-slate-500 mt-1">Manage your organization's private social platform, FPK Nexus.</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="flags">Flags</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="appeals">Appeals</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>Platform statistics and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-500">Total Users</p>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-slate-500">0 active bans</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-500">Total Posts</p>
                    <div className="text-2xl font-bold">9</div>
                    <p className="text-xs text-slate-500">Across all circles</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-500">Total Messages</p>
                    <div className="text-2xl font-bold">43</div>
                    <p className="text-xs text-slate-500">1 comments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-500">Total Supports</p>
                    <div className="text-2xl font-bold">7</div>
                    <p className="text-xs text-slate-500">Reactions given</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 w-48 mx-auto bg-slate-200 rounded-full flex items-center justify-center">
                  <PieChart size={64} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 w-full bg-slate-200 flex items-center justify-center">
                  <BarChart2 size={64} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              {topContributors.map((c) => (
                <div key={c.rank} className="flex items-center justify-between p-2 border-b">
                  <div>
                    <span className="font-bold">
                      #{c.rank} {c.name}
                    </span>
                    <p className="text-sm text-slate-500">
                      {c.posts} posts • {c.comments} comments • {c.messages} messages
                    </p>
                  </div>
                  <div className="font-bold text-lg">{c.total}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Search users, view profiles, and manage bans.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <Input placeholder="Search by email, username, or ID..." className="flex-1 min-w-[220px]" />
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Users (5)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users (5)</SelectItem>
                      <SelectItem value="admins">Admins</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-4 p-4 border rounded-lg flex justify-between items-center">
                  <p>
                    Lauren <br />
                    <small className="text-slate-500">adinajack2@gmail.com</small>
                  </p>
                  <Button className="text-rose-600 border-rose-200 hover:bg-rose-50">
                    Ban
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flags Tab */}
        <TabsContent value="flags" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Control which features are enabled for all users. Changes take effect immediately.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {featureFlags.map((f) => (
                <div key={f.name} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{f.name}</h4>
                    <p className="text-sm text-slate-500">{f.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Logs</CardTitle>
              <CardDescription>View all AI moderation actions, ban history, and appeal outcomes.</CardDescription>
            </CardHeader>
            <CardContent>
              {moderationLogs.map((log, i) => (
                <div key={i} className="p-3 border rounded-lg mb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant={log.type === "Ban" ? "destructive" : "secondary"}>{log.type}</Badge>
                      <p className="text-sm font-semibold">{log.reason || log.action}</p>
                    </div>
                    <p className="text-xs text-slate-500">{log.date}</p>
                  </div>
                  <p className="text-sm mt-2 bg-slate-100 p-2 rounded">{log.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appeals Tab */}
        <TabsContent value="appeals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ban Appeals</CardTitle>
              <CardDescription>Review user appeals for AI-issued bans.</CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center text-slate-500">
              No pending appeals
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invites Tab */}
        <TabsContent value="invites" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Invite System Stats</CardTitle>
              <CardDescription>Monitor referral program performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 text-center">
                <div className="p-4">
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-slate-500">Invite Codes</p>
                </div>
                <div className="p-4">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-slate-500">Total Referrals</p>
                </div>
                <div className="p-4">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-slate-500">Pending Rewards</p>
                </div>
                <div className="p-4">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-slate-500">Rewarded</p>
                </div>
              </div>
              <div className="mt-4">
                <Button className="w-full">Process Pending Rewards Now</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Content Creation Studio */}
      <div className="mt-12">
        <div className="flex items-center gap-4 mb-4">
          <BrainCircuit className="h-8 w-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">AI Content Creation Studio</h2>
            <p className="text-slate-500 mt-1">
              Generate blog posts and announcements using your organization's knowledge base.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Content Topic</Label>
                <Input placeholder="e.g., 'The importance of mental health for students'" />
              </div>
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="announcement">Community Announcement</SelectItem>
                    <SelectItem value="social">Social Media Snippet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">Generate Content</Button>
              </div>
            </div>
            <Textarea placeholder="Your AI-generated content will appear here..." rows={10} />
            <div className="text-right">
              <Button>Publish to Nexus</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FpkNexusPage;
