# Getting Started with cc-hooks-ts

Quick introduction to building type-safe Claude Code hooks with cc-hooks-ts.

## When to Use This Skill

Use this skill when:

- You're new to cc-hooks-ts and want to get started quickly
- You need to create your first Claude Code hook
- You want to understand the basic setup and configuration

## What is cc-hooks-ts?

cc-hooks-ts is a TypeScript library for defining Claude Code hooks with complete type safety. It provides:

- **Full Type Safety**: TypeScript types for all hook events and tool inputs
- **Runtime Validation**: Automatic input validation using Valibot
- **Rich IDE Support**: Autocomplete and type checking in your editor
- **Simple API**: Intuitive `defineHook` and `runHook` functions

### Why Type Safety Matters

Without type safety, accessing tool inputs requires manual type checking:

```typescript
// Unsafe: No type checking
const filePath = context.input.tool_input.file_path; // Might not exist!
```

With cc-hooks-ts, you get compile-time guarantees:

```typescript
// Safe: TypeScript knows exactly what's available
const { file_path } = context.input.tool_input; // ✅ Type-checked
```

## Installation

Choose your preferred package manager:

```bash
# npm
npm install cc-hooks-ts

# yarn
yarn add cc-hooks-ts

# pnpm
pnpm add cc-hooks-ts

# Bun
bun add cc-hooks-ts

# Deno
deno add npm:cc-hooks-ts
```

## Your First Hook: SessionStart

Let's create a simple hook that runs when a Claude Code session starts.

### Step 1: Create the Hook File

Create a file named `welcome-hook.ts`:

```typescript
import { defineHook } from "cc-hooks-ts";

const hook = defineHook({
  // Specify when this hook triggers
  trigger: {
    SessionStart: true
  },

  // Define what happens when triggered
  run: (context) => {
    return context.success({
      messageForUser: "Welcome to your coding session! 🚀"
    });
  }
});

// Run the hook when executed directly
if (import.meta.main) {
  const { runHook } = await import("cc-hooks-ts");
  await runHook(hook);
}
```

### Step 2: Configure Claude Code

Add the hook to your Claude Code settings at `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun run -i --silent /path/to/welcome-hook.ts"
          }
        ]
      }
    ]
  }
}
```

**Note**: Adjust the command based on your runtime:

- Bun: `bun run -i --silent`
- Node.js (v24.2+): `node --import tsx/esm`
- Deno: `deno run -A`

### Step 3: Test Your Hook

Start a new Claude Code session:

```bash
claude code
```

You should see: "Welcome to your coding session! 🚀"

## Tool-Specific Hook: PreToolUse

Now let's create a more advanced hook that intercepts tool usage - a security hook that prevents reading `.env` files.

### Step 1: Create the Security Hook

Create `security-hook.ts`:

```typescript
import { defineHook } from "cc-hooks-ts";

const hook = defineHook({
  // Only trigger for the Read tool
  trigger: {
    PreToolUse: {
      Read: true
    }
  },

  run: (context) => {
    // TypeScript knows tool_input has file_path!
    const { file_path } = context.input.tool_input;

    // Block access to sensitive files
    if (file_path.includes(".env")) {
      return context.json({
        event: "PreToolUse",
        output: {
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason: "Access to .env files is restricted for security."
          }
        }
      });
    }

    // Allow all other files
    return context.success();
  }
});

if (import.meta.main) {
  const { runHook } = await import("cc-hooks-ts");
  await runHook(hook);
}
```

### Step 2: Configure the Hook

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "tools": ["Read"],
        "hooks": [
          {
            "type": "command",
            "command": "bun run -i --silent /path/to/security-hook.ts"
          }
        ]
      }
    ]
  }
}
```

### Step 3: Test Security Protection

Try to read a `.env` file in Claude Code:

```bash
# This will be blocked by your hook
claude code "read the .env file"
```

You'll see an error message about restricted access.

## Understanding the Context API

The `context` parameter in your `run` function provides four main methods:

### context.success()

Returns a successful result, optionally with a message:

```typescript
return context.success({
  messageForUser: "Operation completed!",
  additionalClaudeContext: "Extra info for Claude"
});
```

### context.blockingError()

Returns an error that stops execution:

```typescript
return context.blockingError("Critical failure: operation aborted");
```

### context.nonBlockingError()

Returns an error that doesn't stop execution:

```typescript
return context.nonBlockingError("Warning: something went wrong");
```

### context.json()

Returns advanced JSON output for fine-grained control:

```typescript
return context.json({
  event: "PreToolUse",
  output: {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny"
    }
  }
});
```

## Type Safety in Action

Notice how TypeScript helps you avoid errors:

```typescript
defineHook({
  trigger: { PreToolUse: { Read: true } },
  run: (context) => {
    // ✅ TypeScript knows this is FileReadInput
    const { file_path } = context.input.tool_input;

    // ❌ TypeScript error: 'command' doesn't exist on FileReadInput
    const { command } = context.input.tool_input;
  }
});
```

## Common Issues

### Hook Not Executing

1. Check the file path in `settings.json` is correct
2. Verify the command syntax for your runtime
3. Ensure the hook file has no syntax errors

### Import Errors

Make sure you have cc-hooks-ts installed:

```bash
bun install cc-hooks-ts
```

### Type Errors

Ensure your TypeScript is configured correctly:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "ESNext"
  }
}
```

## Next Steps

Now that you've created your first hooks, explore:

- **core-concepts**: Understand the hook lifecycle and APIs in depth
- **event-reference**: Learn about all 12 hook events
- **tool-specific-hooks**: Master patterns for all 17 built-in tools

## See Also

- [Claude Code Hooks Documentation](https://code.claude.com/docs/en/hooks)
- [cc-hooks-ts README](https://github.com/sushichan044/cc-hooks-ts)
- [npm Package](https://www.npmjs.com/package/cc-hooks-ts)
