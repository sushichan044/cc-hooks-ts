import { defineHook } from "cc-hooks-ts";

const hook = defineHook({
  trigger: {
    PreToolUse: {
      Read: true,
    },
  },

  run: (context) => {
    // Access tool-specific context
    const toolInput = context.input.tool_input;

    if (toolInput.file_path.includes(".env")) {
      // Return JSON output to deny access to .env files
      // see: https://code.claude.com/docs/en/hooks#pretooluse-decision-control
      return context.json({
        event: "PreToolUse",
        output: {
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason: "Access to .env files is restricted.",
          },
        },
      });
    }

    return context.success();
  },
});

if (import.meta.main) {
  const { runHook } = await import("cc-hooks-ts");
  await runHook(hook);
}
