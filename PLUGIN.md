# cc-hooks-ts Claude Code Plugin

This plugin teaches Claude Code how to effectively use the cc-hooks-ts library for creating type-safe hooks.

## Installation

### From Plugin Marketplace

If this plugin is published to a marketplace, install it through Claude Code's plugin manager:

```bash
claude plugin install cc-hooks-ts
```

### Local Development

Clone this repository and use the `--plugin-dir` flag:

```bash
git clone https://github.com/sushichan044/cc-hooks-ts.git
claude --plugin-dir ./cc-hooks-ts
```

## What This Plugin Provides

### Skills

- **cc-hooks-ts**: Comprehensive guidance for using the cc-hooks-ts library
  - Full API reference for `defineHook` and `runHook`
  - All available hook events and their contexts
  - Tool-specific hook patterns
  - Custom tool type support
  - Common usage patterns and examples

## When Claude Uses This Plugin

Claude will automatically apply the cc-hooks-ts skill when you:
- Mention creating or defining hooks
- Ask about Claude Code hooks with TypeScript
- Request help with tool validation or permission control
- Want to extend Claude Code behavior
- Need type-safe hook implementations

## Plugin Structure

```
cc-hooks-ts/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── skills/
│   └── cc-hooks-ts/
│       └── SKILL.md         # Main skill documentation
└── PLUGIN.md                # This file
```

## Contributing

This plugin is part of the cc-hooks-ts project. See the main [README.md](./README.md) for contribution guidelines.

## License

MIT - Same as the cc-hooks-ts library
