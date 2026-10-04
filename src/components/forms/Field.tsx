import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

const controlClass =
  "w-full border border-stone bg-white px-3 py-2 font-sans text-base text-ink placeholder:text-stone focus-visible:outline-ink";

type Shared = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  id?: string;
  className?: string;
};

type InputFieldProps = Shared & {
  as?: "input";
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "className">;

type TextareaFieldProps = Shared & {
  as: "textarea";
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "name" | "className">;

type SelectFieldProps = Shared & {
  as: "select";
  children: ReactNode;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "name" | "className">;

export type FieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

const fieldKeys = [
  "as",
  "label",
  "error",
  "hint",
  "id",
  "name",
  "className",
  "children",
] as const;

function fieldDomProps(props: FieldProps): Record<string, unknown> {
  const copy = { ...props } as Record<string, unknown>;
  for (const key of fieldKeys) delete copy[key];
  return copy;
}

export function Field(props: FieldProps) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [props.hint ? hintId : undefined, props.error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");
  const className = [
    controlClass,
    props.as === "textarea" ? "min-h-32 resize-y" : "",
    props.className,
  ]
    .filter(Boolean)
    .join(" ");
  const shared = {
    id,
    name: props.name,
    className,
    "aria-invalid": props.error ? (true as const) : undefined,
    "aria-describedby": describedBy || undefined,
  };
  const domProps = fieldDomProps(props);

  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-xs tracking-wide text-ink-soft uppercase"
      >
        {props.label}
      </label>
      {props.as === "textarea" ? (
        <textarea
          {...(domProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          {...shared}
        />
      ) : props.as === "select" ? (
        <select {...(domProps as SelectHTMLAttributes<HTMLSelectElement>)} {...shared}>
          {props.children}
        </select>
      ) : (
        <input {...(domProps as InputHTMLAttributes<HTMLInputElement>)} {...shared} />
      )}
      {props.hint ? (
        <p id={hintId} className="text-sm text-stone">
          {props.hint}
        </p>
      ) : null}
      {props.error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-ink">
          {props.error}
        </p>
      ) : null}
    </div>
  );
}

export function Honeypot() {
  const id = useId();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      <label htmlFor={id}>Company website</label>
      <input
        id={id}
        name="companyWebsite"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
