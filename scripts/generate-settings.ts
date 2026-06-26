import type { Settings } from "@anthropic-ai/claude-agent-sdk";
import { SUPPORTED_HOOK_EVENTS } from "../src/hooks/event.ts";
import { defu } from "defu";
import { writeFile } from "node:fs/promises";

const base = {
  $schema: "https://json.schemastore.org/claude-code-settings.json",
  env: {
    BASH_DEFAULT_TIMEOUT_MS: "300000",
    BASH_MAX_TIMEOUT_MS: "1200000",
    CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR: "1",
    DISABLE_AUTOUPDATER: "1",
    DISABLE_BUG_COMMAND: "1",
    DISABLE_ERROR_REPORTING: "1",
    DISABLE_TELEMETRY: "1",
    ENABLE_BACKGROUND_TASKS: "1",
    ENABLE_TOOL_SEARCH: "1",
  },
} satisfies Settings;

const autoInstrumentationHooks = SUPPORTED_HOOK_EVENTS.reduce(
  (hooks, event) => {
    hooks[event] = [
      {
        hooks: [
          {
            type: "command",
            command: `node scripts/log-hook-event.ts ${event}`,
          },
        ],
      },
    ];

    return hooks;
  },
  {} as NonNullable<Settings["hooks"]>,
);

const resolvedSettings = defu(
  {
    hooks: autoInstrumentationHooks,
  },
  base,
);

await writeFile(".claude/settings.json", JSON.stringify(resolvedSettings, null, 2));
