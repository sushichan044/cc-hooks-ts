import { describe, expectTypeOf, it } from "vitest";

import { defineHook } from "./define.ts";

describe("defineHook", () => {
  it("should infer tool-specific PreToolUse input from trigger", () => {
    const hook = defineHook({
      run: (context) => context.success(),
      trigger: { PreToolUse: { MyCustomTool: true } },
    });

    expectTypeOf(hook.trigger).toEqualTypeOf<{ PreToolUse: { MyCustomTool: true } }>();
    expectTypeOf<Parameters<typeof hook.run>[0]["input"]>().toMatchObjectType<{
      hook_event_name: "PreToolUse";
      tool_input: {
        customParam: string;
        optionalParam?: number;
      };
      tool_name: "MyCustomTool";
    }>();
  });

  it("should infer tool-specific PostToolUse input from trigger", () => {
    const hook = defineHook({
      run: (context) => context.success(),
      trigger: { PostToolUse: { MyCustomTool: true } },
    });

    expectTypeOf(hook.trigger).toEqualTypeOf<{ PostToolUse: { MyCustomTool: true } }>();
    expectTypeOf<Parameters<typeof hook.run>[0]["input"]>().toMatchObjectType<{
      hook_event_name: "PostToolUse";
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

  it("should infer tool-specific PostToolUseFailure input from trigger", () => {
    const hook = defineHook({
      run: (context) => context.success(),
      trigger: { PostToolUseFailure: { MyCustomTool: true } },
    });

    expectTypeOf(hook.trigger).toEqualTypeOf<{ PostToolUseFailure: { MyCustomTool: true } }>();
    expectTypeOf<Parameters<typeof hook.run>[0]["input"]>().toMatchObjectType<{
      hook_event_name: "PostToolUseFailure";
      tool_input: {
        customParam: string;
        optionalParam?: number;
      };
      tool_name: "MyCustomTool";
    }>();
  });

  it("should infer tool-specific PermissionRequest input from trigger", () => {
    const hook = defineHook({
      run: (context) => context.success(),
      trigger: { PermissionRequest: { MyCustomTool: true } },
    });

    expectTypeOf(hook.trigger).toEqualTypeOf<{ PermissionRequest: { MyCustomTool: true } }>();
    expectTypeOf<Parameters<typeof hook.run>[0]["input"]>().toMatchObjectType<{
      hook_event_name: "PermissionRequest";
      tool_input: {
        customParam: string;
        optionalParam?: number;
      };
      tool_name: "MyCustomTool";
    }>();
  });

  it("should infer tool-specific PermissionDenied input from trigger", () => {
    const hook = defineHook({
      run: (context) => context.success(),
      trigger: { PermissionDenied: { MyCustomTool: true } },
    });

    expectTypeOf(hook.trigger).toEqualTypeOf<{ PermissionDenied: { MyCustomTool: true } }>();
    expectTypeOf<Parameters<typeof hook.run>[0]["input"]>().toMatchObjectType<{
      hook_event_name: "PermissionDenied";
      tool_input: {
        customParam: string;
        optionalParam?: number;
      };
      tool_name: "MyCustomTool";
    }>();
  });
});
