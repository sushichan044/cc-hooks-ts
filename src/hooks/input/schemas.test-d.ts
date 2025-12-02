import type { HookInput } from "@anthropic-ai/claude-agent-sdk";
import type { Simplify } from "type-fest";
import type * as v from "valibot";

import { describe, expectTypeOf, it } from "vitest";

import type { HookInputSchemas } from "./schemas";

// HookInputSchemas is marked as readonly since it annotated with `as const`, so normalize into readonly types
type NormalizeSchemas<T> = Readonly<{
  // Simplify<T> is needed to flatten intersections
  [K in keyof T]: Simplify<T[K]>;
}>;

describe("HookInputSchemas", () => {
  it("matches upstream type", () => {
    type Ours = {
      [K in keyof typeof HookInputSchemas]: v.InferInput<(typeof HookInputSchemas)[K]>;
    };

    type Upstream = {
      [H in HookInput as H["hook_event_name"]]: H;
    };

    expectTypeOf<NormalizeSchemas<Ours>>().toEqualTypeOf<NormalizeSchemas<Upstream>>();
  });
});
