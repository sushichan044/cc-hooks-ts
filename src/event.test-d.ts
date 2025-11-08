import type { HookEvent } from "@anthropic-ai/claude-code";

import { describe, expectTypeOf, it } from "vitest";

import type { SupportedHookEvent } from "./event";

describe("SupportedHookEvent", () => {
  it("matches upstream type", () => {
    expectTypeOf<SupportedHookEvent>().toEqualTypeOf<HookEvent>();
  });
});
