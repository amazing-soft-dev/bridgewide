import { sla } from "@/content/sla";
import type { RegionSlug } from "@/content/site";
import {
  emailField,
  engagementField,
  honeypotTripped,
  isRecord,
  limits,
  regionListField,
  regionName,
  textField,
} from "@/lib/form";
import { clientIp, deliverIntake } from "@/lib/intake";
import { jsonResult } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResult({ ok: false, error: "Request body must be JSON.", status: 400 });
  }

  if (!isRecord(payload)) {
    return jsonResult({ ok: false, error: "Request body must be a JSON object.", status: 400 });
  }

  if (honeypotTripped(payload.companyWebsite)) {
    return jsonResult({ ok: true });
  }

  const name = textField(payload.name, limits.name, "Name");
  if (!name.ok) return jsonResult({ ok: false, error: name.error, status: 400 });

  const email = emailField(payload.email);
  if (!email.ok) return jsonResult({ ok: false, error: email.error, status: 400 });

  const company = textField(payload.company, limits.company, "Company");
  if (!company.ok) return jsonResult({ ok: false, error: company.error, status: 400 });

  const roleTitle = textField(payload.roleTitle, limits.roleTitle, "Role title");
  if (!roleTitle.ok) return jsonResult({ ok: false, error: roleTitle.error, status: 400 });

  const regions = regionListField(payload.regions);
  if (!regions.ok) return jsonResult({ ok: false, error: regions.error, status: 400 });

  const engagement = engagementField(payload.engagement);
  if (!engagement.ok) return jsonResult({ ok: false, error: engagement.error, status: 400 });

  const manager = textField(payload.manager, limits.name, "Hiring manager");
  if (!manager.ok) return jsonResult({ ok: false, error: manager.error, status: 400 });

  const stack = textField(payload.stack, limits.roleTitle, "Stack");
  if (!stack.ok) return jsonResult({ ok: false, error: stack.error, status: 400 });

  const band = textField(payload.band, limits.roleTitle, "Band or day rate");
  if (!band.ok) return jsonResult({ ok: false, error: band.error, status: 400 });

  const ninety = textField(payload.ninety, limits.message, "First ninety days");
  if (!ninety.ok) return jsonResult({ ok: false, error: ninety.error, status: 400 });

  const duration =
    engagement.value === "Contract"
      ? textField(payload.duration, limits.roleTitle, "Duration")
      : { ok: true as const, value: "" };
  if (!duration.ok) return jsonResult({ ok: false, error: duration.error, status: 400 });

  if (payload.fee !== "yes") {
    return jsonResult({ ok: false, error: "Acknowledge the fee.", status: 400 });
  }

  const feeLine =
    engagement.value === "Permanent"
      ? "Fee acknowledged: 20% of first-year base and a 12-week replacement."
      : "Fee acknowledged: 18% contract margin. No replacement clock.";

  const message = textField(payload.message, limits.message, "Message");
  if (!message.ok) return jsonResult({ ok: false, error: message.error, status: 400 });

  const regionLine = regions.value
    .split(", ")
    .map((slug) => regionName(slug as RegionSlug))
    .join(", ");

  const result = await deliverIntake({
    kind: "hire",
    email: email.value,
    subject: `Hire brief: ${roleTitle.value} at ${company.value}`,
    ip: clientIp(request),
    visitorSla: sla.employer,
    text: [
      `Name: ${name.value}`,
      `Email: ${email.value}`,
      `Company: ${company.value}`,
      `Role: ${roleTitle.value}`,
      `Regions: ${regionLine}`,
      `Engagement: ${engagement.value}`,
      `Hiring manager: ${manager.value}`,
      `Stack: ${stack.value}`,
      `Band: ${band.value}`,
      `First ninety days: ${ninety.value}`,
      duration.value ? `Duration: ${duration.value}` : "",
      payload.confidential === true ? "Confidential: yes" : "Confidential: no",
      feeLine,
      "",
      message.value,
    ]
      .filter(Boolean)
      .join("\n"),
  });
  if (result.ok) return Response.json({ ok: true, id: result.id });
  return jsonResult(result);
}
