import React, { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

type SelectContextValue = {
  value?: string;
  setValue: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SelectContext = createContext<SelectContextValue | null>(null);

export const Select: React.FC<{
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}> = ({ value, defaultValue, onValueChange, children }) => {
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const [open, setOpen] = useState(false);
  const current = value ?? internal;
  const setValue = (val: string) => {
    setInternal(val);
    onValueChange?.(val);
    setOpen(false);
  };
  return (
    <SelectContext.Provider value={{ value: current, setValue, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, children, ...props }) => {
  const ctx = useContext(SelectContext);
  return (
    <button
      className={`flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${className ?? ""}`}
      type="button"
      onClick={(e) => {
        ctx?.setOpen(!ctx?.open);
        props.onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export const SelectValue: React.FC<{ placeholder?: string }> = ({
  placeholder,
}) => {
  const ctx = useContext(SelectContext);
  return (
    <span className="text-left">
      {ctx?.value ?? <span className="text-slate-400">{placeholder}</span>}
    </span>
  );
};

export const SelectContent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const ctx = useContext(SelectContext);
  if (!ctx?.open) return null;
  return (
    <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
      {children}
    </div>
  );
};

export const SelectPortal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return createPortal(children, document.body);
};

export const SelectItem: React.FC<{
  value: string;
  children: React.ReactNode;
}> = ({ value, children }) => {
  const ctx = useContext(SelectContext);
  const active = ctx?.value === value;
  return (
    <button
      className={`flex w-full items-center px-3 py-2 text-sm text-left transition hover:bg-slate-100 ${
        active ? "bg-slate-100 font-semibold" : "text-slate-700"
      }`}
      onClick={() => ctx?.setValue(value)}
      type="button"
    >
      {children}
    </button>
  );
};
