import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// A phone's last words at 1 percent: it could have warned its owner at
// 20%, 10%, 5% — and deliberately didn't. The joke is the phone's petty,
// theatrical streak: it chose drama over duty, and the punch lands last.
const LAST_WORDS =
  "I could have warned you at 20%, at 10%, at 5%. I chose drama instead. Goodbye.";

const MAX_CHARS = 199;
const EXPECTED_CHARS = 78;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function guard(line: string): void {
  const chars = [...line].length;
  if (chars !== EXPECTED_CHARS) {
    throw new Error(`entry is ${chars} characters, expected ${EXPECTED_CHARS}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  guard(LAST_WORDS);
  // Create /output if needed; never delete the output directory itself.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, LAST_WORDS, "utf8");
  // Verify the write landed byte-identical, with no trailing newline.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== LAST_WORDS) {
    throw new Error("entry.txt does not match the last words");
  }
  if (!Buffer.from(written, "utf8").equals(Buffer.from(LAST_WORDS, "utf8"))) {
    throw new Error("entry.txt bytes do not match the last words");
  }
  console.log(`${[...written].length} chars: ${written}`);
}

main();
