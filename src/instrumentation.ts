import { envProblems } from "@/lib/env-check";

/** Runs once when the server starts. Say plainly, in the log, what is missing. */
export function register() {
  for (const problem of envProblems(process.env)) {
    const line = JSON.stringify({ event: "env-check", level: problem.level, message: problem.message });
    if (problem.level === "error") console.error(line);
    else console.warn(line);
  }
}
