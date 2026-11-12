import { contact } from "@/content/site";

/**
 * What a recruiter is expected to say plainly. Draft wording for the firm's
 * lawyers; it sits on the noindex terms page until they have signed it off.
 */
export type Disclosure = {
  id: string;
  title: string;
  paragraphs: readonly string[];
};

export const disclosures: readonly Disclosure[] = [
  {
    id: "agency",
    title: "Who we work for",
    paragraphs: [
      "BridgeWide is a recruitment agency. For permanent and contract searches we act for the hiring company, and the company pays our fee. We do not charge candidates for finding them a role, for presenting their profile, or for anything else.",
    ],
  },
  {
    id: "equal-opportunity",
    title: "Equal opportunity",
    paragraphs: [
      "We consider every candidate on skills and experience. We do not discriminate because of race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability, or any other status the law protects where the role is, and we do not pass on a client brief that asks us to.",
    ],
  },
  {
    id: "accommodation",
    title: "Asking for an accommodation",
    paragraphs: [
      `If you need an accommodation in how you apply or interview, such as a different format, more time, or an accessible document, write to ${contact.email} and say what would help. A person will reply.`,
    ],
  },
  {
    id: "ai-training",
    title: "AI-training work",
    paragraphs: [
      "For AI-training work, BridgeWide introduces candidates to specialist platforms. The platform decides whether to accept you, sets the pay and the terms, and pays you. BridgeWide does not pay you and does not take a share of what the platform pays you. Your profile goes to a platform only after you agree to that introduction.",
    ],
  },
];
