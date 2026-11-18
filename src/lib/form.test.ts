import { describe, expect, it } from "vitest";
import {
  allOk,
  emailField,
  engagementField,
  fieldErrors,
  honeypotTripped,
  limits,
  regionField,
  textField,
  topicField,
} from "@/lib/form";

describe("form fields", () => {
  it("rejects a bad email and accepts a normal one", () => {
    expect(emailField("not-an-email").ok).toBe(false);
    expect(emailField("ada@bridgewide.org").ok).toBe(true);
  });

  it("rejects an over-long name", () => {
    expect(textField("a".repeat(limits.name + 1), limits.name, "Name").ok).toBe(false);
  });

  it("maps an empty topic to Something else and rejects an unknown topic", () => {
    const empty = topicField("");
    expect(empty.ok && empty.value).toBe("Something else");
    expect(topicField("Not a topic").ok).toBe(false);
  });

  it("checks region and engagement", () => {
    expect(regionField("asia").ok).toBe(true);
    expect(regionField("moon").ok).toBe(false);
    expect(engagementField("Permanent").ok).toBe(true);
    expect(engagementField("Temp").ok).toBe(false);
  });

  it("treats a filled honeypot as tripped", () => {
    expect(honeypotTripped("http://spam.test")).toBe(true);
    expect(honeypotTripped("")).toBe(false);
  });

  it("collects field errors", () => {
    const fields = { email: emailField("nope"), name: textField("Ada", limits.name, "Name") };
    expect(allOk(fields)).toBe(false);
    expect(fieldErrors(fields).email).toBeTruthy();
    expect(fieldErrors(fields).name).toBeUndefined();
  });
});
