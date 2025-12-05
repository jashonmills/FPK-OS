import React from "react";

type SheetProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

type SheetContentProps = React.HTMLAttributes<HTMLDivElement>;

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange?.(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => onOpenChange?.(false)}
        aria-hidden
      />
      {children}
    </div>
  );
};

export const SheetContent: React.FC<SheetContentProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      "relative z-50 h-full w-full max-w-md bg-white p-6 shadow-2xl sm:max-w-xl",
      className
    )}
    role="dialog"
    {...props}
  >
    {children}
  </div>
);

export const SheetHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`space-y-2 ${className ?? ""}`}>{children}</div>
);

export const SheetFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`mt-auto ${className ?? ""}`}>{children}</div>
);

export const SheetTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h2
    className={cn("text-xl font-semibold text-slate-900", className)}
    {...props}
  />
);

export const SheetDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => (
  <p className={cn("text-sm text-slate-600", className)} {...props} />
);
