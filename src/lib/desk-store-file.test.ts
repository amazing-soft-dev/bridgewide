import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createFileStore } from "@/lib/desk-store-file";
import { deskStoreContract } from "@/lib/desk-store.contract";

deskStoreContract("the file adapter", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "desk-file-"));
  return { open: () => createFileStore(() => dir) };
});
