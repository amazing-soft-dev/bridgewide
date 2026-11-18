import { describe, expect, it } from "vitest";
import { people } from "@/content/site";
import { portraits } from "@/content/ai-training";
import { placeLabel } from "@/lib/place-label";

describe("placeLabel", () => {
  it("drops a bracket that repeats the country", () => {
    expect(placeLabel("Canada", "Canada")).toBe("Canada");
    expect(placeLabel("United States", "USA")).toBe("United States");
  });

  it("keeps the region in brackets when it adds something", () => {
    expect(placeLabel("United Kingdom", "Europe")).toBe("United Kingdom (Europe)");
    expect(placeLabel("Mexico", "LATAM")).toBe("Mexico (LATAM)");
    expect(placeLabel("Singapore", "Asia")).toBe("Singapore (Asia)");
  });

  it("puts a city first", () => {
    expect(placeLabel("United States", "USA", "Chicago")).toBe("Chicago, United States");
    expect(placeLabel("Colombia", "LATAM", "Bogotá")).toBe("Bogotá, Colombia (LATAM)");
  });
});

describe("the people on the site", () => {
  it("show the rule on every consultant card, and no repeated bracket", () => {
    for (const person of people) {
      expect(person.focus).toBe(placeLabel(person.country, person.regionLabel));
      expect(person.focus).not.toMatch(/Canada \(Canada\)|United States \(USA\)/);
    }
    expect(people.find((person) => person.id === "priya-raman")?.focus).toBe("United States");
  });

  it("show the rule on every AI-training portrait", () => {
    for (const person of portraits) {
      expect(person.place).not.toMatch(/United States \(USA\)|Canada \(Canada\)/);
    }
    expect(portraits.some((person) => person.place === "Chicago, United States")).toBe(true);
  });
});
