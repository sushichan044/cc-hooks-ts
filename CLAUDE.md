# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm test` - Run tests with Vitest
- `pnpm build` - Build with tsdown
- `pnpm lint` - Run ESLint with fixes
- `pnpm format` - Format code with Biome
- `pnpm typecheck` - TypeScript type checking

## Project Architecture

This is a TypeScript library for defining Claude Code hooks with type safety. The core architecture consists of:

### Core Components

- **Hook Definition** (`src/define.ts`): Main entry point providing `defineHook()` function to create type-safe hook definitions
- **Event System** (`src/event.ts`): Defines supported hook events
- **Input System** (`src/input/`):
  - `schemas.ts`: Valibot schemas for validating hook input data with event-specific validation
  - `types.ts`: TypeScript type definitions for input handling
  - `types.test-d.ts`: Type-level testing for input schemas
- **Output Types** (`src/output.ts`): Strongly typed output definitions for different hook types with event-specific properties
- **Context System** (`src/context.ts`): Provides HookContext interface for hook handlers with success/error response helpers
- **Type System** (`src/types.ts`): Complex type utilities for extracting input/output types based on hook trigger configuration
- **Runtime System** (`src/run.ts`): Hook execution engine that handles runtime validation and execution
- **Utilities** (`src/utils/`):
  - `string.ts`: String utility functions
  - `types.ts`: Common type utilities
  - `valibot.ts`: Valibot-specific utilities

### Key Design Patterns

- **Valibot Integration**: Runtime schema validation and TypeScript type inference for all hook inputs
- **Conditional Types**: Precise typing based on hook trigger configuration with complex type utilities
- **Tool Schema Extension**: `ToolSchema` interface supports declaration merging for custom tool definitions
- **Event-Driven Architecture**: 10 distinct hook events with event-specific input validation and output types
- **Runtime Execution**: `runHook` function provides complete hook execution lifecycle with error handling
- **Type-Safe Responses**: Hook handlers return structured responses (`success`, `blocking-error`, `non-blocking-error`)
- **Modular Input System**: Organized input schemas with dedicated validation and type inference per event
- **Context-Based API**: HookContext provides convenient response helpers and strongly typed input access

### Dependencies

#### Runtime

- **valibot**: Schema validation and type inference

#### Development

- **vitest**: Testing framework with type checking enabled
- **typescript-eslint**: Linting with TypeScript support
- **biome**: Code formatting
- **tsdown**: Build tool for TypeScript libraries
- **@virtual-live-lab/eslint-config**: ESLint configuration
- **@virtual-live-lab/tsconfig**: TypeScript configuration

## Coding goodies

### Vitest

- Import vitest api explicitly
- Prefer `describe(target) { it(behavior) }` structures over `test()`
