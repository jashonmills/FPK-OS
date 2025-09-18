import React from "react";
import PageShell from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudentsManagementNew() {
  return (
    <PageShell>
      <div className="p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Students</h1>
          <div className="flex gap-2">
            <Button variant="outline">Invite</Button>
            <Button>Bulk Enroll</Button>
          </div>
        </header>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Input className="max-w-xs" placeholder="Search students..." />
          <Select>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="struggling">Struggling</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All cohorts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cohorts</SelectItem>
              <SelectItem value="fall2024">Fall 2024</SelectItem>
              <SelectItem value="spring2024">Spring 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Roster */}
        <div className="mt-4 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10">
          <div className="text-slate-500 text-sm h-64 grid place-items-center border-2 border-dashed border-slate-300 rounded-lg">
            [Roster Table with Search, Filters, Student 360 Drawer]
            <div className="text-xs mt-2 text-center">
              • Last Active • Join Status • Bulk Actions<br />
              • Drill to Student Profile • Interventions • Messaging
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}