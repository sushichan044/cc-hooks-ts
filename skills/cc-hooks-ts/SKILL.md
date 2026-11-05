---
name: cc-hooks-ts
description: Define and maintain type-safe Claude Code hooks with cc-hooks-ts. Use when creating hook files, choosing typed triggers, adding tool-specific or custom MCP tool schemas, configuring Claude Code hook settings, or selecting success, error, JSON, and deferred responses.
---

# cc-hooks-ts

Use `cc-hooks-ts` to implement Claude Code hooks in TypeScript with trigger-aware input and output types.

## Workflow

1. Confirm the hook event and whether it is tool-specific.
2. Add `cc-hooks-ts` to the project if it is not installed.
3. Define the hook with `defineHook({ trigger, run })`.
4. Use `context.input` only through the type implied by the trigger.
5. Return the narrowest response helper that expresses the behavior.
6. Add the command hook to Claude Code settings with the same event and matcher.
7. Run the hook or project checks before claiming it works.

## Basic hook

```ts
import { defineHook } from "cc-hooks-ts";

const hook = defineHook({
  trigger: { SessionStart: true },
  run: (context) => context.success({ messageForUser: "Session hook ready" }),
});

if (import.meta.main) {
  const { runHook } = await import("cc-hooks-ts");
  await runHook(hook);
}
```

## Tool-specific hooks

Put the tool name inside the event trigger so `context.input.tool_input` is narrowed automatically:

```ts
const hook = defineHook({
  trigger: { PreToolUse: { Read: true } },
  run: (context) => {
    const { file_path } = context.input.tool_input;
    if (file_path.endsWith(".env")) {
      return context.blockingError("Environment files are restricted");
    }
    return context.success();
  },
});
```

Use the same tool name as the matcher in Claude Code settings:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [{ "type": "command", "command": "bun run -i --silent ./hooks/pre-read.ts" }]
      }
    ]
  }
}
```

Tool-specific typing is supported for `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, and `PermissionDenied`.

## Choose a response

- `context.success()` — exit successfully; optional `messageForUser` and supported additional Claude context.
- `context.blockingError(message)` — stop processing and feed the error back to Claude.
- `context.nonBlockingError(message?)` — report a problem without blocking normal processing.
- `context.json(payload)` — return event-specific structured JSON when advanced hook output is required.
- `context.defer(handler, { timeoutMs })` — experimental async JSON output for bounded background work.

Prefer the simple helpers unless the hook requires fields only available through structured JSON.

## Multiple events and narrowing

When one hook listens to multiple events, narrow `context.input.hook_event_name` before using event-specific fields. Capture narrowed values before entering a deferred callback when TypeScript cannot preserve the narrowing across that closure.

## Custom MCP tools

Augment `ToolSchema` when the hook targets a custom tool:

```ts
declare module "cc-hooks-ts" {
  interface ToolSchema {
    mcp__example__lookup: {
      input: { query: string };
      response: { result: string };
    };
  }
}
```

Then use the custom tool name in the trigger exactly as Claude Code exposes it.

## Conditional execution

Use `shouldRun` for deterministic runtime conditions that should skip the hook entirely:

```ts
const hook = defineHook({
  trigger: { Notification: true },
  shouldRun: () => process.platform === "darwin",
  run: (context) => context.success(),
});
```

## Guardrails

- Keep the trigger and Claude Code settings event/matcher aligned.
- Do not cast `context.input` to bypass the trigger-derived type; fix the trigger instead.
- Treat `defer` as experimental and bound long work with `timeoutMs`.
- Use module augmentation for custom tools rather than replacing library types.
- Follow the repository's installed `cc-hooks-ts` version; hook events track Claude Code changes over time.
- For advanced JSON output, check the library types and current Claude Code hook contract instead of inventing fields.

## Repository references

For deeper details, inspect `README.md`, `src/context.ts`, `src/define.ts`, and the runnable files under `examples/` in the `cc-hooks-ts` repository.
