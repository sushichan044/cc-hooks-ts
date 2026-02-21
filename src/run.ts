import type { AsyncHookJSONOutput } from "@anthropic-ai/claude-agent-sdk";

import getStdin from "get-stdin";
import process from "node:process";
import * as v from "valibot";

import type { HookResponse } from "./context";
import type { HookDefinition } from "./define";
import type { SupportedHookEvent } from "./hooks";
import type { ExtractTriggeredHookInput, HookTrigger } from "./types";

import { createContext } from "./context";
import { HookInputSchemas } from "./hooks";
import { isNonEmptyString } from "./utils/string";

/**
 * Executes a Claude Code hook with runtime input validation and error handling.
 *
 * This function handles the complete lifecycle of hook execution including:
 * - Reading input from stdin
 * - Validating input against Valibot schemas
 * - Creating typed context
 * - Executing the hook handler
 * - Formatting and outputting results
 *
 * @param definition - The hook definition to execute
 *
 * @example
 * ```ts
 * // CLI usage: echo '{"hook_event_name":"SessionStart",...}' | node hook.js
 * const hook = defineHook({
 *   trigger: { SessionStart: true },
 *   run: (context) => context.success()
 * });
 *
 * // Execute the hook (typically called from CLI)
 * await runHook(hook);
 *
 * // Hook with error handling
 * const validationHook = defineHook({
 *   trigger: { PreToolUse: { Read: true } },
 *   run: (context) => {
 *     try {
 *       const { file_path } = context.input.tool_input;
 *
 *       if (!file_path.endsWith('.ts')) {
 *         return context.nonBlockingError('Warning: Non-TypeScript file detected');
 *       }
 *
 *       return context.success();
 *     } catch (error) {
 *       return context.blockingError(`Validation failed: ${error.message}`);
 *     }
 *   }
 * });
 *
 * await runHook(validationHook);
 * ```
 */
export async function runHook<THookTrigger extends HookTrigger = HookTrigger>(
  def: HookDefinition<THookTrigger>,
) {
  const { run, shouldRun = true, trigger } = def;

  // null means unknown event
  let eventName: SupportedHookEvent | null = null;

  try {
    const proceed = typeof shouldRun === "function" ? await shouldRun() : shouldRun;

    if (!proceed) {
      // do nothing
      return handleHookResult(eventName, {
        kind: "success",
        payload: {},
      });
    }

    const stdin = await getStdin();

    const inputSchema = extractInputSchemaFromTrigger(trigger);
    const parsed = v.parse(inputSchema, JSON.parse(stdin));
    eventName = parsed.hook_event_name;

    const context = createContext(parsed as ExtractTriggeredHookInput<THookTrigger>);

    const result = await run(context);

    await handleHookResult(eventName, result);
  } catch (error) {
    await handleHookResult(eventName, {
      kind: "non-blocking-error",
      payload: `Error in hook: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

async function handleHookResult<THookTrigger extends HookTrigger>(
  eventName: SupportedHookEvent | null,
  hookResult: HookResponse<THookTrigger>,
): Promise<void> {
  switch (hookResult.kind) {
    case "blocking-error": {
      if (hookResult.payload) {
        console.error(hookResult.payload);
      }
      return process.exit(2);
    }

    case "json-async": {
      const userTimeout = hookResult.timeoutMs;
      // This JSON tells Claude Code that the hook is running asynchronously.
      // Claude Code proceeds to the next step without waiting for this hook to finish,
      // while the hook continues running in the background.
      console.log(
        JSON.stringify({
          async: true,
          asyncTimeout: userTimeout ?? undefined,
        } satisfies AsyncHookJSONOutput),
      );

      const safeInvokeDeferredHook = async () => {
        try {
          const res = await hookResult.run();
          return { isError: false, payload: res } as const;
        } catch (error) {
          return {
            isError: true,
            reason: error instanceof Error ? error.message : String(error),
          } as const;
        }
      };

      let deferredResult: Awaited<ReturnType<typeof safeInvokeDeferredHook>>;
      if (userTimeout == null) {
        deferredResult = await safeInvokeDeferredHook();
      } else {
        // In case of Claude does not respect timeout and keeps running forever,
        // we add a hard timeout 5s after user timeout to exit the process.
        deferredResult = await Promise.race([
          safeInvokeDeferredHook(),
          new Promise<Extract<typeof deferredResult, { isError: true }>>((resolve) =>
            setTimeout(
              () =>
                resolve({
                  isError: true,
                  reason: `Exceeded user specified timeout: ${userTimeout}ms`,
                }),
              userTimeout + 5000,
            ),
          ),
        ]);
      }

      if (deferredResult.isError) {
        if (isNonEmptyString(deferredResult.reason)) {
          console.error(`Async hook execution failed: ${deferredResult.reason}`);
        }
        return process.exit(1);
      }

      // For debugging:
      // You should enable verbose output in Claude Code by
      // `/config` → Set "verbose" to true
      console.log(JSON.stringify(deferredResult.payload.output));
      return process.exit(0);
    }

    // https://docs.anthropic.com/en/docs/claude-code/hooks#advanced%3A-json-output
    // https://docs.anthropic.com/en/docs/claude-code/hooks#json-output-example%3A-pretooluse-with-approval
    // Advanced output: print JSON and exit with 0
    case "json-sync": {
      console.log(JSON.stringify(hookResult.payload.output));
      return process.exit(0);
    }

    case "non-blocking-error": {
      if (isNonEmptyString(hookResult.payload)) {
        console.error(hookResult.payload);
      }
      return process.exit(1);
    }

    // Simple case with exit code
    // https://docs.anthropic.com/en/docs/claude-code/hooks#simple%3A-exit-code
    case "success": {
      // early return if we use stdout for claude context
      if (eventName === "UserPromptSubmit" || eventName === "SessionStart") {
        if (isNonEmptyString(hookResult.payload.additionalClaudeContext)) {
          console.log(hookResult.payload.additionalClaudeContext);
        }
        return process.exit(0);
      }

      if (isNonEmptyString(hookResult.payload.messageForUser)) {
        console.log(hookResult.payload.messageForUser);
      }
      return process.exit(0);
    }

    default: {
      throw new Error(`Unknown hook result kind: ${JSON.stringify(hookResult satisfies never)}`);
    }
  }
}

function extractInputSchemaFromTrigger(trigger: HookTrigger) {
  const schemas = Object.keys(trigger).map((hookEvent) => {
    return HookInputSchemas[hookEvent as SupportedHookEvent];
  });

  return v.union(schemas);
}
