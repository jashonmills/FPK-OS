import React from "react";

type Variant = "default" | "outline" | "ghost" | "secondary";
type Size = "default" | "sm" | "icon" | "lg";

const variantClasses: Record<Variant, string> = {
  default:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-200",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
  ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-200",
  secondary:
    "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-200",
};

const sizeClasses: Record<Size, string> = {
  default: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-xs",
  icon: "h-9 w-9 px-0",
  lg: "px-4 py-3 text-base",
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-0",
      variantClasses[variant],
      sizeClasses[size],
      className
    )}
    {...props}
  />
));

Button.displayName = "Button";
