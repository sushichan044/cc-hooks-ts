import { describe, expectTypeOf, it } from "vitest";

import type { HookInputs } from "./input";
import type { HookOutput } from "./output";
import type {
  ExtractTriggeredEvent,
  ExtractTriggeredHookInput,
  ExtractTriggeredHookOutput,
} from "./types";

// Declaration merge with ToolSchema in src/index.ts
declare module "./index" {
  interface ToolSchema {
    MyCustomTool: {
      input: {
        customParam: string;
        optionalParam?: number;
      };
      response: {
        data: string;
        success: boolean;
      };
    };
  }
}

describe("ExtractTriggeredHookInput", () => {
  it("should extract default input for non-tool-specific events", () => {
    expectTypeOf<
      ExtractTriggeredHookInput<{ SessionStart: true }>
    >().toEqualTypeOf<HookInputs["SessionStart"]["default"]>();

    expectTypeOf<
      ExtractTriggeredHookInput<{ Notification: true }>
    >().toEqualTypeOf<HookInputs["Notification"]["default"]>();
  });

  it("should return never for empty trigger", () => {
    expectTypeOf<
      ExtractTriggeredHookInput<Record<string, never>>
    >().toEqualTypeOf<never>();
  });

  describe("tool-specific events", () => {
    it("should extract specific tool input for single event with specific key", () => {
      expectTypeOf<
        ExtractTriggeredHookInput<{ PostToolUse: { MyCustomTool: true } }>
      >().toMatchObjectType<{
        tool_input: {
          customParam: string;
          optionalParam?: number;
        };
        tool_name: "MyCustomTool";
      }>();
    });

    it("should extract multiple tool inputs for single event with specific key", () => {
      expectTypeOf<
        ExtractTriggeredHookInput<{
          PreToolUse: { MyCustomTool: true; Read: true };
        }>
      >().toEqualTypeOf<
        | HookInputs["PreToolUse"]["MyCustomTool"]
        | HookInputs["PreToolUse"]["Read"]
      >();
    });

    it("should handle both of tool-specific events and non-tool-specific events", () => {
      expectTypeOf<
        ExtractTriggeredHookInput<{
          PostToolUse: true;
          PreToolUse: { MyCustomTool: true };
          SessionStart: true;
        }>
      >().toEqualTypeOf<
        // fallback type of PostToolUse
        | HookInputs["PostToolUse"]["default"]

        // Tool-specific types of PostToolUse
        | HookInputs["PostToolUse"]["Bash"]
        | HookInputs["PostToolUse"]["Edit"]
        | HookInputs["PostToolUse"]["ExitPlanMode"]
        | HookInputs["PostToolUse"]["Glob"]
        | HookInputs["PostToolUse"]["Grep"]
        | HookInputs["PostToolUse"]["LS"]
        | HookInputs["PostToolUse"]["MultiEdit"]
        | HookInputs["PostToolUse"]["MyCustomTool"]
        | HookInputs["PostToolUse"]["MySecondCustomTool"]
        | HookInputs["PostToolUse"]["NotebookEdit"]
        | HookInputs["PostToolUse"]["Read"]
        | HookInputs["PostToolUse"]["Task"]
        | HookInputs["PostToolUse"]["TodoWrite"]
        | HookInputs["PostToolUse"]["WebFetch"]
        | HookInputs["PostToolUse"]["WebSearch"]
        | HookInputs["PostToolUse"]["Write"]

        // PreToolUse
        | HookInputs["PreToolUse"]["MyCustomTool"]
        // SessionStart
        | HookInputs["SessionStart"]["default"]
      >();
    });
  });
});

describe("ExtractTriggeredEvent", () => {
  it("should extract single event from trigger", () => {
    expectTypeOf<
      ExtractTriggeredEvent<{ PreToolUse: true }>
    >().toEqualTypeOf<"PreToolUse">();

    expectTypeOf<
      ExtractTriggeredEvent<{ SessionStart: true }>
    >().toEqualTypeOf<"SessionStart">();
  });

  it("should extract events regardless of specific tool keys", () => {
    expectTypeOf<
      ExtractTriggeredEvent<{ PreToolUse: { Read: true } }>
    >().toEqualTypeOf<"PreToolUse">();

    expectTypeOf<
      ExtractTriggeredEvent<{ PostToolUse: { MyCustomTool: true } }>
    >().toEqualTypeOf<"PostToolUse">();
  });

  it("should extract multiple events as union", () => {
    expectTypeOf<
      ExtractTriggeredEvent<{
        PreToolUse: true;
        SessionStart: true;
      }>
    >().toEqualTypeOf<"PreToolUse" | "SessionStart">();

    expectTypeOf<
      ExtractTriggeredEvent<{
        Notification: true;
        PostToolUse: { WebFetch: true };
        PreToolUse: { Read: true };
      }>
    >().toEqualTypeOf<"Notification" | "PostToolUse" | "PreToolUse">();
  });
});

describe("ExtractTriggeredHookOutput", () => {
  it("should extract single event output", () => {
    expectTypeOf<
      ExtractTriggeredHookOutput<{ PreToolUse: true }>
    >().toEqualTypeOf<HookOutput["PreToolUse"]>();

    expectTypeOf<
      ExtractTriggeredHookOutput<{ SessionStart: true }>
    >().toEqualTypeOf<HookOutput["SessionStart"]>();
  });

  it("should return never for empty trigger", () => {
    expectTypeOf<
      ExtractTriggeredHookOutput<Record<string, never>>
    >().toEqualTypeOf<never>();
  });

  it("should extract multiple events as union", () => {
    expectTypeOf<
      ExtractTriggeredHookOutput<{
        PreToolUse: true;
        SessionStart: true;
      }>
    >().toEqualTypeOf<HookOutput["PreToolUse"] | HookOutput["SessionStart"]>();

    expectTypeOf<
      ExtractTriggeredHookOutput<{
        Notification: true;
        PostToolUse: { MyCustomTool: true };
        UserPromptSubmit: true;
      }>
    >().toEqualTypeOf<
      | HookOutput["Notification"]
      | HookOutput["PostToolUse"]
      | HookOutput["UserPromptSubmit"]
    >();
  });

  it("should handle tool-specific events consistently", () => {
    expectTypeOf<
      ExtractTriggeredHookOutput<{ PreToolUse: true }>
    >().toEqualTypeOf<
      ExtractTriggeredHookOutput<{ PreToolUse: { MyCustomTool: true } }>
    >();

    expectTypeOf<
      ExtractTriggeredHookOutput<{ PostToolUse: true }>
    >().toEqualTypeOf<
      ExtractTriggeredHookOutput<{ PostToolUse: { Read: true } }>
    >();
  });
});
