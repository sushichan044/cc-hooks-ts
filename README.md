# cc-hooks-ts

Define Claude Code hooks with full type safety using TypeScript.

See [examples](./examples) for more usage examples.

> [!NOTE]
> Starting with versions 2.0.42, we will raise our version number to match Claude Code whenever Hook-related changes occur.
>
> This ensures we can adopt newer type definitions while maintaining compatibility.

## Installation

```bash
# npm
npm i cc-hooks-ts

# yarn
yarn add cc-hooks-ts

# pnpm
pnpm add cc-hooks-ts

# Bun
bun add cc-hooks-ts

# Deno
deno add npm:cc-hooks-ts
```

## Basic Usage

### Define a Hook

```typescript
import { defineHook } from "cc-hooks-ts";

const hook = defineHook({
  // Specify the event(s) that trigger this hook.
  trigger: {
    SessionStart: true
  },
  // Implement what you want to do.
  run: (context) => {
    // Do something great here
    return context.success({
      messageForUser: "Welcome to your coding session!"
    });
  }
});

// import.meta.main is available in Node.js 24.2+ and Bun and Deno
if (import.meta.main) {
  const { runHook } = await import("cc-hooks-ts");
  await runHook(hook);
}
```

### Configure Claude Code

Then, load defined hooks in your Claude Code settings at `~/.claude/settings.json`.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun run -i --silent path/to/your/sessionHook.ts"
          }
        ]
      }
    ]
  }
}
```

## Tool Specific Hooks

In `PreToolUse`, `PostToolUse`, and `PostToolUseFailure` events, you can define hooks specific to tools by specifying tool names in the trigger configuration.

For example, you can create a hook that only runs before the `Read` tool is used:

```typescript
const preReadHook = defineHook({
  trigger: { PreToolUse: { Read: true } },
  run: (context) => {
    // context.input.tool_input is typed as { file_path: string; limit?: number; offset?: number; }
    const { file_path } = context.input.tool_input;

    if (file_path.includes('.env')) {
      return context.blockingError('Cannot read environment files');
    }

    return context.success();
  }
});

if (import.meta.main) {
  const { runHook } = await import("cc-hooks-ts");
  await runHook(preReadHook);
}
```

Then configure it in Claude Code settings:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "bun run -i --silent path/to/your/preReadHook.ts"
          }
        ]
      }
    ]
  }
}
```

### Custom Tool Types Support

You can add support for custom tools by extending the tool type definitions.

This is useful when you want to your MCP-defined tools to have type-safe hook inputs.

```typescript
import { defineHook } from "cc-hooks-ts";

// Example: type-safe hooks for DeepWiki MCP Server tools
declare module "cc-hooks-ts" {
  interface ToolSchema {
    mcp__deepwiki__ask_question: {
      input: {
        question: string;
        repoName: string;
      };
      response: unknown;
    };
  }
}

const deepWikiHook = defineHook({
  trigger: { PreToolUse: { mcp__deepwiki__ask_question: true } },
  run: (context) => {
    // context.input.tool_input is typed as { question: string; repoName: string; }
    const { question, repoName } = context.input.tool_input;

    if (question.length > 500) {
      return context.blockingError('Question is too long');
    }

    return context.success();
  }
});
```

## Advanced Usage

### Conditional Hook Execution

You can conditionally execute hooks based on runtime logic using the `shouldRun` function.
If `shouldRun` returns `false`, the hook will be skipped.

```ts
import { defineHook } from "cc-hooks-ts";

const hook = defineHook({
  trigger: {
    Notification: true
  },
  // Only run this hook on macOS
  shouldRun: () => process.platform === "darwin",
  run: (context) => {
    // Some macOS-specific logic like sending a notification using AppleScript
    return context.success()
  }
});
```

### Advanced JSON Output

Use `context.json()` to return structured JSON output with advanced control over hook behavior.

For detailed information about available JSON fields and their behavior, see the [official documentation](https://docs.anthropic.com/en/docs/claude-code/hooks#advanced:-json-output).

## Documentation

For more detailed information about Claude Code hooks, visit the [official documentation](https://docs.anthropic.com/en/docs/claude-code/hooks).

## Development

```bash
# Run tests
pnpm test

# Build
pnpm build

# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm typecheck
```

## License

MIT

## Contributing

We welcome contributions! Feel free to open issues or submit pull requests.

---

**Made with ❤️ for hackers using Claude Code**
