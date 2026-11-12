import { describe, expect, it } from "vitest";
import { disclosures } from "@/content/disclosures";
import { contact } from "@/content/site";

const text = (id: string) => disclosures.find((item) => item.id === id)?.paragraphs.join(" ") ?? "";

describe("recruiter disclosures", () => {
  it("says BridgeWide is an agency that acts for the hiring company and charges candidates nothing", () => {
    expect(text("agency")).toMatch(/recruitment agency/i);
    expect(text("agency")).toMatch(/act for the hiring company/i);
    expect(text("agency")).toMatch(/do not charge candidates/i);
  });

  it("states equal opportunity and refuses a discriminatory brief", () => {
    expect(text("equal-opportunity")).toMatch(/do not discriminate/i);
    expect(text("equal-opportunity")).toMatch(/do not pass on a client brief/i);
  });

  it("tells a candidate how to ask for an accommodation, and to whom", () => {
    expect(text("accommodation")).toContain(contact.email);
    expect(text("accommodation")).toMatch(/accommodation/i);
  });

  it("says the platform pays and sets terms for AI-training work, and BridgeWide does not", () => {
    const ai = text("ai-training");
    expect(ai).toMatch(/platform decides/i);
    expect(ai).toMatch(/pays you/i);
    expect(ai).toMatch(/BridgeWide does not pay you/i);
    expect(ai).toMatch(/only after you agree/i);
  });

  it("has unique ids and no draft markers", () => {
    const ids = disclosures.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(disclosures.map((item) => item.paragraphs.join(" ")).join(" ")).not.toMatch(/placeholder|sample|todo/i);
  });
});
