import type { HookEvent } from "@anthropic-ai/claude-agent-sdk";

import { describe, expectTypeOf, it } from "vitest";

import type { SupportedHookEvent } from "./event.ts";

describe("SupportedHookEvent", () => {
  it("matches upstream type", () => {
    expectTypeOf<SupportedHookEvent>().toEqualTypeOf<HookEvent>();
  });
});
