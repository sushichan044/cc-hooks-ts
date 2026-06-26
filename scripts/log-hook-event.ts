import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import getStdin from "get-stdin";

const event = process.argv[2];
if (!event) {
  process.exit(1);
}

const stdin = await getStdin();
if (!stdin.trim()) {
  process.exit(0);
}

const logDir = join(".claude", "hook-logs");
await mkdir(logDir, { recursive: true });

const line = JSON.stringify(JSON.parse(stdin));
await appendFile(join(logDir, `${event}.jsonl`), `${line}\n`);
