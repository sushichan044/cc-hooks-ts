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

- **Hook Definition**: Main entry point providing `defineHook()` function to create type-safe hook definitions
- **Event System**: Defines supported hook events (see `src/event.ts` for current list)
- **Input System**: Valibot schemas for validating hook input data with event-specific validation and TypeScript type definitions
- **Output Types**: Strongly typed output definitions for different hook types with event-specific properties
- **Context System**: Provides HookContext interface for hook handlers with success/error response helpers
- **Type System**: Complex type utilities for extracting input/output types based on hook trigger configuration
- **Runtime System**: Hook execution engine that handles runtime validation and execution
- **Utilities**: Common utility functions for strings, types, and Valibot integration

For detailed file structure and specific implementations, explore the `src/` directory.

### Key Design Patterns

- **Valibot Integration**: Runtime schema validation and TypeScript type inference for all hook inputs
- **Conditional Types**: Precise typing based on hook trigger configuration with complex type utilities
- **Tool Schema Extension**: `ToolSchema` interface supports declaration merging for custom tool definitions
- **Event-Driven Architecture**: Multiple distinct hook events with event-specific input validation and output types
- **Runtime Execution**: `runHook` function provides complete hook execution lifecycle with error handling
- **Type-Safe Responses**: Hook handlers return structured responses (`success`, `blocking-error`, `non-blocking-error`)
- **Modular Input System**: Organized input schemas with dedicated validation and type inference per event
- **Context-Based API**: HookContext provides convenient response helpers and strongly typed input access

### Implementation Reference

- **Available Events**: Check `src/event.ts` for the current list of supported hook events
- **Input Schemas**: See `src/input/schemas.ts` for available input validation schemas
- **Tool Definitions**: Refer to the `ToolSchema` interface in `src/index.ts` for extendable tool definitions

### Dependencies

#### Runtime

- **valibot**: Schema validation and type inference

#### Development

- **vitest**: Testing framework with type checking enabled
- **typescript-eslint**: Linting with TypeScript support
- **biome**: Code formatting
- **tsdown**: Build tool for TypeScript libraries

## Coding goodies

### Vitest

- Import vitest api explicitly
- Prefer `describe(target) { it(behavior) }` structures over `test()`

### Type System Design Philosophy

- **Convergence Point Validation**: Test complex conditional type chains at final output with concrete literal types
- **Boundary Design**: Validate TypeScript inference at abstract→concrete type transformation points
- **Contract-Focused**: Test usage patterns (contract boundaries) rather than implementation details
- **Inference Proof**: Prove complex type operation combinations with concrete type results
- **Resilience Design**: Choose validation points that resist internal implementation changes
