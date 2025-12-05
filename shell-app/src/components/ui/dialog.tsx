import React from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>,
    document.body
  );
};

export const DialogContent: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => (
  <div
    className={cn(
      "relative z-50 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="space-y-1">{children}</div>;

export const DialogTitle: React.FC<
  React.HTMLAttributes<HTMLHeadingElement>
> = ({ className, ...props }) => (
  <h3 className={cn("text-xl font-semibold text-slate-900", className)} {...props} />
);

export const DialogDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => (
  <p className={cn("text-sm text-slate-600", className)} {...props} />
);

export const DialogFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="mt-4 flex justify-end gap-2">{children}</div>;
