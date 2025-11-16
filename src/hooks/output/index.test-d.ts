import type { SyncHookJSONOutput } from "@anthropic-ai/claude-agent-sdk";
import type { Except, Simplify } from "type-fest";

import { describe, expectTypeOf, it } from "vitest";

import type { ExtractHookOutput } from ".";

// Hooks outputs CommonHookOutputs are no need to be tested
describe("HookOutputs", () => {
  describe("PreToolUse", () => {
    it("matches upstream type", () => {
      type Upstream = Simplify<
        Except<SyncHookJSONOutput, "hookSpecificOutput"> & {
          hookSpecificOutput?: Extract<
            SyncHookJSONOutput["hookSpecificOutput"],
            { hookEventName: "PreToolUse" }
          >;
        }
      >;

      expectTypeOf<
        Simplify<ExtractHookOutput<"PreToolUse">>
      >().toEqualTypeOf<Upstream>();
    });
  });

  describe("PostToolUse", () => {
    it("matches upstream type", () => {
      type Upstream = Simplify<
        Except<SyncHookJSONOutput, "hookSpecificOutput"> & {
          hookSpecificOutput?: Extract<
            SyncHookJSONOutput["hookSpecificOutput"],
            { hookEventName: "PostToolUse" }
          >;
        }
      >;

      expectTypeOf<
        Simplify<ExtractHookOutput<"PostToolUse">>
      >().toEqualTypeOf<Upstream>();
    });
  });

  describe("UserPromptSubmit", () => {
    it("matches upstream type", () => {
      type Upstream = Simplify<
        Except<SyncHookJSONOutput, "hookSpecificOutput"> & {
          hookSpecificOutput?: Extract<
            SyncHookJSONOutput["hookSpecificOutput"],
            { hookEventName: "UserPromptSubmit" }
          >;
        }
      >;

      expectTypeOf<
        Simplify<ExtractHookOutput<"UserPromptSubmit">>
      >().toEqualTypeOf<Upstream>();
    });
  });

  describe("Stop", () => {
    it("matches upstream type", () => {
      type Upstream = Simplify<
        Except<SyncHookJSONOutput, "hookSpecificOutput">
      >;

      expectTypeOf<
        Simplify<ExtractHookOutput<"Stop">>
      >().toEqualTypeOf<Upstream>();
    });
  });

  describe("SubagentStop", () => {
    it("matches upstream type", () => {
      type Upstream = Simplify<
        Except<SyncHookJSONOutput, "hookSpecificOutput">
      >;

      expectTypeOf<
        Simplify<ExtractHookOutput<"SubagentStop">>
      >().toEqualTypeOf<Upstream>();
    });
  });

  describe("SessionStart", () => {
    it("matches upstream type", () => {
      type Upstream = Simplify<
        Except<SyncHookJSONOutput, "hookSpecificOutput"> & {
          hookSpecificOutput?: Extract<
            SyncHookJSONOutput["hookSpecificOutput"],
            { hookEventName: "SessionStart" }
          >;
        }
      >;

      expectTypeOf<
        Simplify<ExtractHookOutput<"SessionStart">>
      >().toEqualTypeOf<Upstream>();
    });
  });
});
