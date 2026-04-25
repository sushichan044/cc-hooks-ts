import type * as v from "valibot";

import { describe, expectTypeOf, it } from "vitest";

import type { ToolSchema } from "../../index.ts";
import type { ExtendedTools } from "../../types.ts";
import type { AutoComplete } from "../../utils/types.ts";
import type { PermissionUpdate } from "../permission.ts";
import type { HookInputSchemas } from "./schemas.ts";
import type {
  ExtractAllHookInputsForEvent,
  ExtractExtendedSpecificKeys,
  ExtractSpecificHookInputForEvent,
  HookInput,
} from "./types.ts";

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
        agent_id?: string;
        agent_type?: string;
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
        agent_id?: string;
        agent_type?: string;
        cwd: string;
        duration_ms?: number;
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
        agent_id?: string;
        agent_type?: string;
        cwd: string;
        duration_ms?: number;
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

  describe("PermissionRequest", () => {
    it("should handle normal case", () => {
      expectTypeOf<HookInput["PermissionRequest"]["default"]>().toEqualTypeOf<{
        agent_id?: string;
        agent_type?: string;
        cwd: string;
        hook_event_name: "PermissionRequest";
        permission_mode?: string;
        permission_suggestions?: PermissionUpdate[];
        session_id: string;
        tool_input: unknown;
        tool_name: string;
        transcript_path: string;
      }>();
    });

    it("should infer tool-specific case from ToolSchema", () => {
      expectTypeOf<HookInput["PermissionRequest"]["MyCustomTool"]>().toMatchObjectType<{
        tool_input: {
          customParam: string;
          optionalParam?: number;
        };
        tool_name: "MyCustomTool";
      }>();
    });
  });

  describe("PermissionDenied", () => {
    it("should handle normal case", () => {
      expectTypeOf<HookInput["PermissionDenied"]["default"]>().toEqualTypeOf<{
        agent_id?: string;
        agent_type?: string;
        cwd: string;
        hook_event_name: "PermissionDenied";
        permission_mode?: string;
        reason: string;
        session_id: string;
        tool_input: unknown;
        tool_name: string;
        tool_use_id: string;
        transcript_path: string;
      }>();
    });

    it("should infer tool-specific case from ToolSchema", () => {
      expectTypeOf<HookInput["PermissionDenied"]["MyCustomTool"]>().toMatchObjectType<{
        tool_input: {
          customParam: string;
          optionalParam?: number;
        };
        tool_name: "MyCustomTool";
      }>();
    });
  });

  describe("PostToolBatch", () => {
    type ToolCallItem = HookInput["PostToolBatch"]["default"]["tool_calls"][number];
    type MySecondCustomToolCall = Extract<ToolCallItem, { tool_name: "MySecondCustomTool" }>;

    it("should narrow tool_name and tool_input by tool_name discriminant", () => {
      expectTypeOf<MySecondCustomToolCall>().toMatchObjectType<{
        tool_input: { param: string };
        tool_name: "MySecondCustomTool";
        tool_use_id: string;
      }>();
    });

    it("should infer optional tool_response by tool_name", () => {
      expectTypeOf<MySecondCustomToolCall["tool_response"]>().toEqualTypeOf<
        { success: boolean } | undefined
      >();
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

  it("should extract valid specific keys for PermissionRequest", () => {
    expectTypeOf<ExtractExtendedSpecificKeys<"PermissionRequest">>().toEqualTypeOf<ExtendedTools>();
  });

  it("should extract valid specific keys for PermissionDenied", () => {
    expectTypeOf<ExtractExtendedSpecificKeys<"PermissionDenied">>().toEqualTypeOf<ExtendedTools>();
  });
});

describe("ExtractAllHookInputsForEvent", () => {
  type TypedTools = keyof ToolSchema;

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
      | HookInput["PreToolUse"][TypedTools]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"PostToolUse">>().toEqualTypeOf<
      // fallback type of PostToolUse
      | HookInput["PostToolUse"]["default"]
      // Tool-specific types of PostToolUse
      | HookInput["PostToolUse"][TypedTools]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"PostToolUseFailure">>().toEqualTypeOf<
      // fallback type of PostToolUseFailure
      | HookInput["PostToolUseFailure"]["default"]
      // Tool-specific types of PostToolUseFailure
      | HookInput["PostToolUseFailure"][TypedTools]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"PermissionRequest">>().toEqualTypeOf<
      // fallback type of PermissionRequest
      | HookInput["PermissionRequest"]["default"]
      // Tool-specific types of PermissionRequest
      | HookInput["PermissionRequest"][TypedTools]
    >();

    expectTypeOf<ExtractAllHookInputsForEvent<"PermissionDenied">>().toEqualTypeOf<
      // fallback type of PermissionDenied
      | HookInput["PermissionDenied"]["default"]
      // Tool-specific types of PermissionDenied
      | HookInput["PermissionDenied"][TypedTools]
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

    expectTypeOf<
      ExtractSpecificHookInputForEvent<"PermissionRequest", "MyCustomTool">
    >().toEqualTypeOf<HookInput["PermissionRequest"]["MyCustomTool"]>();

    expectTypeOf<
      ExtractSpecificHookInputForEvent<"PermissionDenied", "MyCustomTool">
    >().toEqualTypeOf<HookInput["PermissionDenied"]["MyCustomTool"]>();
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

    expectTypeOf<
      ExtractSpecificHookInputForEvent<"PermissionRequest", "MyCustomTool">
    >().toMatchObjectType<{
      tool_input: {
        customParam: string;
        optionalParam?: number;
      };
      tool_name: "MyCustomTool";
    }>();

    expectTypeOf<
      ExtractSpecificHookInputForEvent<"PermissionDenied", "MyCustomTool">
    >().toMatchObjectType<{
      tool_input: {
        customParam: string;
        optionalParam?: number;
      };
      tool_name: "MyCustomTool";
    }>();
  });
});
