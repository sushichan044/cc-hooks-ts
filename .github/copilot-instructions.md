# Copilot Code Review Instructions

`cc-hooks-ts` is a TypeScript library that defines Claude Code hook types with runtime validation via `valibot`. It tracks upstream `@anthropic-ai/claude-agent-sdk` and Claude Code versioning. The published surface is the source of truth for downstream type-safe hook authors.

When reviewing PRs, prioritize the checks below. Cite file paths and approximate line locations. Apply each check whenever its trigger fires. If no trigger fires, post no comment.

## 1. Runtime dependency range vs API usage drift

Trigger: the diff adds a call, named import, or member access for a symbol from a package listed under `dependencies` in `package.json` (NOT `devDependencies`, NOT JS / TS built-ins, NOT Node.js core), AND `package.json` is NOT modified in the same diff.

Action: ask the author to verify the declared range covers the version that introduced the symbol. The lockfile (`pnpm-lock.yaml`) may resolve a newer version locally so tests pass, but consumers can resolve any in-range older version and hit `TypeError: <symbol> is not a function` at import time. Adding `v.guard(...)` (valibot 1.3.0+) without bumping `valibot` was the actual regression that prompted this rule. Surface the question even when the symbol looks old — verifying the introduction version is the author's job.

## 2. Hook contract parity with upstream and test coverage

Trigger: the diff modifies any of:

- an input schema in `src/hooks/input/schemas.ts`
- the hook event listing in `src/hooks/event.ts`
- an output type under `src/hooks/output/`
- the `ToolSchema` interface or input/output re-exports in `src/index.ts`

Action: confirm BOTH —

(a) Test coverage: a `*.test-d.ts` or `*.test.ts` exercises the changed surface, either added in this diff or already covering the field/type. If neither, flag.

(b) Upstream justification: the PR description, commit message, or linked PR/issue references an `@anthropic-ai/claude-agent-sdk` version, Claude Code version, or specific upstream change. If absent, request it.

## 3. Schema and TypeScript type stay symmetric

The valibot schema in `src/hooks/input/schemas.ts` and the TS types in `src/hooks/input/types.ts` must describe the same fields. Types are usually derived via `v.InferOutput` over `HookInputSchemas`. Flag hand-written types that diverge from the schema, conditional type chains in `types.ts` missing an event key the schema defines, or new schema entries with no type-level surface.

## 4. Hook event coverage is exhaustive

When `SupportedHookEvent` in `src/hooks/event.ts` gains or loses an event, every conditional type chain keyed on the event name (notably `src/hooks/input/types.ts` and `src/hooks/output/`) and every `HookInputSchemas` entry must match. Flag any one-sided addition or deletion.

## 5. Tests assert behavior, not implementation

Tests describe and assert WHAT the code does (observable contract), not HOW (private fields, internal call sequences, intermediate type shapes). Flag tests named after internal symbols, tests that duplicate implementation logic, or `*.test-d.ts` cases that pin implementation-detail intermediate types instead of validating the final convergence point with concrete literal types.

## 6. Public API stability

`dist/` ships only what `src/index.ts` exports plus its type re-exports. Renaming, removing, or changing the shape of an exported symbol is breaking. Flag such diffs unless the PR description explicitly calls out the break. Adding `@package` to a previously public export is also breaking.

## Out of scope

- Style / naming bikeshedding — trust ESLint, oxfmt, publint.
- Diffs touching only docs, CI configs, dependabot config, or test scaffolding outside the above categories.
