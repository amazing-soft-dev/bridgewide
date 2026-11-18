"use client";

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

/**
 * A field whose mono label sits inside the box and lifts out of the way on
 * focus or once there is a value. The box turns white and an accent line
 * wipes along its bottom edge while it has focus.
 */

type Shared = {
  label: string;
  name: string;
  error?: string;
  id?: string;
  className?: string;
};

type InputProps = Shared & {
  as?: "input";
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "className" | "placeholder">;

type TextareaProps = Shared & {
  as: "textarea";
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "name" | "className" | "placeholder">;

type SelectProps = Shared & {
  as: "select";
  children: ReactNode;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "name" | "className">;

export type FloatingFieldProps = InputProps | TextareaProps | SelectProps;

const ownKeys = ["as", "label", "error", "id", "name", "className", "children"] as const;

function domProps(props: FloatingFieldProps): Record<string, unknown> {
  const copy = { ...props } as Record<string, unknown>;
  for (const key of ownKeys) delete copy[key];
  return copy;
}

const controlClass =
  "peer block w-full rounded-md bg-transparent px-3.5 pt-6 pb-2 font-sans text-[15.5px] leading-6 text-ink outline-none placeholder:text-transparent";

const ease = "ease-[cubic-bezier(0.2,0.8,0.2,1)]";

export function FloatingField(props: FloatingFieldProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const errorId = `${id}-error`;
  const [filled, setFilled] = useState(() => {
    const value = (props as { defaultValue?: unknown; value?: unknown }).value ??
      (props as { defaultValue?: unknown }).defaultValue;
    return typeof value === "string" ? value.length > 0 : value != null;
  });
  const required = Boolean((props as { required?: boolean }).required);
  const labelText = required ? `${props.label} *` : props.label;

  const shared = {
    id,
    name: props.name,
    placeholder: " ",
    "aria-invalid": props.error ? (true as const) : undefined,
    "aria-describedby": props.error ? errorId : undefined,
    onInput: (event: { currentTarget: { value: string } }) =>
      setFilled(event.currentTarget.value.length > 0),
  };
  const rest = domProps(props);

  return (
    <div className={`grid gap-1.5 ${props.className ?? ""}`}>
      <div
        className={`relative rounded-md border bg-cloud transition-[border-color,background-color] duration-300 focus-within:border-cloud-soft focus-within:bg-white ${
          props.error ? "border-brand" : "border-transparent"
        }`}
      >
        {props.as === "textarea" ? (
          <textarea
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            {...shared}
            className={`${controlClass} min-h-[120px] resize-y`}
          />
        ) : props.as === "select" ? (
          <select
            {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
            {...shared}
            className={`${controlClass} cursor-pointer appearance-none pr-10`}
          >
            {props.children}
          </select>
        ) : (
          <input
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            {...shared}
            className={controlClass}
          />
        )}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute top-[19px] left-3.5 origin-top-left font-mono text-xs tracking-[0.12em] uppercase transition-[translate,scale,color] duration-300 ${ease} peer-focus:-translate-y-[10px] peer-focus:scale-[0.82] peer-focus:text-brand peer-[:not(:placeholder-shown)]:-translate-y-[10px] peer-[:not(:placeholder-shown)]:scale-[0.82] ${
            filled ? "-translate-y-[10px] scale-[0.82] text-brand" : "text-stone"
          }`}
        >
          {labelText}
        </label>
        {props.as === "select" ? (
          <svg
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
        <i
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-b-md bg-brand transition-transform duration-[450ms] ${ease} peer-focus:scale-x-100 motion-reduce:transition-none`}
        />
      </div>
      {props.error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-ink">
          {props.error}
        </p>
      ) : null}
    </div>
  );
}
