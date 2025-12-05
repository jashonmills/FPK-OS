import React from "react";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const Badge: React.FC<
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?:
      | "secondary"
      | "default"
      | "outline"
      | "success"
      | "destructive"
      | "warning";
  }
> = ({ className, variant = "default", ...props }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
      variant === "secondary"
        ? "bg-slate-100 text-slate-700"
        : variant === "outline"
        ? "border border-slate-300 text-slate-700"
        : variant === "success"
        ? "bg-emerald-100 text-emerald-700"
        : variant === "destructive"
        ? "bg-rose-100 text-rose-700"
        : variant === "warning"
        ? "bg-amber-100 text-amber-700"
        : "bg-primary-100 text-primary-700",
      className
    )}
    {...props}
  />
);
