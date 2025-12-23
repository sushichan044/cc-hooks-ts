import { defineHook } from "cc-hooks-ts";

const hook = defineHook({
  trigger: {
    Stop: true,
  },

  run: (context) =>
    context.jsonAsync({
      run: () => ({
        event: "Stop",
        output: {
          systemMessage: "Stopped successfully!",
        },
      }),
      timeoutMs: 5000,
    }),
});

if (import.meta.main) {
  const { runHook } = await import("cc-hooks-ts");
  await runHook(hook);
}
