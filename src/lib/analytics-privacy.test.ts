import { describe, expect, it } from "vitest";
import { privacyUrl } from "@/lib/analytics-privacy";

describe("privacyUrl", () => {
  it("drops a hit that carries an email query", () => {
    expect(privacyUrl({ url: "https://www.bridgewide.org/?email=ada@example.com" })).toBeNull();
  });

  it("strips other query strings", () => {
    expect(privacyUrl({ url: "https://www.bridgewide.org/roles?q=go" })?.url).toBe(
      "https://www.bridgewide.org/roles",
    );
  });

  it("leaves a clean URL unchanged", () => {
    expect(privacyUrl({ url: "https://www.bridgewide.org/contact" })?.url).toBe(
      "https://www.bridgewide.org/contact",
    );
  });
});
