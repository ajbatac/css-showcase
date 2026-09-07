import * as React from "react";

export type PatternInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
};

/** Labelled text field with hint, error state and optional leading icon. */
export function PatternInput({
  label,
  hint,
  error,
  icon,
  id,
  className = "",
  ...props
}: PatternInputProps) {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-semibold text-foreground">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-card px-3 transition focus-within:ring-2 focus-within:ring-ring ${
          error ? "border-destructive" : "border-border"
        }`}
      >
        {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
        <input
          {...props}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`min-h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground ${className}`}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-[11px] font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-[11px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
