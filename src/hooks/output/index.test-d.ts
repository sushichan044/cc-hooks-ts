import type { SyncHookJSONOutput } from "@anthropic-ai/claude-agent-sdk";
import type { Except, Simplify } from "type-fest";

import { describe, expectTypeOf, it } from "vitest";

import type { HookOutput } from ".";
import type { SupportedHookEvent } from "..";

// Extract event names that have hookSpecificOutput
type SpecificOutputEventNames = NonNullable<
  SyncHookJSONOutput["hookSpecificOutput"]
>["hookEventName"];

// Common fields without hookSpecificOutput
type CommonHookOutput = Except<SyncHookJSONOutput, "hookSpecificOutput">;

// Extract upstream output type for each event
type ExtractUpstreamOutput<EventName extends SupportedHookEvent> =
  EventName extends SpecificOutputEventNames
    ? CommonHookOutput & {
        hookSpecificOutput?: Extract<
          SyncHookJSONOutput["hookSpecificOutput"],
          { hookEventName: EventName }
        >;
      }
    : CommonHookOutput;

describe("HookOutputs", () => {
  it("matches upstream type", () => {
    type Ours = {
      [K in keyof HookOutput]: Simplify<HookOutput[K]>;
    };

    type Upstream = {
      [K in keyof HookOutput]: Simplify<ExtractUpstreamOutput<K>>;
    };

    expectTypeOf<Ours>().toEqualTypeOf<Upstream>();
  });
});
