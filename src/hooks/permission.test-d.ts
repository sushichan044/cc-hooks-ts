import type { PermissionUpdate } from "@anthropic-ai/claude-agent-sdk";

import { describe, expectTypeOf, it } from "vitest";

import type { PermissionUpdate as OurPermissionUpdate } from "./permission";

describe("PermissionUpdate", () => {
  it("matches upstream type", () => {
    expectTypeOf<OurPermissionUpdate>().toEqualTypeOf<PermissionUpdate>();
  });
});
