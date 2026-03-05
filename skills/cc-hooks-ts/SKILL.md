---
name: cc-hooks-ts
description: Use cc-hooks-ts library to create type-safe Claude Code hooks in TypeScript. Apply when the user wants to define hooks, handle tool events, validate tool inputs, or customize Claude Code behavior with TypeScript.
---

# cc-hooks-ts: Type-Safe Claude Code Hooks

This skill teaches you how to use the cc-hooks-ts library to create type-safe Claude Code hooks with runtime validation.

## What is cc-hooks-ts?

cc-hooks-ts is a TypeScript library that provides:
- Full type safety for Claude Code hook definitions
- Runtime validation using Valibot schemas
- Strongly-typed context for all hook events
- Type-safe tool input/output handling
- Support for custom tool types via declaration merging

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

## Core API

### `defineHook(config)`

Define a hook with full type safety:

```typescript
import { defineHook } from "cc-hooks-ts";

const hook = defineHook({
  // Specify trigger events (required)
  trigger: {
    SessionStart: true,
    // Can specify multiple events
    Stop: true,
  },

  // Optional: conditionally skip hook execution
  shouldRun: () => process.platform === "darwin",

  // Hook implementation (required)
  run: (context) => {
    // Context is typed based on trigger events
    return context.success({
      messageForUser: "Welcome!",
    });
  },
});
```

### `runHook(hook)`

Execute the hook (typically called when the script is run directly):

```typescript
if (import.meta.main) {
  const { runHook } = await import("cc-hooks-ts");
  await runHook(hook);
}
```

## Available Hook Events

### Session Lifecycle
- **SessionStart**: Triggered when a new Claude Code session starts
- **Stop**: Triggered when Claude stops generating a response

### Tool Events
- **PreToolUse**: Before a tool is executed (can deny execution)
- **PostToolUse**: After successful tool execution
- **PostToolUseFailure**: After tool execution fails

### User Interaction
- **UserPromptSubmit**: When user submits a prompt
- **Notification**: When Claude sends a notification

## Context Methods

All hook contexts provide these methods:

### Simple Responses

```typescript
// Success with optional message
context.success({
  messageForUser: "Operation completed",
})

// Block with error message
context.blockingError("Access denied")
```

### Advanced JSON Output

For complex control (permission decisions, system messages, etc.):

```typescript
context.json({
  event: "PreToolUse",
  output: {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Access to .env files is restricted.",
    },
    systemMessage: "Optional system message",
  },
})
```

### Async Operations (Experimental)

For long-running operations without blocking:

```typescript
context.defer(
  async () => {
    await performLongOperation();
    return {
      event: "PostToolUse",
      output: {
        systemMessage: "Background operation completed",
      },
    };
  },
  {
    timeoutMs: 5000, // Optional timeout
  }
)
```

## Tool-Specific Hooks

You can create hooks that only trigger for specific tools:

```typescript
const preReadHook = defineHook({
  trigger: {
    PreToolUse: {
      Read: true,  // Only trigger for Read tool
    },
  },
  run: (context) => {
    // context.input.tool_input is typed as:
    // { file_path: string; limit?: number; offset?: number }
    const { file_path } = context.input.tool_input;

    if (file_path.includes(".env")) {
      return context.blockingError("Cannot read .env files");
    }

    return context.success();
  },
});
```

### Available Built-in Tools

When specifying tool names in PreToolUse/PostToolUse triggers, these tools are available:
- `Read` - Read file contents
- `Write` - Write file contents
- `Edit` - Edit existing files
- `NotebookEdit` - Edit Jupyter notebooks
- `Bash` - Execute bash commands
- `Glob` - Find files by pattern
- `Grep` - Search file contents
- `Task` - Launch sub-agents
- `TaskOutput` - Get output from tasks
- `TodoWrite` - Manage todo lists
- `WebFetch` - Fetch web content
- `WebSearch` - Search the web
- `KillShell` - Kill background shells
- `ExitPlanMode` - Exit planning mode
- `ListMcpResources` - List MCP resources
- `ReadMcpResource` - Read MCP resource

## Custom Tool Types

Extend the library to support custom MCP tools:

```typescript
import { defineHook } from "cc-hooks-ts";

// Add custom tool types via declaration merging
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

// Now get full type safety for your custom tool
const customToolHook = defineHook({
  trigger: { PreToolUse: { mcp__deepwiki__ask_question: true } },
  run: (context) => {
    // Fully typed!
    const { question, repoName } = context.input.tool_input;

    if (question.length > 500) {
      return context.blockingError("Question too long");
    }

    return context.success();
  },
});
```

## Claude Code Configuration

After defining hooks, configure them in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun run -i --silent path/to/hook.ts"
          }
        ]
      }
    ]
  }
}
```

For tool-specific hooks, use the `matcher` field:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "bun run -i --silent path/to/pre-read.ts"
          }
        ]
      }
    ]
  }
}
```

## Common Patterns

### 1. Security - Block Access to Sensitive Files

```typescript
const securityHook = defineHook({
  trigger: { PreToolUse: { Read: true, Write: true, Edit: true } },
  run: (context) => {
    const path = context.input.tool_input.file_path;

    const sensitivePatterns = [".env", "secrets", "credentials"];
    const isSensitive = sensitivePatterns.some(p => path.includes(p));

    if (isSensitive) {
      return context.json({
        event: "PreToolUse",
        output: {
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason: "Access to sensitive files blocked",
          },
        },
      });
    }

    return context.success();
  },
});
```

### 2. Logging - Track Tool Usage

```typescript
const loggingHook = defineHook({
  trigger: { PostToolUse: { Bash: true } },
  run: (context) => {
    const { command } = context.input.tool_input;
    console.log(`[${new Date().toISOString()}] Bash: ${command}`);
    return context.success();
  },
});
```

### 3. Validation - Enforce Constraints

```typescript
const validationHook = defineHook({
  trigger: { PreToolUse: { Bash: true } },
  run: (context) => {
    const { command } = context.input.tool_input;

    // Block dangerous commands
    const dangerousPatterns = ["rm -rf", "sudo", "chmod 777"];
    const isDangerous = dangerousPatterns.some(p => command.includes(p));

    if (isDangerous) {
      return context.blockingError("Dangerous command blocked");
    }

    return context.success();
  },
});
```

### 4. Platform-Specific Hooks

```typescript
const macNotificationHook = defineHook({
  trigger: { Notification: true },
  shouldRun: () => process.platform === "darwin",
  run: (context) => {
    // macOS-specific notification handling
    return context.success();
  },
});
```

## Key Principles

1. **Type Safety First**: The library provides comprehensive TypeScript types. Let them guide you.

2. **Event-Driven**: Hooks respond to specific events in Claude Code's lifecycle.

3. **Context is King**: The context parameter provides everything you need - typed inputs, helper methods, and response builders.

4. **Tool Specificity**: When working with PreToolUse/PostToolUse, specify exact tools for precise control and better type inference.

5. **Progressive Enhancement**: Start simple with `success()` and `blockingError()`, use `json()` for advanced control.

6. **Runtime Safety**: The library validates hook configurations at runtime using Valibot schemas.

## When to Use cc-hooks-ts

Use cc-hooks-ts when the user wants to:
- Define Claude Code hooks with TypeScript
- Get type safety for hook inputs and outputs
- Validate tool inputs before execution
- Add custom behavior to Claude Code sessions
- Control tool permissions programmatically
- Log or monitor Claude Code activities
- Extend Claude Code with custom MCP tool types

## Documentation References

- Full documentation: [README.md](../../README.md)
- Examples: [examples/](../../examples/)
- Official Claude Code hooks docs: https://docs.anthropic.com/en/docs/claude-code/hooks

## Important Notes

- Hooks run in Node.js/Bun/Deno environments
- Use `import.meta.main` to detect direct script execution
- The `defer()` method is experimental and may change
- Enable verbose mode in Claude Code to see async hook outputs
- All hook responses must match the expected JSON schema
