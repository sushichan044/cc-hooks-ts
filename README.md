# cc-hooks-ts

Define Claude Code hooks with full type safety using TypeScript.

See [examples](./examples) for more usage examples.

<!-- TOC -->

- [cc-hooks-ts](#cc-hooks-ts)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
    - [Define a Hook](#define-a-hook)
    - [Configure Claude Code](#configure-claude-code)
  - [Tool Specific Hooks](#tool-specific-hooks)
    - [Custom Tool Types Support](#custom-tool-types-support)
  - [Advanced Usage](#advanced-usage)
    - [Conditional Hook Execution](#conditional-hook-execution)
    - [Advanced JSON Output](#advanced-json-output)
    - [Async JSON Output (Experimental)](#async-json-output-experimental)
  - [Documentation](#documentation)
  - [Development](#development)
    - [How to follow the upstream changes](#how-to-follow-the-upstream-changes)
  - [License](#license)
  - [Contributing](#contributing)

<!-- /TOC -->

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
    SessionStart: true,
  },
  // Implement what you want to do.
  run: (context) => {
    // Do something great here
    return context.success({
      messageForUser: "Welcome to your coding session!",
    });
  },
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

    if (file_path.includes(".env")) {
      return context.blockingError("Cannot read environment files");
    }

    return context.success();
  },
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
      return context.blockingError("Question is too long");
    }

    return context.success();
  },
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
    Notification: true,
  },
  // Only run this hook on macOS
  shouldRun: () => process.platform === "darwin",
  run: (context) => {
    // Some macOS-specific logic like sending a notification using AppleScript
    return context.success();
  },
});
```

### Advanced JSON Output

Use `context.json()` to return structured JSON output with advanced control over hook behavior.

For detailed information about available JSON fields and their behavior, see the [official documentation](https://docs.anthropic.com/en/docs/claude-code/hooks#advanced:-json-output).

### Async JSON Output (Experimental)

> [!WARNING]
> This behavior is undocumented by Anthropic and may change.

> [!CAUTION]
> You must enable verbose output if you want to see async hook outputs like `systemMessage` or `hookSpecificOutput.additionalContext`.
>
> You can enable it in Claude Code by going to `/config` and setting "verbose" to true.

Async JSON output allows hooks to perform longer computations without blocking the Claude Code TUI.

You can use `context.defer()` to respond Claude Code immediately while performing longer computations in the background.

You should complete the async operation within a reasonable time (e.g. 15 seconds).

```ts
import { defineHook } from "cc-hooks-ts";

const hook = defineHook({
  trigger: { PostToolUse: { Read: true } },
  run: (context) =>
    context.defer(
      async () => {
        // Simulate long-running computation
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
          event: "PostToolUse",
          output: {
            systemMessage: "Read tool used successfully after async processing!",
          },
        };
      },
      {
        timeoutMs: 5000, // Optional timeout for the async operation.
      },
    ),
});
```

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

### How to follow the upstream changes

Dependabot automatically creates PRs to bump `@anthropic-ai/claude-agent-sdk`. The CI bot posts a type diff comment on each PR.

#### If a Dependabot PR already exists

1. Find the Dependabot PR that bumps `@anthropic-ai/claude-agent-sdk` and check out its branch.

2. Read the type diff posted as a PR comment, then reflect the changes.
   - Edit `src/hooks/` for changed hook input / output types.
     - No need for adding tests in most cases since we are testing the whole type definitions in these files:
       - `src/hooks/input/schemas.test-d.ts`
       - `src/hooks/output/index.test-d.ts`
       - `src/hooks/event.test-d.ts`
       - `src/hooks/permission.test-d.ts`
   - Edit `src/index.ts` for changed tool input / output types.
   - YOU SHOULD NOT MODIFY `version` in `package.json` manually.

3. Push to the Dependabot PR branch.

4. Update the PR title to:

   ```
   fix: update to parity with Claude Code v$(npm info @anthropic-ai/claude-agent-sdk claudeCodeVersion)
   ```

#### If no Dependabot PR exists

1. Create a new branch and bump `@anthropic-ai/claude-agent-sdk` to the latest version:

   ```bash
   git checkout -b fix/bump-claude-agent-sdk
   pnpm add @anthropic-ai/claude-agent-sdk@latest
   ```

2. Get the type diff between the old and new versions:

   ```bash
   npm diff --diff=@anthropic-ai/claude-agent-sdk@<old_version> --diff=@anthropic-ai/claude-agent-sdk@<new_version> '**/*.d.ts'
   ```

3. Reflect the changes (same as step 2 above).

4. Commit, push, and create a PR with the title:

   ```
   fix: update to parity with Claude Code v$(npm info @anthropic-ai/claude-agent-sdk claudeCodeVersion)
   ```

## License

MIT

## Contributing

We welcome contributions! Feel free to open issues or submit pull requests.

---

**Made with ❤️ for hackers using Claude Code**
