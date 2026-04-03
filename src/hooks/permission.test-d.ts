import type { PermissionUpdate } from "@anthropic-ai/claude-agent-sdk";

import { describe, expectTypeOf, it } from "vitest";

import type { PermissionUpdate as OurPermissionUpdate } from "./permission.ts";

describe("PermissionUpdate", () => {
  it("matches upstream type", () => {
    expectTypeOf<OurPermissionUpdate>().toEqualTypeOf<PermissionUpdate>();
  });

  it("supports the auto mode for setMode updates", () => {
    expectTypeOf<Extract<OurPermissionUpdate, { type: "setMode" }>>().toEqualTypeOf<{
      destination: "userSettings" | "projectSettings" | "localSettings" | "session" | "cliArg";
      mode: "acceptEdits" | "bypassPermissions" | "default" | "dontAsk" | "plan" | "auto";
      type: "setMode";
    }>();
  });
});
