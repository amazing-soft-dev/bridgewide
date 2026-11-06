import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { FormStatus as Status } from "@/hooks/use-form-submit";

/** The success or server-error line under a form's fields. */
export function FormStatus({
  status,
  error,
  success,
}: {
  status: Status;
  error: string;
  success: ReactNode;
}) {
  if (status === "success") {
    return (
      <p role="status" className="text-sm text-ink">
        {success}
      </p>
    );
  }
  if (status === "error" && error) {
    return (
      <p role="alert" className="text-sm font-medium text-ink">
        {error}
      </p>
    );
  }
  return null;
}

/** The primary submit button, with its label swapped while sending. */
export function SubmitButton({
  sending,
  children,
  className,
}: {
  sending: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Button type="submit" variant="primary" disabled={sending} className={className}>
      {sending ? "Sending…" : children}
    </Button>
  );
}
