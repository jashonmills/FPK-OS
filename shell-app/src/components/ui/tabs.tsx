import React, { createContext, useContext, useMemo, useState } from "react";

type TabsContextValue = {
  value: string;
  setValue: (val: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

type TabsProps = {
  defaultValue: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
};

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}) => {
  const [internal, setInternal] = useState(defaultValue);
  const currentValue = value ?? internal;

  const ctx = useMemo<TabsContextValue>(
    () => ({
      value: currentValue,
      setValue: (val) => {
        setInternal(val);
        onValueChange?.(val);
      },
    }),
    [currentValue, onValueChange]
  );

  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <div
    className={cn(
      "inline-flex rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600",
      className
    )}
    role="tablist"
    {...props}
  />
);

export const TabsTrigger: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
> = ({ className, value, children, ...props }) => {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const isActive = ctx.value === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={cn(
        "rounded-full px-4 py-2 transition",
        isActive
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900",
        className
      )}
      onClick={() => ctx.setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { value: string }
> = ({ className, value, children, ...props }) => {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn("rounded-xl", className)}
      {...props}
    >
      {children}
    </div>
  );
};
