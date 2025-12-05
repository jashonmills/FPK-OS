import React from "react";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const Table: React.FC<
  React.TableHTMLAttributes<HTMLTableElement>
> = ({ className, ...props }) => (
  <table
    className={cn("w-full caption-bottom text-sm text-slate-800", className)}
    {...props}
  />
);

export const TableHeader: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ className, ...props }) => (
  <thead className={cn("[&_tr]:border-b", className)} {...props} />
);

export const TableBody: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ className, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

export const TableRow: React.FC<
  React.HTMLAttributes<HTMLTableRowElement>
> = ({ className, ...props }) => (
  <tr
    className={cn(
      "border-b transition hover:bg-slate-50 data-[state=selected]:bg-slate-100",
      className
    )}
    {...props}
  />
);

export const TableHead: React.FC<
  React.ThHTMLAttributes<HTMLTableCellElement>
> = ({ className, ...props }) => (
  <th
    className={cn(
      "px-4 py-3 text-left align-middle text-xs font-semibold text-slate-500 uppercase tracking-wide",
      className
    )}
    {...props}
  />
);

export const TableCell: React.FC<
  React.TdHTMLAttributes<HTMLTableCellElement>
> = ({ className, ...props }) => (
  <td
    className={cn(
      "px-4 py-3 align-middle text-sm text-slate-800",
      className
    )}
    {...props}
  />
);
