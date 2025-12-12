# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A TypeScript library for defining Claude Code hooks with type safety. Provides runtime validation and strongly-typed definitions for hook configurations.

## Development Commands

YOU MUST RUN `pnpm run check` to run all quality checks before completing any tasks.

- `pnpm test` - Run tests with Vitest
- `pnpm build` - Build with tsdown
- `pnpm lint` - Run ESLint with fixes
- `pnpm format` - Format code with oxfmt
- `pnpm typecheck` - TypeScript type checking

## Repository Structure

### Source Code (`src/`)

- **Root files** - Core library APIs (hook definition, execution, context)
- **`hooks/`** - Hook event definitions, input validation schemas, output types
- **`utils/`** - Shared utility functions for strings, types, and validation

### Other Directories

- **`docs/`** - Documentation and guides
- **`dist/`** - Build output (generated)

## When to Touch What

| Goal                                                    | Where to Work       |
| ------------------------------------------------------- | ------------------- |
| Add new hook event / Backport upstream hook type change | `src/hooks/`        |
| Modify input validation                                 | `src/hooks/input/`  |
| Change output types                                     | `src/hooks/output/` |
| Update tool schema definitions                          | `src/index.ts`      |
| Add utility functions                                   | `src/utils/`        |
| Update documentation                                    | `docs/`             |

## Coding Goodies

### Vitest

- Import vitest API explicitly
- Prefer `describe(target) { it(behavior) }` structures over `test()`

### Type System Design Philosophy

- **Convergence Point Validation**: Test complex conditional type chains at final output with concrete literal types
- **Boundary Design**: Validate TypeScript inference at abstract→concrete type transformation points
- **Contract-Focused**: Test usage patterns (contract boundaries) rather than implementation details
- **Inference Proof**: Prove complex type operation combinations with concrete type results
- **Resilience Design**: Choose validation points that resist internal implementation changes
