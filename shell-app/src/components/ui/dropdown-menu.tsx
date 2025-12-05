import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type DropdownContextValue = {
  open: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        contentRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <DropdownContext.Provider
      value={{
        open,
        toggle: () => setOpen((prev) => !prev),
        close: () => setOpen(false),
        triggerRef,
      }}
    >
      <div className="relative inline-block" ref={contentRef as any}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger: React.FC<{
  children: React.ReactElement;
  asChild?: boolean;
}> = ({ children }) => {
  const ctx = useContext(DropdownContext);
  if (!ctx || !React.isValidElement(children)) return null;

  return React.cloneElement(
    children as React.ReactElement<any>,
    {
      ref: ctx.triggerRef as React.Ref<any>,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        (children as any).props?.onClick?.(e);
        ctx.toggle();
      },
    } as any
  );
};

export const DropdownMenuContent: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" }
> = ({ className, align = "start", style, children, ...props }) => {
  const ctx = useContext(DropdownContext);
  if (!ctx || !ctx.open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-lg",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, children, ...props }) => {
  const ctx = useContext(DropdownContext);

  return (
    <button
      className={cn(
        "flex w-full items-center px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100",
        className
      )}
      onClick={(e) => {
        props.onClick?.(e);
        ctx?.close();
      }}
      {...props}
    >
      {children}
    </button>
  );
};
