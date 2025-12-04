import React from "react";
import PageShell from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";

export default function GoalsManagementNew() {
  return (
    <PageShell>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Goals & Mastery</h1>
          <div className="flex gap-2">
            <Button variant="outline">Export</Button>
            <Button>Schedule Review</Button>
          </div>
        </div>
        
        <div className="mt-4 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10">
          <div className="h-72 grid place-items-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-lg">
            <div className="text-center">
              [Mastery Matrix: Outcomes × Students]
              <div className="text-xs mt-2">
                • Mastery % • Confidence • Last Seen<br />
                • Evidence Linking • Spaced Review Queue
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10">
            <h2 className="font-medium">Evidence Linking</h2>
            <div className="mt-2 h-32 grid place-items-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-lg">
              [Assignments • Notes • Sessions → Student Outcomes]
            </div>
          </section>
          
          <section className="rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10">
            <h2 className="font-medium">Spaced Review Queue</h2>
            <div className="mt-2 h-32 grid place-items-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-lg">
              [Auto-scheduled 5-min Reviews]
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}