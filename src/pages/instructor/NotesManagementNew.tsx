import React from "react";
import PageShell from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function NotesManagementNew() {
  return (
    <PageShell>
      <div className="p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Notes</h1>
          <Button>Add Note</Button>
        </header>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Input className="max-w-xs" placeholder="Search notes..." />
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All students</SelectItem>
              <SelectItem value="sarah">Sarah J.</SelectItem>
              <SelectItem value="john">John D.</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Privacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="org">Organization</SelectItem>
              <SelectItem value="family">Family</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10">
          <div className="space-y-3">
            {/* Sample notes */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">Conference with Sarah - Math Progress</h3>
                      <Badge variant="outline" className="text-xs">Private</Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Discussed fractions concept. Student shows good understanding but needs more practice with mixed numbers...
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>2 hours ago</span>
                      <span>by Ms. Johnson</span>
                      <span>Mathematics</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">Edit</Button>
                </div>
              </div>
            ))}
            
            <div className="text-slate-500 text-sm h-20 grid place-items-center border-2 border-dashed border-slate-300 rounded-lg">
              [Templates • Tasks • @mentions • Attachments]
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}