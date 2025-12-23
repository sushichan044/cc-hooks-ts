import { defineHook } from "cc-hooks-ts";

const hook = defineHook({
  trigger: {
    Stop: true,
  },

  run: (c) =>
    c.defer(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        event: "Stop",
        output: {
          systemMessage: "Stop hook executed after async processing!",
        },
      };
    }),
});

if (import.meta.main) {
  const { runHook } = await import("cc-hooks-ts");
  await runHook(hook);
}
