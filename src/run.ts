import { readFileSync } from "node:fs";
import process from "node:process";
import * as v from "valibot";

import type { HookResponse } from "./context";
import type { HookDefinition } from "./define";
import type { SupportedHookEvent } from "./event";
import type { ExtractTriggeredHookInput, HookTrigger } from "./types";

import { createContext } from "./context";
import { HookInputSchemas } from "./input";
import { isNonEmptyString } from "./utils/string";

export async function runHook<THookTrigger extends HookTrigger = HookTrigger>(
  def: HookDefinition<THookTrigger>,
) {
  const { run, shouldRun = true, trigger } = def;

  // null means unknown event
  let eventName: SupportedHookEvent | null = null;

  try {
    const proceed =
      typeof shouldRun === "function" ? await shouldRun() : shouldRun;

    if (!proceed) {
      // do nothing
      return handleHookResult(eventName, {
        kind: "success",
        payload: {},
      });
    }

    const inputSchema = extractInputSchemaFromTrigger(trigger);

    const rawInput = readFileSync(process.stdin.fd, "utf-8");
    const parsed = v.parse(inputSchema, JSON.parse(rawInput));
    eventName = parsed.hook_event_name;

    const context = createContext(
      parsed as ExtractTriggeredHookInput<THookTrigger>,
    );

    const result = await run(context);

    handleHookResult(eventName, result);
  } catch (error) {
    handleHookResult(eventName, {
      kind: "non-blocking-error",
      payload: `Error in hook: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
}

function handleHookResult<THookTrigger extends HookTrigger>(
  eventName: SupportedHookEvent | null,
  hookResult: HookResponse<THookTrigger>,
): void {
  switch (hookResult.kind) {
    // Simple case with exit code
    // https://docs.anthropic.com/en/docs/claude-code/hooks#simple%3A-exit-code
    case "success": {
      // early return if we use stdout for claude context
      if (eventName === "UserPromptSubmit" || eventName === "SessionStart") {
        if (isNonEmptyString(hookResult.payload.additionalClaudeContext)) {
          console.log(hookResult.payload.additionalClaudeContext);
          return process.exit(0);
        }
      }

      if (isNonEmptyString(hookResult.payload.messageForUser)) {
        console.log(hookResult.payload.messageForUser);
      }
      return process.exit(0);
    }

    // eslint-disable-next-line perfectionist/sort-switch-case
    case "blocking-error": {
      if (hookResult.payload) {
        console.error(hookResult.payload);
      }
      return process.exit(2);
    }

    case "non-blocking-error": {
      if (isNonEmptyString(hookResult.payload)) {
        console.error(hookResult.payload);
      }
      return process.exit(1);
    }

    // https://docs.anthropic.com/en/docs/claude-code/hooks#advanced%3A-json-output
    // https://docs.anthropic.com/en/docs/claude-code/hooks#json-output-example%3A-pretooluse-with-approval
    // Advanced output: print JSON and exit with 0
    // eslint-disable-next-line perfectionist/sort-switch-case
    case "json": {
      console.log(JSON.stringify(hookResult.payload));
      return process.exit(0);
    }
  }
}

function extractInputSchemaFromTrigger(trigger: HookTrigger) {
  const schemas = Object.keys(trigger).map((hookEvent) => {
    return HookInputSchemas[hookEvent as SupportedHookEvent];
  });

  return v.union(schemas);
}
