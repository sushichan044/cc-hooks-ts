import type * as v from "valibot";

import { describe, expectTypeOf, it } from "vitest";

import type { ExtendedTools } from "../../types";
import type { AutoComplete } from "../../utils/types";
import type { HookInputSchemas } from "./schemas";
import type {
  ExtractAllHookInputsForEvent,
  ExtractExtendedSpecificKeys,
  ExtractSpecificHookInputForEvent,
  HookInput,
} from "./types";

// Declaration merge with ToolSchema in src/index.ts
declare module "../../index" {
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
      expectTypeOf<HookInput["PreToolUse"]["default"]>().toEqualTypeOf<{
        cwd: string;
        hook_event_name: "PreToolUse";
        permission_mode?: string;
        session_id: string;
        tool_input: unknown;
        tool_name: AutoComplete<string>;
        tool_use_id: string;
        transcript_path: string;
      }>();
    });

    it("should infer tool-specific case from ToolSchema", () => {
      expectTypeOf<HookInput["PreToolUse"]["MyCustomTool"]>().toMatchObjectType<{
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
      expectTypeOf<HookInput["PostToolUse"]["default"]>().toEqualTypeOf<{
        cwd: string;
        hook_event_name: "PostToolUse";
        permission_mode?: string;
        session_id: string;
        tool_input: unknown;
        tool_name: AutoComplete<string>;
        tool_response: unknown;
        tool_use_id: string;
        transcript_path: string;
      }>();
    });

    it("should infer tool-specific case from ToolSchema", () => {
      expectTypeOf<HookInput["PostToolUse"]["MyCustomTool"]>().toMatchObjectType<{
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

  describe("PostToolUseFailure", () => {
    it("should handle normal case", () => {
      expectTypeOf<HookInput["PostToolUseFailure"]["default"]>().toEqualTypeOf<{
        cwd: string;
        error: string;
        hook_event_name: "PostToolUseFailure";
        is_interrupt?: boolean;
        permission_mode?: string;
        session_id: string;
        tool_input: unknown;
        tool_name: AutoComplete<string>;
        tool_use_id: string;
        transcript_path: string;
      }>();
    });

    it("should infer tool-specific case from ToolSchema", () => {
      expectTypeOf<HookInput["PostToolUseFailure"]["MyCustomTool"]>().toMatchObjectType<{
        tool_input: {
          customParam: string;
          optionalParam?: number;
        };
        tool_name: "MyCustomTool";
      }>();
    });
  });
});

describe("Auto Completion Ability", () => {
  describe("PreToolUse", () => {
    type PreToolUseSchema = typeof HookInputSchemas.PreToolUse;

    it("should accept string as input of tool_name", () => {
      expectTypeOf<v.InferInput<PreToolUseSchema>["tool_name"]>().toEqualTypeOf<string>();
    });

    it("should output tool_name as AutoComplete<T>", () => {
      expectTypeOf<v.InferOutput<PreToolUseSchema>["tool_name"]>().toEqualTypeOf<
        AutoComplete<string>
      >();
    });
  });

  describe("PostToolUse", () => {
    type PostToolUseSchema = typeof HookInputSchemas.PostToolUse;

    it("should accept string as input of tool_name", () => {
      expectTypeOf<v.InferInput<PostToolUseSchema>["tool_name"]>().toEqualTypeOf<string>();
    });

    it("should output tool_name as AutoComplete<T>", () => {
      expectTypeOf<v.InferOutput<PostToolUseSchema>["tool_name"]>().toEqualTypeOf<
        AutoComplete<string>
      >();
    });
  });

  describe("PostToolUseFailure", () => {
    type PostToolUseFailureSchema = typeof HookInputSchemas.PostToolUseFailure;

    it("should accept string as input of tool_name", () => {
      expectTypeOf<v.InferInput<PostToolUseFailureSchema>["tool_name"]>().toEqualTypeOf<string>();
    });

    it("should output tool_name as AutoComplete<T>", () => {
      expectTypeOf<v.InferOutput<PostToolUseFailureSchema>["tool_name"]>().toEqualTypeOf<
        AutoComplete<string>
      >();
    });
  });
});

describe("ExtractExtendedSpecificKeys", () => {
  it("should extract valid specific keys for PreToolUse", () => {
    expectTypeOf<ExtractExtendedSpecificKeys<"PreToolUse">>().toEqualTypeOf<ExtendedTools>();
  });

  it("should extract valid specific keys for PostToolUse", () => {
    expectTypeOf<ExtractExtendedSpecificKeys<"PostToolUse">>().toEqualTypeOf<ExtendedTools>();
  });

  it("should extract valid specific keys for PostToolUseFailure", () => {
    expectTypeOf<
      ExtractExtendedSpecificKeys<"PostToolUseFailure">
    >().toEqualTypeOf<ExtendedTools>();
  });
});

describe("ExtractAllHookInputsForEvent", () => {
  it("should extract all inputs for non-tool-specific events", () => {
    expectTypeOf<ExtractAllHookInputsForEvent<"SessionStart">>().toEqualTypeOf<
      HookInput["SessionStart"]["default"]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"Notification">>().toEqualTypeOf<
      HookInput["Notification"]["default"]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"SessionEnd">>().toEqualTypeOf<
      HookInput["SessionEnd"]["default"]
    >();
  });

  it("should extract all inputs for tool-specific events including default", () => {
    expectTypeOf<ExtractAllHookInputsForEvent<"PreToolUse">>().toEqualTypeOf<
      // fallback type of PreToolUse
      | HookInput["PreToolUse"]["default"]
      // Tool-specific types of PreToolUse
      | HookInput["PreToolUse"]["Bash"]
      | HookInput["PreToolUse"]["BashOutput"]
      | HookInput["PreToolUse"]["Edit"]
      | HookInput["PreToolUse"]["ExitPlanMode"]
      | HookInput["PreToolUse"]["Glob"]
      | HookInput["PreToolUse"]["Grep"]
      | HookInput["PreToolUse"]["TaskStop"]
      | HookInput["PreToolUse"]["ListMcpResources"]
      | HookInput["PreToolUse"]["MyCustomTool"]
      | HookInput["PreToolUse"]["MySecondCustomTool"]
      | HookInput["PreToolUse"]["NotebookEdit"]
      | HookInput["PreToolUse"]["Read"]
      | HookInput["PreToolUse"]["ReadMcpResource"]
      | HookInput["PreToolUse"]["Task"]
      | HookInput["PreToolUse"]["TodoWrite"]
      | HookInput["PreToolUse"]["WebFetch"]
      | HookInput["PreToolUse"]["WebSearch"]
      | HookInput["PreToolUse"]["Write"]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"PostToolUse">>().toEqualTypeOf<
      // fallback type of PostToolUse
      | HookInput["PostToolUse"]["default"]
      // Tool-specific types of PostToolUse
      | HookInput["PostToolUse"]["Bash"]
      | HookInput["PostToolUse"]["BashOutput"]
      | HookInput["PostToolUse"]["Edit"]
      | HookInput["PostToolUse"]["ExitPlanMode"]
      | HookInput["PostToolUse"]["Glob"]
      | HookInput["PostToolUse"]["Grep"]
      | HookInput["PostToolUse"]["TaskStop"]
      | HookInput["PostToolUse"]["ListMcpResources"]
      | HookInput["PostToolUse"]["MyCustomTool"]
      | HookInput["PostToolUse"]["MySecondCustomTool"]
      | HookInput["PostToolUse"]["NotebookEdit"]
      | HookInput["PostToolUse"]["Read"]
      | HookInput["PostToolUse"]["ReadMcpResource"]
      | HookInput["PostToolUse"]["Task"]
      | HookInput["PostToolUse"]["TodoWrite"]
      | HookInput["PostToolUse"]["WebFetch"]
      | HookInput["PostToolUse"]["WebSearch"]
      | HookInput["PostToolUse"]["Write"]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"PostToolUseFailure">>().toEqualTypeOf<
      // fallback type of PostToolUseFailure
      | HookInput["PostToolUseFailure"]["default"]
      // Tool-specific types of PostToolUseFailure
      | HookInput["PostToolUseFailure"]["Bash"]
      | HookInput["PostToolUseFailure"]["BashOutput"]
      | HookInput["PostToolUseFailure"]["Edit"]
      | HookInput["PostToolUseFailure"]["ExitPlanMode"]
      | HookInput["PostToolUseFailure"]["Glob"]
      | HookInput["PostToolUseFailure"]["Grep"]
      | HookInput["PostToolUseFailure"]["TaskStop"]
      | HookInput["PostToolUseFailure"]["ListMcpResources"]
      | HookInput["PostToolUseFailure"]["MyCustomTool"]
      | HookInput["PostToolUseFailure"]["MySecondCustomTool"]
      | HookInput["PostToolUseFailure"]["NotebookEdit"]
      | HookInput["PostToolUseFailure"]["Read"]
      | HookInput["PostToolUseFailure"]["ReadMcpResource"]
      | HookInput["PostToolUseFailure"]["Task"]
      | HookInput["PostToolUseFailure"]["TodoWrite"]
      | HookInput["PostToolUseFailure"]["WebFetch"]
      | HookInput["PostToolUseFailure"]["WebSearch"]
      | HookInput["PostToolUseFailure"]["Write"]
    >();
  });
});

describe("ExtractSpecificHookInputForEvent", () => {
  it("should extract specific tool input for tool-specific events", () => {
    expectTypeOf<ExtractSpecificHookInputForEvent<"PreToolUse", "MyCustomTool">>().toEqualTypeOf<
      HookInput["PreToolUse"]["MyCustomTool"]
    >();

    expectTypeOf<ExtractSpecificHookInputForEvent<"PreToolUse", "Read">>().toEqualTypeOf<
      HookInput["PreToolUse"]["Read"]
    >();

    expectTypeOf<ExtractSpecificHookInputForEvent<"PostToolUse", "WebFetch">>().toEqualTypeOf<
      HookInput["PostToolUse"]["WebFetch"]
    >();
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
