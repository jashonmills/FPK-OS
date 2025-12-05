import React, { createContext, useContext, useState } from "react";

type AccordionProps = {
  type?: "single";
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
};

type AccordionItemProps = {
  value: string;
  children: React.ReactNode;
};

type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};
type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const AccordionItemContext = createContext<{
  open: boolean;
  toggle: () => void;
} | null>(null);

export const Accordion: React.FC<AccordionProps> = ({
  children,
  className,
}) => <div className={cn("space-y-2", className)}>{children}</div>;

export const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <AccordionItemContext.Provider
      value={{ open, toggle: () => setOpen((o) => !o) }}
    >
      <div className="overflow-hidden rounded-lg border border-slate-200">
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  className,
  children,
  ...props
}) => {
  const ctx = useContext(AccordionItemContext);
  const open = ctx?.open ?? false;
  return (
    <button
      className={cn(
        "flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-100",
        className
      )}
      onClick={() => ctx?.toggle()}
      aria-expanded={open}
      {...props}
    >
      {children}
      <span className="ml-2 text-xs text-slate-500">{open ? "−" : "+"}</span>
    </button>
  );
};

export const AccordionContent: React.FC<AccordionContentProps> = ({
  className,
  children,
  ...props
}) => {
  const ctx = useContext(AccordionItemContext);
  if (!ctx?.open) return null;
  return (
    <div
      className={cn("px-4 py-3 text-sm text-slate-600", className)}
      {...props}
    >
      {children}
    </div>
  );
};
