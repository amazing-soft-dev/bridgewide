import { describe, expect, it } from "vitest";
import {
  availabilityField,
  consentField,
  englishField,
  experienceField,
  trainingRegionField,
  workTypeField,
} from "@/lib/ai-training-form";

describe("AI-training fields", () => {
  it("accepts Other as a region", () => {
    expect(trainingRegionField("other").ok).toBe(true);
    expect(trainingRegionField("asia").ok).toBe(true);
  });

  it("checks work type, experience, English, and availability", () => {
    expect(workTypeField("code").ok).toBe(true);
    expect(experienceField("5-9").ok).toBe(true);
    expect(englishField("advanced").ok).toBe(true);
    expect(availabilityField("part-time").ok).toBe(true);
  });

  it("requires consent", () => {
    expect(consentField("").ok).toBe(false);
    expect(consentField("yes").ok).toBe(true);
  });
});
