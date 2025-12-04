import type { PropsWithChildren } from "react";

export default function PageShell({ children }: PropsWithChildren) {
  return (
    <main className="relative mx-auto max-w-7xl px-6 lg:px-8 py-6">
      <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-md ring-1 ring-white/20 dark:ring-white/10 min-h-[60vh] border border-white/30">
        {children}
      </div>
    </main>
  );
}