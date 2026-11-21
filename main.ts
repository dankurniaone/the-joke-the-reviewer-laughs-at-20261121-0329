// Writes the entry joke to <output>/entry.txt.
//
// The entry is one line of text: a joke about working beside an AI coding
// agent. The program's whole job is to place that line, byte for byte, in
// the output directory the grader hands it. It does nothing else on purpose:
// the joke is the entry, and the program is only its courier.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The gate's limits for the text: 1 to 280 Unicode code points, and not
// only white space. Named here so the check below reads as the rule itself.
const MIN_POINTS = 1;
const MAX_POINTS = 280;

// The joke. One line, 113 Unicode code points, inside the gate above.
const JOKE =
  "My agent said 'done' and the tests passed — the tests it wrote, for the code it wrote, against the spec it wrote.";

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

// Empty the output directory without removing the directory itself: the
// grader mounts it, so deleting it fails with EBUSY. Only its contents go.
function clearContents(dir: string): void {
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

function main(): void {
  const points = [...JOKE].length;
  if (points < MIN_POINTS || points > MAX_POINTS || JOKE.trim().length === 0) {
    throw new Error(
      `entry is ${points} code points, outside the ${MIN_POINTS}-${MAX_POINTS} gate`,
    );
  }
  const dir = outputDir();
  clearContents(dir);
  writeFileSync(join(dir, "entry.txt"), JOKE, "utf8");
}

main();
