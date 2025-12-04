import React from "react";
import PageShell from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AnalyticsOverviewNew() {
  return (
    <PageShell>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Analytics</h1>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export</Button>
            <Button>Schedule Report</Button>
          </div>
        </div>

        {/* Drilldown path */}
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span>Organization</span>
          <span>→</span>
          <span>Course: Mathematics</span>
          <span>→</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">Cohort: Fall 2024</span>
        </div>
        
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10 h-56">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Performance Drilldown</h2>
              <Button size="sm" variant="ghost">Save View</Button>
            </div>
            <div className="h-40 grid place-items-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-lg">
              [Org → Course → Cohort → Student Chart]
            </div>
          </section>
          
          <section className="rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10 h-56">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Early Warning System</h2>
              <Button size="sm" variant="ghost">Configure</Button>
            </div>
            <div className="h-40 grid place-items-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-lg">
              [Alerts • Thresholds • AI Flags • Quick Actions]
            </div>
          </section>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section className="rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10">
            <h2 className="font-medium">Completion Trends</h2>
            <div className="mt-2 h-32 grid place-items-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-lg">
              [Weekly Completion %]
            </div>
          </section>
          
          <section className="rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10">
            <h2 className="font-medium">Engagement Score</h2>
            <div className="mt-2 h-32 grid place-items-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-lg">
              [Time on Task • Interactions]
            </div>
          </section>
          
          <section className="rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10">
            <h2 className="font-medium">Top Misconceptions</h2>
            <div className="mt-2 h-32 grid place-items-center text-slate-500 text-sm border-2 border-dashed border-slate-300 rounded-lg">
              [AI-detected Learning Gaps]
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}