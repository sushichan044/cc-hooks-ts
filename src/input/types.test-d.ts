import { describe, expectTypeOf, it } from "vitest";

import type { ExtendedTools } from "../types";
import type { AutoComplete } from "../utils/types";
import type {
  ExtractAllHookInputsForEvent,
  ExtractExtendedSpecificKeys,
  ExtractSpecificHookInputForEvent,
  HookInputs,
} from "./types";

declare module "claude-kata" {
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

describe("HookInputs", () => {
  describe("PreToolUse", () => {
    it("should handle normal case", () => {
      expectTypeOf<HookInputs["PreToolUse"]["default"]>().toEqualTypeOf<{
        cwd: string;
        hook_event_name: "PreToolUse";
        session_id: string;
        tool_input: unknown;
        tool_name: AutoComplete<string>;
        transcript_path: string;
      }>();
    });

    it("should infer tool-specific case from ToolSchema", () => {
      expectTypeOf<
        HookInputs["PreToolUse"]["MyCustomTool"]
      >().toMatchObjectType<{
        tool_input: {
          customParam: string;
          optionalParam?: number;
        };
        tool_name: "MyCustomTool";
      }>();
    });
  });

  describe("PostToolUse", () => {
    it("should handle normal case", () => {
      expectTypeOf<HookInputs["PostToolUse"]["default"]>().toEqualTypeOf<{
        cwd: string;
        hook_event_name: "PostToolUse";
        session_id: string;
        tool_input: unknown;
        tool_name: string;
        tool_response: unknown;
        transcript_path: string;
      }>();
    });

    it("should infer tool-specific case from ToolSchema", () => {
      expectTypeOf<
        HookInputs["PostToolUse"]["MyCustomTool"]
      >().toMatchObjectType<{
        tool_input: {
          customParam: string;
          optionalParam?: number;
        };
        tool_name: "MyCustomTool";
        tool_response: {
          data: string;
          success: boolean;
        };
      }>();
    });
  });
});

describe("ExtractExtendedSpecificKeys", () => {
  it("should extract valid specific keys for PreToolUse", () => {
    expectTypeOf<
      ExtractExtendedSpecificKeys<"PreToolUse">
    >().toEqualTypeOf<ExtendedTools>();
  });

  it("should extract valid specific keys for PostToolUse", () => {
    expectTypeOf<
      ExtractExtendedSpecificKeys<"PostToolUse">
    >().toEqualTypeOf<ExtendedTools>();
  });
});

describe("ExtractAllHookInputsForEvent", () => {
  it("should extract all inputs for non-tool-specific events", () => {
    expectTypeOf<ExtractAllHookInputsForEvent<"SessionStart">>().toEqualTypeOf<
      HookInputs["SessionStart"]["default"]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"Notification">>().toEqualTypeOf<
      HookInputs["Notification"]["default"]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"SessionEnd">>().toEqualTypeOf<
      HookInputs["SessionEnd"]["default"]
    >();
  });

  it("should extract all inputs for tool-specific events including default", () => {
    expectTypeOf<ExtractAllHookInputsForEvent<"PreToolUse">>().toEqualTypeOf<
      | HookInputs["PreToolUse"]["default"]
      | HookInputs["PreToolUse"]["MyCustomTool"]
      | HookInputs["PreToolUse"]["Read"]
      | HookInputs["PreToolUse"]["WebFetch"]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"PostToolUse">>().toEqualTypeOf<
      | HookInputs["PostToolUse"]["default"]
      | HookInputs["PostToolUse"]["MyCustomTool"]
      | HookInputs["PostToolUse"]["Read"]
      | HookInputs["PostToolUse"]["WebFetch"]
    >();
  });
});

describe("ExtractSpecificHookInputForEvent", () => {
  it("should extract specific tool input for tool-specific events", () => {
    expectTypeOf<
      ExtractSpecificHookInputForEvent<"PreToolUse", "MyCustomTool">
    >().toEqualTypeOf<HookInputs["PreToolUse"]["MyCustomTool"]>();

    expectTypeOf<
      ExtractSpecificHookInputForEvent<"PreToolUse", "Read">
    >().toEqualTypeOf<HookInputs["PreToolUse"]["Read"]>();

    expectTypeOf<
      ExtractSpecificHookInputForEvent<"PostToolUse", "WebFetch">
    >().toEqualTypeOf<HookInputs["PostToolUse"]["WebFetch"]>();
  });

  it("should extract specific tool input with proper tool_input and tool_name typing", () => {
    expectTypeOf<
      ExtractSpecificHookInputForEvent<"PreToolUse", "MyCustomTool">
    >().toMatchObjectType<{
      tool_input: {
        customParam: string;
        optionalParam?: number;
      };
      tool_name: "MyCustomTool";
    }>();

    expectTypeOf<
      ExtractSpecificHookInputForEvent<"PostToolUse", "MyCustomTool">
    >().toMatchObjectType<{
      tool_input: {
        customParam: string;
        optionalParam?: number;
      };
      tool_name: "MyCustomTool";
      tool_response: {
        data: string;
        success: boolean;
      };
    }>();
  });
});
