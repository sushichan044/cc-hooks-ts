# cc-hooks-ts

Define Claude Code hooks with full type safety using TypeScript and Valibot validation.

## Installation

```bash
npx nypm add cc-hooks-ts
```

## Basic Usage

> [!NOTE]
> We highly recommend using Bun or Deno for automatic dependency downloading at runtime.
>
> - Bun: <https://bun.com/docs/runtime/autoimport>
> - Deno: <https://docs.deno.com/runtime/fundamentals/modules/#managing-third-party-modules-and-libraries>

### Define a Hook

With Bun:

```typescript
#!/usr/bin/env -S bun run --silent
import { defineHook, runHook } from "cc-hooks-ts";

// Session start hook
const sessionHook = defineHook({
  trigger: { SessionStart: true },
  run: (context) => {
    // do something great
    return context.success({
      messageForUser: "Welcome to your coding session!"
    });
  }
});

await runHook(sessionHook);
```

Or with Deno:

```typescript
#!/usr/bin/env -S deno run --quiet --allow-env --allow-read
import { defineHook, runHook } from "npm:cc-hooks-ts";

// Session start hook
const sessionHook = defineHook({
  trigger: { SessionStart: true },
  run: (context) => {
    // do something great
    return context.success({
      messageForUser: "Welcome to your coding session!"
    });
  }
});

await runHook(sessionHook);
```

### Call from Claude Code

Then, load defined hooks in your Claude Code settings at `~/.claude/settings.json`.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$HOME/.claude/<name-of-your-hooks>.ts"
          }
        ]
      }
    ]
  }
}
```

## Custom Tool Type Support

For better type inference in PreToolUse and PostToolUse hooks, you can extend the `ToolSchema` interface to define your own tool types:

### Adding Custom Tool Definitions

Extend the `ToolSchema` interface to add custom tool definitions:

```typescript
// Use "npm:cc-hooks-ts" for Deno
declare module "cc-hooks-ts" {
  interface ToolSchema {
    MyCustomTool: {
      input: {
        customParam: string;
        optionalParam?: number;
      };
      response: {
        result: string;
      };
    };
  }
}
```

Now you can use your custom tool with full type safety:

```typescript
const customToolHook = defineHook({
  trigger: { PreToolUse: { MyCustomTool: true } },
  run: (context) => {
    // context.input.tool_input is typed as { customParam: string; optionalParam?: number; }
    const { customParam, optionalParam } = context.input.tool_input;
    return context.success();
  }
});
```

## API Reference

### defineHook Function

Creates type-safe hook definitions with full TypeScript inference:

```typescript
// Tool-specific PreToolUse hook
const readHook = defineHook({
  trigger: { PreToolUse: { Read: true } },
  run: (context) => {
    // context.input.tool_input is typed as { file_path: string }
    const { file_path } = context.input.tool_input;

    if (file_path.includes('.env')) {
      return context.blockingError('Cannot read environment files');
    }

    return context.success();
  }
});

// Multiple event triggers
const multiEventHook = defineHook({
  trigger: {
    PreToolUse: { Read: true, WebFetch: true },
    PostToolUse: { Read: true }
  },
  shouldRun: () => process.env.NODE_ENV === 'development',
  run: (context) => {
    // Handle different events and tools based on context.input
    return context.success();
  }
});
```

### runHook Function

Executes hooks with complete lifecycle management:

- Reads input from stdin
- Validates input using Valibot schemas
- Creates typed context
- Executes hook handler
- Formats and outputs results

```typescript
await runHook(hook);
```

### Hook Context

The context provides strongly typed input access and response helpers:

```typescript
run: (context) => {
  // Typed input based on trigger configuration
  const input = context.input;

  // Response helpers
  return context.success({ messageForUser: "Success!" });
  // or context.blockingError("Error occurred");
  // or context.nonBlockingError("Warning message");
  // or context.json({ event: "EventName", output: {...} });
}
```

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

## Documentation

For more detailed information about Claude Code hooks, visit the [official documentation](https://docs.anthropic.com/en/docs/claude-code/hooks).

## License

MIT

## Contributing

We welcome contributions! Feel free to open issues or submit pull requests.

---

**Made with ❤️ for hackers using Claude Code**
