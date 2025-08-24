import * as v from "valibot";

import type { AutoComplete } from "../utils/types";
import type { ValibotSchemaLike } from "../utils/valibot";

import { SUPPORTED_HOOK_EVENTS, type SupportedHookEvent } from "../event";

const baseHookInputSchema = v.object({
  cwd: v.string(),
  hook_event_name: v.union(SUPPORTED_HOOK_EVENTS.map((e) => v.literal(e))),
  session_id: v.string(),
  transcript_path: v.string(),
});

/**
 * @package
 */
export type HookInputLike = v.InferOutput<typeof baseHookInputSchema>;

function buildHookInputSchema<
  TName extends string,
  TEntries extends v.ObjectEntries,
>(hook_event_name: TName, entries: TEntries) {
  return v.object({
    ...baseHookInputSchema.entries,
    hook_event_name: v.literal(hook_event_name),
    ...entries,
  });
}

/**
 * @package
 */
export const HookInputSchemas = {
  PreToolUse: buildHookInputSchema("PreToolUse", {
    tool_name: v.pipe(
      // inputType should be v.string(), otherwise validation will fail
      // instead, transform it to AutoComplete<T> after parsing to enable auto completion with outputType
      v.string(),
      v.transform((s) => s as AutoComplete<typeof s>),
    ),

    tool_input: v.unknown(),
  }),

  PostToolUse: buildHookInputSchema("PostToolUse", {
    tool_name: v.pipe(
      // inputType should be v.string(), otherwise validation will fail
      // instead, transform it to AutoComplete<T> after parsing to enable auto completion with outputType
      v.string(),
      v.transform((s) => s as AutoComplete<typeof s>),
    ),

    tool_input: v.unknown(),
    tool_response: v.unknown(),
  }),

  Notification: buildHookInputSchema("Notification", {
    message: v.optional(v.string()),
  }),

  UserPromptSubmit: buildHookInputSchema("UserPromptSubmit", {
    prompt: v.string(),
  }),

  Stop: buildHookInputSchema("Stop", {
    stop_hook_active: v.optional(v.boolean()),
  }),

  SubagentStop: buildHookInputSchema("SubagentStop", {
    stop_hook_active: v.optional(v.boolean()),
  }),

  PreCompact: buildHookInputSchema("PreCompact", {
    custom_instructions: v.string(),
    trigger: v.union([v.literal("manual"), v.literal("auto")]),
  }),

  SessionStart: buildHookInputSchema("SessionStart", {
    source: v.string(),
  }),

  SessionEnd: buildHookInputSchema("SessionEnd", {
    reason: v.string(),
  }),
} as const satisfies Record<SupportedHookEvent, ValibotSchemaLike>;
