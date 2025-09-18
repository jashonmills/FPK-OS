import React from "react";
import PageShell from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";

export default function CoursesManagementNew() {
  return (
    <PageShell>
      <div className="p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Courses</h1>
          <div className="flex gap-2">
            <Button>New Course</Button>
            <Button variant="outline">Import</Button>
          </div>
        </header>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Course cards */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i}
              className="rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10 h-40 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-medium">Course {i}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Status: Published • 24 students • Last updated 2 days ago
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>
          ))}
          
          {/* Add course card */}
          <div className="rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10 h-40 grid place-items-center border-2 border-dashed border-slate-300">
            <div className="text-center">
              <Button variant="ghost" className="h-auto flex-col">
                <span className="text-2xl mb-2">+</span>
                <span>Create Course</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10">
          <h2 className="font-medium mb-3">Quality Indicators</h2>
          <div className="text-slate-500 text-sm grid place-items-center h-32 border-2 border-dashed border-slate-300 rounded-lg">
            [Confusion Hotspots • Completion Funnel • Release Rules]
          </div>
        </div>
      </div>
    </PageShell>
  );
}