import React from "react";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const Progress: React.FC<{
  value: number;
  className?: string;
}> = ({ value, className }) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-slate-200",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-primary-600 transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
