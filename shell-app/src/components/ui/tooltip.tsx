import React, { useEffect, useRef, useState } from "react";

type TooltipProps = {
  children: React.ReactNode;
};

type TooltipContentProps = React.HTMLAttributes<HTMLDivElement>;

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const TooltipContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <>{children}</>;

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  );
};

export const TooltipTrigger: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
> = ({ children, asChild, ...props }) => {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) return <>{children}</>;

  const child = React.isValidElement(children)
    ? children
    : React.createElement("div", null, children);

  const triggerProps = {
    onMouseEnter: () => ctx.setOpen(true),
    onMouseLeave: () => ctx.setOpen(false),
    onFocus: () => ctx.setOpen(true),
    onBlur: () => ctx.setOpen(false),
    ...props,
  };

  return asChild
    ? React.cloneElement(child as React.ReactElement, triggerProps)
    : React.createElement("div", triggerProps, children);
};

export const TooltipContent: React.FC<TooltipContentProps> = ({
  className,
  children,
  ...props
}) => {
  const ctx = React.useContext(TooltipContext);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ctx?.open) return;
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        el.style.left = "auto";
        el.style.right = "0";
      }
    }
  }, [ctx?.open]);

  if (!ctx?.open) return null;

  return (
    <div
      ref={ref}
      role="tooltip"
      className={cn(
        "absolute z-50 mt-2 w-max max-w-xs rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
