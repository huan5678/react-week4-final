import * as React from "react"

import { cn } from "@/lib/utils"


export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  type?: "text" | "email" | "password" | "number" | "search" | "tel" | "url" | "date" | "time" | "datetime-local" | "month" | "week" | "file";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-[0.625rem] border border-slate-200 border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 focus-visible:ring-2",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
