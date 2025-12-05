import * as React from "react";
import { cn } from "./utils";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <label className={cn("inline-flex items-center cursor-pointer", className)}>
      <input
        type="checkbox"
        ref={ref}
        className="sr-only peer"
        {...props}
      />
      <span
        className="h-5 w-9 rounded-full bg-gray-300 peer-checked:bg-primary-500 transition-colors duration-200 flex items-center px-0.5"
        aria-hidden="true"
      >
        <span className="h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 peer-checked:translate-x-4" />
      </span>
    </label>
  )
);
Switch.displayName = "Switch";

export default Switch;
