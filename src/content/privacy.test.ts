import { describe, expect, it } from "vitest";
import { contact } from "@/content/site";
import { formsCollected, privacySections, processors } from "@/content/privacy";

const all = privacySections.flatMap((section) => [section.title, ...section.paragraphs]).join("\n");

describe("the privacy notice", () => {
  it("says what the site does: forms are emails and nothing is stored", () => {
    expect(all).toMatch(/two emails/i);
    expect(all).toMatch(/do not keep a database of submissions/i);
    expect(all).toMatch(/CV is attached to the email/i);
  });

  it("does not describe a stored profile, an account, or a database record", () => {
    expect(all).not.toMatch(/stored profile|your account|our database holds|record in/i);
    expect(all).not.toMatch(/placeholder|sample/i);
  });

  it("names every company that handles a message", () => {
    for (const name of ["Resend", "Vercel", "Cloudflare Turnstile", "Sentry"]) expect(all).toContain(name);
    expect(processors.map((item) => item.name)).toContain("Hostinger");
  });

  it("covers every form on the site", () => {
    for (const form of ["Hire brief", "CV upload", "Talent pool", "Contact", "Salary guide", "AI-training"]) {
      expect(formsCollected.some((item) => item.form.includes(form))).toBe(true);
    }
  });

  it("gives the desk mailbox for questions, deletion, and rights", () => {
    expect(all).toContain(contact.email);
    expect(all).toMatch(/12 months/);
    expect(all).toMatch(/delete/i);
  });

  it("names each market's place and the right to complain", () => {
    for (const place of ["United States", "Canada", "United Kingdom", "European Union", "Brazil", "Singapore"]) {
      expect(all).toContain(place);
    }
    expect(all).toMatch(/complain to the data protection authority/i);
  });

  it("gives every section a unique id and some text", () => {
    const ids = privacySections.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const section of privacySections) expect(section.paragraphs.length).toBeGreaterThan(0);
  });
});
