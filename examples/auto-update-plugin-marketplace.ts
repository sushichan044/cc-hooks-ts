import { defineHook } from "cc-hooks-ts";
import { x } from "tinyexec";

const hook = defineHook({
  trigger: {
    SessionStart: true,
  },

  run: (c) =>
    c.defer(async () => {
      // This take some time.
      // If we run this hook synchronously, it may block the TUI to load.
      const res = await x("claude", ["plugin", "marketplace", "update"]);

      if (res.exitCode !== 0) {
        return {
          event: "SessionStart",
          output: {
            systemMessage: `Failed to update plugin marketplace: ${res.stderr}`,
          },
        };
      }

      return {
        event: "SessionStart",
        output: {
          systemMessage: "Updated plugin marketplace successfully!",
        },
      };
    }),
});

if (import.meta.main) {
  const { runHook } = await import("cc-hooks-ts");
  await runHook(hook);
}
