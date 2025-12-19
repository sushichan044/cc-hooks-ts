# cc-hooks-ts Claude Code Plugin

Official Claude Code plugin for learning and using cc-hooks-ts - a TypeScript library for building type-safe Claude Code hooks.

## What's Included

This plugin provides comprehensive guidance for building Claude Code hooks with full type safety:

### Skills

- **getting-started**: Quick start in 15 minutes
  - Installation and setup
  - Your first SessionStart hook
  - Tool-specific PreToolUse hook example
  - Configuration and testing

- **core-concepts**: Deep dive into fundamentals
  - Hook lifecycle and execution model
  - `defineHook` API details
  - Context API (`input`, `success()`, `error()`, `json()`)
  - Runtime validation with Valibot
  - Type system overview

- **event-reference**: Complete event reference
  - All 12 hook events documented
  - Input/output types for each event
  - Use cases and examples
  - Quick reference table

- **tool-specific-hooks**: Master tool patterns
  - 17 built-in tools covered
  - File system, execution, network, and specialized tools
  - Common patterns (security, logging, validation)
  - Type-safe tool input access

## Installation

### Option 1: Local Development (Recommended)

Clone this repository and symlink the plugin to your Claude Code plugins directory:

```bash
# From the cc-hooks-ts repository root
ln -s "$(pwd)/plugin" ~/.claude/plugins/cc-hooks-ts
```

### Option 2: Direct Clone

Clone the plugin directory separately:

```bash
# Clone to Claude Code plugins directory
git clone https://github.com/sushichan044/cc-hooks-ts.git ~/.claude/plugins/cc-hooks-ts-temp
mv ~/.claude/plugins/cc-hooks-ts-temp/plugin ~/.claude/plugins/cc-hooks-ts
rm -rf ~/.claude/plugins/cc-hooks-ts-temp
```

### Verify Installation

Restart Claude Code and verify the plugin is loaded:

```bash
# The plugin should appear in your available skills
claude code --help
```

## Usage

Once installed, Claude Code will automatically reference these skills when helping you with cc-hooks-ts. You can explicitly request guidance:

### Example Prompts

```
"Show me how to get started with cc-hooks-ts"
"How do I create a PreToolUse hook?"
"Explain the hook lifecycle"
"What events are available in cc-hooks-ts?"
"How do I handle tool-specific inputs?"
"Show me security patterns with cc-hooks-ts"
```

## Learning Path

We recommend following this order for the best learning experience:

1. **Start with getting-started**
   - Understand what cc-hooks-ts is
   - Install and create your first hook
   - Test your setup

2. **Understand core-concepts**
   - Learn the hook lifecycle
   - Master the Context API
   - Understand type safety benefits

3. **Reference event-reference as needed**
   - Look up specific events
   - Understand input/output types
   - Find use cases for each event

4. **Explore tool-specific-hooks patterns**
   - Learn tool-specific patterns
   - Apply security and logging patterns
   - Build your own tool interceptors

## Links

- [GitHub Repository](https://github.com/sushichan044/cc-hooks-ts)
- [npm Package](https://www.npmjs.com/package/cc-hooks-ts)
- [Official Claude Code Hooks Documentation](https://code.claude.com/docs/en/hooks)

## Contributing

Found an issue or have a suggestion? Please open an issue on the [GitHub repository](https://github.com/sushichan044/cc-hooks-ts/issues).

## License

MIT License - see the [LICENSE](../LICENSE) file for details.
