import { describe, expect, it } from "vitest";
import { DuplicateSubmissionError, type DeskStore, type Submission } from "@/lib/desk-store";

const record = (over: Partial<Submission> = {}): Submission => ({
  id: `BW-${Math.random().toString(36).slice(2, 8)}`,
  kind: "contact",
  at: "2026-11-12T10:00:00.000Z",
  status: "received",
  email: "ada@example.com",
  body: "Hello",
  ...over,
});

/**
 * The behavior every DeskStore adapter must have. Each adapter's test file
 * calls this with a factory that returns `open`, which gives a store pointing
 * at one fresh, empty place. Two stores from the same `open` must see the same
 * data, because separate server instances share one database or folder.
 */
export function deskStoreContract(name: string, makeStore: () => Promise<{ open: () => DeskStore }>) {
  describe(`${name} implements DeskStore`, () => {
    it("saves and lists records in order", async () => {
      const { open } = await makeStore();
      const store = open();
      await store.save(record({ id: "A" }));
      await store.save(record({ id: "B", email: "bo@example.com" }));
      expect((await store.list()).map((item) => item.id)).toEqual(["A", "B"]);
    });

    it("keeps data across separate store instances", async () => {
      const { open } = await makeStore();
      await open().save(record({ id: "A" }));
      expect((await open().list()).map((item) => item.id)).toEqual(["A"]);
    });

    it("finds a live duplicate by email (any case), kind, and role key", async () => {
      const { open } = await makeStore();
      const store = open();
      await store.save(record({ id: "A", email: "Ada@Example.com", roleKey: "Press" }));
      expect((await store.findDuplicate("ada@example.com", "contact", "Press"))?.id).toBe("A");
      expect(await store.findDuplicate("ada@example.com", "contact", "Other")).toBeUndefined();
      expect(await store.findDuplicate("ada@example.com", "hire", "Press")).toBeUndefined();
      expect(await store.findDuplicate("bo@example.com", "contact", "Press")).toBeUndefined();
    });

    it("refuses a second live record for the same person, kind, and role", async () => {
      const { open } = await makeStore();
      const store = open();
      await store.save(record({ id: "A", email: "Ada@Example.com", roleKey: "Press" }));
      await expect(store.save(record({ id: "B", email: "ada@example.com", roleKey: "Press" }))).rejects.toBeInstanceOf(
        DuplicateSubmissionError,
      );
      await store.save(record({ id: "C", email: "ada@example.com", roleKey: "Other" }));
      expect((await store.list()).map((item) => item.id)).toEqual(["A", "C"]);
    });

    it("allows a new record once the old one is deleted", async () => {
      const { open } = await makeStore();
      const store = open();
      await store.save(record({ id: "A" }));
      await store.update("A", { status: "deleted" });
      await store.save(record({ id: "B" }));
      expect((await store.list()).map((item) => item.id)).toEqual(["A", "B"]);
    });

    it("does not count a deleted record as a duplicate", async () => {
      const { open } = await makeStore();
      const store = open();
      await store.save(record({ id: "A", status: "deleted" }));
      expect(await store.findDuplicate("ada@example.com", "contact")).toBeUndefined();
    });

    it("updates a record and returns it, or undefined for an unknown id", async () => {
      const { open } = await makeStore();
      const store = open();
      await store.save(record({ id: "A" }));
      const updated = await store.update("A", { status: "in review" });
      expect(updated?.status).toBe("in review");
      expect((await store.list())[0].status).toBe("in review");
      expect(await store.update("missing", { status: "closed" })).toBeUndefined();
    });

    it("remembers the digest date", async () => {
      const { open } = await makeStore();
      expect(await open().readDigestDate()).toBeUndefined();
      await open().writeDigestDate("2026-11-12");
      expect(await open().readDigestDate()).toBe("2026-11-12");
    });
  });
}
