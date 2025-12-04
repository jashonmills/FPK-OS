import React from "react";

type KpiCardProps = {
  title: string;
  value: string | number;
  delta?: string; // e.g., "+3.2% WoW"
  onClick?: () => void;
  icon?: React.ReactNode;
};

export function KpiCard({ title, value, delta, onClick, icon }: KpiCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur p-4 ring-1 ring-black/5 dark:ring-white/10 hover:shadow transition"
    >
      <div className="flex items-center gap-3">
        {icon}
        <div className="text-sm text-slate-600 dark:text-slate-300">{title}</div>
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {delta && <div className="text-xs mt-1 text-emerald-600">{delta}</div>}
    </button>
  );
}