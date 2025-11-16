import type * as v from "valibot";

import { describe, expectTypeOf, it } from "vitest";

import type { ExtendedTools } from "../types";
import type { AutoComplete } from "../utils/types";
import type { HookInputSchemas } from "./schemas";
import type {
  ExtractAllHookInputsForEvent,
  ExtractExtendedSpecificKeys,
  ExtractSpecificHookInputForEvent,
  HookInputs,
} from "./types";

// Declaration merge with ToolSchema in src/index.ts
declare module "../index" {
  interface ToolSchema {
    MySecondCustomTool: {
      input: {
        param: string;
      };
      response: {
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
        permission_mode?: string;
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
        permission_mode?: string;
        session_id: string;
        tool_input: unknown;
        tool_name: AutoComplete<string>;
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

describe("Auto Completion Ability", () => {
  describe("PreToolUse", () => {
    type PreToolUseSchema = typeof HookInputSchemas.PreToolUse;

    it("should accept string as input of tool_name", () => {
      expectTypeOf<
        v.InferInput<PreToolUseSchema>["tool_name"]
      >().toEqualTypeOf<string>();
    });

    it("should output tool_name as AutoComplete<T>", () => {
      expectTypeOf<
        v.InferOutput<PreToolUseSchema>["tool_name"]
      >().toEqualTypeOf<AutoComplete<string>>();
    });
  });

  describe("PostToolUse", () => {
    type PostToolUseSchema = typeof HookInputSchemas.PostToolUse;

    it("should accept string as input of tool_name", () => {
      expectTypeOf<
        v.InferInput<PostToolUseSchema>["tool_name"]
      >().toEqualTypeOf<string>();
    });

    it("should output tool_name as AutoComplete<T>", () => {
      expectTypeOf<
        v.InferOutput<PostToolUseSchema>["tool_name"]
      >().toEqualTypeOf<AutoComplete<string>>();
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
      // fallback type of PreToolUse
      | HookInputs["PreToolUse"]["default"]
      // Tool-specific types of PreToolUse
      | HookInputs["PreToolUse"]["Bash"]
      | HookInputs["PreToolUse"]["BashOutput"]
      | HookInputs["PreToolUse"]["Edit"]
      | HookInputs["PreToolUse"]["ExitPlanMode"]
      | HookInputs["PreToolUse"]["Glob"]
      | HookInputs["PreToolUse"]["Grep"]
      | HookInputs["PreToolUse"]["KillBash"]
      | HookInputs["PreToolUse"]["ListMcpResources"]
      | HookInputs["PreToolUse"]["LS"]
      | HookInputs["PreToolUse"]["MultiEdit"]
      | HookInputs["PreToolUse"]["MyCustomTool"]
      | HookInputs["PreToolUse"]["MySecondCustomTool"]
      | HookInputs["PreToolUse"]["NotebookEdit"]
      | HookInputs["PreToolUse"]["Read"]
      | HookInputs["PreToolUse"]["ReadMcpResource"]
      | HookInputs["PreToolUse"]["Task"]
      | HookInputs["PreToolUse"]["TodoWrite"]
      | HookInputs["PreToolUse"]["WebFetch"]
      | HookInputs["PreToolUse"]["WebSearch"]
      | HookInputs["PreToolUse"]["Write"]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"PostToolUse">>().toEqualTypeOf<
      // fallback type of PostToolUse
      | HookInputs["PostToolUse"]["default"]
      // Tool-specific types of PostToolUse
      | HookInputs["PostToolUse"]["Bash"]
      | HookInputs["PostToolUse"]["BashOutput"]
      | HookInputs["PostToolUse"]["Edit"]
      | HookInputs["PostToolUse"]["ExitPlanMode"]
      | HookInputs["PostToolUse"]["Glob"]
      | HookInputs["PostToolUse"]["Grep"]
      | HookInputs["PostToolUse"]["KillBash"]
      | HookInputs["PostToolUse"]["ListMcpResources"]
      | HookInputs["PostToolUse"]["LS"]
      | HookInputs["PostToolUse"]["MultiEdit"]
      | HookInputs["PostToolUse"]["MyCustomTool"]
      | HookInputs["PostToolUse"]["MySecondCustomTool"]
      | HookInputs["PostToolUse"]["NotebookEdit"]
      | HookInputs["PostToolUse"]["Read"]
      | HookInputs["PostToolUse"]["ReadMcpResource"]
      | HookInputs["PostToolUse"]["Task"]
      | HookInputs["PostToolUse"]["TodoWrite"]
      | HookInputs["PostToolUse"]["WebFetch"]
      | HookInputs["PostToolUse"]["WebSearch"]
      | HookInputs["PostToolUse"]["Write"]
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
