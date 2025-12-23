import type { SimplifyDeep } from "type-fest";

import { describe, expectTypeOf, it } from "vitest";

import { createContext } from "./context";

describe("HookContext", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ctx = createContext<{ PostToolUse: { Read: true } }>(
    // @ts-expect-error testing only types.
    {},
  );

  describe("#jsonAsync", () => {
    it("correctly infers the return type of run function", () => {
      type AsyncHookRunFn = ReturnType<typeof ctx.defer>["run"];
      type AsyncHookReturn = SimplifyDeep<Awaited<ReturnType<AsyncHookRunFn>>>;

      expectTypeOf<AsyncHookReturn>().toEqualTypeOf<{
        event: "PostToolUse";
        output: {
          hookSpecificOutput?: {
            additionalContext?: string | undefined;
          };
          systemMessage?: string | undefined;
        };
      }>();
    });
  });
});
