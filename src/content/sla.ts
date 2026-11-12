/** One reply sentence per audience. Pages, FAQs, and form success lines use these. */

export const sla = {
  employer: "A person answers, usually within two working hours.",
  role: "The desk replies within two working hours on Pacific desk days.",
  training: "The desk aims to review this within three business days.",
} as const;

export const AI_CONSENT_WORDING =
  "I understand my profile is shared with a platform only after I agree to that introduction.";

export const TALENT_CONSENT_WORDING =
  "Keep my CV and profile for 12 months so the desk can write if a matching role opens. I can ask for it to be deleted sooner.";

export const TALENT_CONSENT_VERSION = "talent-pool-12-months-v1";
export const AI_CONSENT_VERSION = "ai-intro-v1";
