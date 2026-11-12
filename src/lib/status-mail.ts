import type { SubmissionStatus } from "@/lib/desk-store";

export const statusSubjects: Record<SubmissionStatus, string> = {
  received: "BridgeWide received your note",
  "in review": "BridgeWide is reviewing your note",
  introduced: "BridgeWide introduced you",
  closed: "BridgeWide closed your note",
  paused: "BridgeWide paused your profile",
  deleted: "BridgeWide deleted your profile",
};

export function statusBody(status: SubmissionStatus, id: string): string {
  const line: Record<SubmissionStatus, string> = {
    received: "We have it. A person will reply within the published desk hours.",
    "in review": "A consultant is reading what you sent.",
    introduced: "Your name has gone to the hiring manager or the platform you agreed to.",
    closed: "This note is closed. Write to the desk if you want it reopened.",
    paused: "Your profile is paused. We will not introduce you until you ask us to resume.",
    deleted: "Your profile and CV are marked for deletion.",
  };
  return [`Reference: ${id}`, line[status]].join("\n");
}

export function scopingCallUrl(complete: boolean): string | null {
  if (!complete) return null;
  const url = process.env.NEXT_PUBLIC_SCOPING_CALL_URL?.trim();
  return url || null;
}
