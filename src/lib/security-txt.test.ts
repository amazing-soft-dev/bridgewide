import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contact } from "@/content/site";
import { siteUrl } from "@/components/pages/metadata";

const file = readFileSync(new URL("../../public/.well-known/security.txt", import.meta.url), "utf8");
const field = (name: string) => new RegExp(`^${name}: (.+)$`, "m").exec(file)?.[1].trim();

describe("/.well-known/security.txt (RFC 9116)", () => {
  it("points a reporter at the desk mailbox", () => {
    expect(field("Contact")).toBe(`mailto:${contact.email}`);
  });

  it("has not expired, so renew it before it does", () => {
    const expires = Date.parse(field("Expires") ?? "");
    expect(Number.isNaN(expires)).toBe(false);
    expect(expires).toBeGreaterThan(Date.now());
  });

  it("names its own canonical address", () => {
    expect(field("Canonical")).toBe(`${siteUrl}/.well-known/security.txt`);
  });
});
