/**
 * The privacy notice, as data so a test can check it. It describes what the
 * site does today: every form becomes two emails, and nothing is stored in a
 * database. It is a draft for the firm's lawyers, and the page stays noindex
 * until they have signed it off.
 */

import { contact } from "@/content/site";

export const privacyUpdatedOn = "12 November 2026";

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
};

/** Every form on the site, with what it asks for. */
export const formsCollected: readonly { form: string; collects: string }[] = [
  { form: "Hire brief", collects: "your name, work email, company, the role and regions, the engagement, the stack, the pay band, a hiring manager, and your message" },
  { form: "CV upload and role application", collects: "your name, email, region, phone (optional), right to work, and your CV file" },
  { form: "Talent pool", collects: "your name, email, region, country, discipline, years of experience, work mode, a short profile, your CV, and your consent to keep it for 12 months" },
  { form: "Contact", collects: "your name, email, the topic, and your message" },
  { form: "Salary guide and the footer email box", collects: "your email address" },
  { form: "AI-training application and partner inquiry", collects: "the fields on the form, your right to work, your consent to an introduction, and a CV (candidates) or company details and volumes (partners)" },
];

export const processors: readonly { name: string; role: string }[] = [
  { name: "Resend", role: "sends the emails: the message to the desk and the confirmation to you" },
  { name: "Vercel", role: "hosts the site and, in production, measures page views and speed" },
  { name: "Cloudflare Turnstile", role: "checks that a form is filled in by a person; it sees your IP address and browser signals" },
  { name: "Sentry", role: "receives a report when the site hits an error: the page address and technical details, never what you typed, a request body, a cookie, or an email address" },
  { name: "Our email provider", role: "holds the desk mailbox, where every message and CV is kept" },
];

export const privacySections: readonly PrivacySection[] = [
  {
    id: "who",
    title: "Who we are",
    paragraphs: [
      `BridgeWide is a recruitment firm that places software engineers with companies. BridgeWide decides why and how the details you send through this site are used. Write to ${contact.email} for anything in this notice.`,
    ],
  },
  {
    id: "how",
    title: "How a form works",
    paragraphs: [
      "Every form on this site becomes two emails: one to the BridgeWide desk with everything you typed, and one back to you to confirm we have it. We do not keep a database of submissions, and there is no account or login. A CV is attached to the email to the desk and is not stored anywhere else.",
      "That means your message lives in the desk mailbox, and in the mailboxes and logs of the companies that deliver it.",
    ],
  },
  {
    id: "collect",
    title: "What each form collects",
    paragraphs: formsCollected.map((item) => `${item.form}: ${item.collects}.`),
  },
  {
    id: "use",
    title: "What we use it for",
    paragraphs: [
      "To answer you. To match you with a role, or a company with an engineer. To make an introduction, but only after you agree to it. For AI-training work, a profile is introduced to a platform only after you agree to that introduction, and the platform pays you.",
      "We do not sell your details, and we do not use them to send marketing you did not ask for.",
    ],
  },
  {
    id: "who-sees",
    title: "Who handles it",
    paragraphs: [
      ...processors.map((item) => `${item.name} ${item.role}.`),
      "A company or platform sees your details only after you agree to an introduction.",
    ],
  },
  {
    id: "keep",
    title: "How long we keep it",
    paragraphs: [
      "Because nothing is in a database, how long we keep a message is how long it stays in the desk mailbox.",
      `A talent-pool profile and CV are kept for 12 months from the day you consent, then the desk deletes the email. You can ask ${contact.email} to delete it sooner, or to pause it so we do not introduce you. Other messages are kept while we are working with you or answering you, and then deleted when they are no longer needed.`,
      "Deleting an email from the desk mailbox does not delete the copies the delivery companies keep in their own logs for a short time.",
    ],
  },
  {
    id: "analytics",
    title: "Page measurement",
    paragraphs: [
      "In production, Vercel Web Analytics and Speed Insights count page views and measure speed. They are skipped when your browser sends Do Not Track. Query strings are removed, and a page view whose address contains an email is dropped. We do not use advertising cookies.",
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    paragraphs: [
      `Where you live decides which rights you have. In many places, including the United States (for example California), Canada (including Quebec), the United Kingdom, the European Union, Brazil, other parts of Latin America, and Singapore, you can ask for a copy of your details, ask us to correct or delete them, ask us to stop using them, and withdraw a consent you gave. Email ${contact.email} from the address you used. We may ask you to confirm who you are, and we answer within the time the law of your place allows.`,
      "If you are not happy with an answer, you can complain to the data protection authority where you live.",
    ],
  },
  {
    id: "transfers",
    title: "Moving data between countries",
    paragraphs: [
      "The companies listed above run in several countries, including the United States. Your details can leave the country where you are. We rely on the safeguards those companies offer for that.",
    ],
  },
  {
    id: "children",
    title: "Children",
    paragraphs: ["This site is for people who are old enough to work. We do not knowingly collect details from children."],
  },
  {
    id: "changes",
    title: "Changes",
    paragraphs: [`This notice was last updated on ${privacyUpdatedOn}. We change it when what the site does changes.`],
  },
];
