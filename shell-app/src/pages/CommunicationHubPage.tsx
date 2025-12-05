import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Inbox, Send, BarChart2, Search, Paperclip, Clock, History } from "lucide-react";

// --- MOCK DATA ---
const mockConversations = [
  {
    name: "Marcus Holloway (Teacher)",
    lastMessage: "Can you approve my leave request?",
    time: "just now",
    unread: 1,
    avatar: "https://avatar.vercel.sh/marcus.png",
  },
  {
    name: "Sarah Johnson (Parent)",
    lastMessage: "Thanks for the update on the field trip!",
    time: "1 hour ago",
    unread: 0,
    avatar: "https://avatar.vercel.sh/sarah.png",
  },
];
const mockAnnouncements = [
  { title: "Parent-Teacher Conferences", status: "Sent", recipients: "All Parents", engagement: "68% Opened" },
  { title: "Staff Meeting - Dec 10th", status: "Scheduled", recipients: "All Staff", engagement: "N/A" },
];

// --- MODAL COMPONENTS ---
const ScheduleModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Schedule Broadcast</DialogTitle>
        <DialogDescription>Select a date and time to send this announcement.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
        <Input type="time" defaultValue="09:00" />
      </div>
      <DialogFooter>
        <Button>Confirm Schedule</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const HistoryModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Broadcast History & Analytics</DialogTitle>
      </DialogHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Engagement</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAnnouncements.map((ann) => (
            <TableRow key={ann.title}>
              <TableCell className="font-medium">{ann.title}</TableCell>
              <TableCell>{ann.recipients}</TableCell>
              <TableCell>{ann.status}</TableCell>
              <TableCell>{ann.engagement}</TableCell>
              <TableCell>
                <Button variant="link" size="sm">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DialogContent>
  </Dialog>
);

export const CommunicationHubPage = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Communication Command Center</h1>
        <p className="text-slate-500 mt-1">
          Manage direct messages, broadcast announcements, and analyze engagement across the school.
        </p>
      </div>

      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-200/60 p-1 h-auto">
          <TabsTrigger value="inbox" className="py-2 text-sm">
            <Inbox className="h-4 w-4 mr-2" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="broadcasts" className="py-2 text-sm">
            <Send className="h-4 w-4 mr-2" />
            Broadcasts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="py-2 text-sm">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
            <Card className="md:col-span-1 shadow-sm flex flex-col">
              <CardHeader className="border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-3 h-4 w-4 text-slate-500" />
                  <Input placeholder="Search conversations..." className="pl-8" />
                </div>
              </CardHeader>
              <CardContent className="p-2 flex-1 overflow-y-auto">
                {mockConversations.map((convo) => (
                  <div
                    key={convo.name}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer ${
                      convo.unread > 0 ? "bg-primary-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <Avatar>
                      <AvatarImage src={convo.avatar} />
                      <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className={`font-semibold ${convo.unread > 0 ? "text-primary-700" : "text-slate-800"}`}>
                        {convo.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">{convo.lastMessage}</p>
                    </div>
                    {convo.unread > 0 && <div className="w-2 h-2 rounded-full bg-primary-500"></div>}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="md:col-span-2 shadow-sm flex flex-col">
              <CardHeader>
                <CardTitle>Marcus Holloway (Teacher)</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center bg-slate-50 rounded-b-lg">
                <p className="text-slate-500">A live chat interface would be rendered here.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="broadcasts" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Broadcast Studio</CardTitle>
              <CardDescription>Craft, target, and schedule announcements for the entire school community.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input placeholder="Announcement Title" />
                <Textarea placeholder="Type your message here..." rows={8} />
                <div className="flex items-center justify-between">
                  <Button variant="outline">
                    <Paperclip className="h-4 w-4 mr-2" /> Attach
                  </Button>
                  <div className="flex items-center gap-4">
                    <Button>
                      <Send className="h-4 w-4 mr-2" /> Send Now
                    </Button>
                    <Button variant="secondary" onClick={() => setActiveModal("schedule")}>
                      <Clock className="h-4 w-4 mr-2" /> Schedule
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Target Audience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="g1" /> <label htmlFor="g1">All Parents</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="g2" /> <label htmlFor="g2">All Staff</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="g3" /> <label htmlFor="g3">Parents of Grade 10</label>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Delivery Channels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="c1" defaultChecked /> <label htmlFor="c1">In-App Notification</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="c2" /> <label htmlFor="c2">Email</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="c3" /> <label htmlFor="c3">SMS (for urgent only)</label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Announcement Engagement</CardTitle>
              <Button variant="outline" onClick={() => setActiveModal("history")}>
                <History className="h-4 w-4 mr-2" /> View History
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-slate-50 rounded-lg flex items-center justify-center p-4">
                <p className="text-slate-500">A bar chart showing open/read rates would be rendered here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* --- RENDER MODALS --- */}
      <ScheduleModal open={activeModal === "schedule"} onOpenChange={() => setActiveModal(null)} />
      <HistoryModal open={activeModal === "history"} onOpenChange={() => setActiveModal(null)} />
    </div>
  );
};

export default CommunicationHubPage;
