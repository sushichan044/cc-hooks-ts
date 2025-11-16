import type {
  NotificationHookInput,
  PostToolUseHookInput,
  PreCompactHookInput,
  PreToolUseHookInput,
  SessionEndHookInput,
  SessionStartHookInput,
  StopHookInput,
  SubagentStopHookInput,
  UserPromptSubmitHookInput,
} from "@anthropic-ai/claude-agent-sdk";
import type { Simplify } from "type-fest";
import type * as v from "valibot";

import { describe, expectTypeOf, it } from "vitest";

import type { HookInputSchemas } from "./schemas";

type InferInputSchema<K extends keyof typeof HookInputSchemas> = v.InferInput<
  (typeof HookInputSchemas)[K]
>;

// Simplify<T> is needed to flatten type aliases for proper comparison
describe("HookInputSchemas", () => {
  describe("PreToolUse", () => {
    it("matches upstream type", () => {
      expectTypeOf<Simplify<InferInputSchema<"PreToolUse">>>().toEqualTypeOf<
        Simplify<PreToolUseHookInput>
      >();
    });
  });

  describe("PostToolUse", () => {
    it("matches upstream type", () => {
      expectTypeOf<Simplify<InferInputSchema<"PostToolUse">>>().toEqualTypeOf<
        Simplify<PostToolUseHookInput>
      >();
    });
  });

  describe("Notification", () => {
    it("matches upstream type", () => {
      expectTypeOf<Simplify<InferInputSchema<"Notification">>>().toEqualTypeOf<
        Simplify<NotificationHookInput>
      >();
    });
  });

  describe("UserPromptSubmit", () => {
    it("matches upstream type", () => {
      expectTypeOf<
        Simplify<InferInputSchema<"UserPromptSubmit">>
      >().toEqualTypeOf<Simplify<UserPromptSubmitHookInput>>();
    });
  });

  describe("Stop", () => {
    it("matches upstream type", () => {
      expectTypeOf<Simplify<InferInputSchema<"Stop">>>().toEqualTypeOf<
        Simplify<StopHookInput>
      >();
    });
  });

  describe("SubagentStop", () => {
    it("matches upstream type", () => {
      expectTypeOf<Simplify<InferInputSchema<"SubagentStop">>>().toEqualTypeOf<
        Simplify<SubagentStopHookInput>
      >();
    });
  });

  describe("PreCompact", () => {
    it("matches upstream type", () => {
      expectTypeOf<Simplify<InferInputSchema<"PreCompact">>>().toEqualTypeOf<
        Simplify<PreCompactHookInput>
      >();
    });
  });

  describe("SessionStart", () => {
    it("matches upstream type", () => {
      expectTypeOf<Simplify<InferInputSchema<"SessionStart">>>().toEqualTypeOf<
        Simplify<SessionStartHookInput>
      >();
    });
  });

  describe("SessionEnd", () => {
    it("matches upstream type", () => {
      expectTypeOf<Simplify<InferInputSchema<"SessionEnd">>>().toEqualTypeOf<
        Simplify<SessionEndHookInput>
      >();
    });
  });
});
