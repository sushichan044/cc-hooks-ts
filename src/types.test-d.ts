import { describe, expectTypeOf, it } from "vitest";

import type { HookInput, HookOutput } from "./hooks";
import type { ExtractTriggeredHookInput, ExtractTriggeredHookOutput } from "./types";

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
    expectTypeOf<ExtractTriggeredHookInput<{ SessionStart: true }>>().toEqualTypeOf<
      HookInput["SessionStart"]["default"]
    >();

    expectTypeOf<ExtractTriggeredHookInput<{ Notification: true }>>().toEqualTypeOf<
      HookInput["Notification"]["default"]
    >();
  });

  it("should return never for empty trigger", () => {
    expectTypeOf<ExtractTriggeredHookInput<Record<string, never>>>().toEqualTypeOf<never>();
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
        HookInput["PreToolUse"]["MyCustomTool"] | HookInput["PreToolUse"]["Read"]
      >();
    });

    it("should handle both of tool-specific events and non-tool-specific events", () => {
      expectTypeOf<
        ExtractTriggeredHookInput<{
          PostToolUse: { Read: true };
          PreToolUse: { MyCustomTool: true };
          SessionStart: true;
        }>
      >().toEqualTypeOf<
          // Tool-specific types of PostToolUse
          | HookInput["PostToolUse"]["Read"]
          // PreToolUse
          | HookInput["PreToolUse"]["MyCustomTool"]
          // SessionStart
          | HookInput["SessionStart"]["default"]
      >();
    });
  });
});

describe("ExtractTriggeredHookOutput", () => {
  it("should extract single event output", () => {
    expectTypeOf<ExtractTriggeredHookOutput<{ PreToolUse: true }>>().toEqualTypeOf<
      HookOutput["PreToolUse"]
    >();

    expectTypeOf<ExtractTriggeredHookOutput<{ SessionStart: true }>>().toEqualTypeOf<
      HookOutput["SessionStart"]
    >();
  });

  it("should return never for empty trigger", () => {
    expectTypeOf<ExtractTriggeredHookOutput<Record<string, never>>>().toEqualTypeOf<never>();
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
      HookOutput["Notification"] | HookOutput["PostToolUse"] | HookOutput["UserPromptSubmit"]
    >();
  });

  it("should handle tool-specific events consistently", () => {
    expectTypeOf<ExtractTriggeredHookOutput<{ PreToolUse: true }>>().toEqualTypeOf<
      ExtractTriggeredHookOutput<{ PreToolUse: { MyCustomTool: true } }>
    >();

    expectTypeOf<ExtractTriggeredHookOutput<{ PostToolUse: true }>>().toEqualTypeOf<
      ExtractTriggeredHookOutput<{ PostToolUse: { Read: true } }>
    >();
  });
});
