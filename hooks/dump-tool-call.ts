import { appendFile } from "node:fs/promises";
import path from "node:path";

import { defineHook, runHook } from "../src/index.ts";

const hook = defineHook({
  trigger: {
    PostToolUse: true,
    PreToolUse: true,
  },

  run: (c) =>
    c.defer(async () => {
      const event = c.input.hook_event_name;
      const filepath = path.join(c.input.cwd, "hooks", "debug", `${event}.jsonl`);

      await appendFile(filepath, JSON.stringify(c.input) + "\n");

      return {
        event,
        output: {},
      };
    }),
});

await runHook(hook);
