import * as v from "valibot";

import type { SupportedHookEvent } from "../event";
import type { AutoComplete } from "../utils/types";
import type { ValibotSchemaLike } from "../utils/valibot";

const baseHookInputSchema = v.object({
  cwd: v.string(),
  permission_mode: v.exactOptional(v.string()),
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
    message: v.string(),
    title: v.exactOptional(v.string()),
  }),

  UserPromptSubmit: buildHookInputSchema("UserPromptSubmit", {
    prompt: v.string(),
  }),

  Stop: buildHookInputSchema("Stop", {
    stop_hook_active: v.boolean(),
  }),

  SubagentStop: buildHookInputSchema("SubagentStop", {
    stop_hook_active: v.boolean(),
  }),

  PreCompact: buildHookInputSchema("PreCompact", {
    custom_instructions: v.nullable(v.string()),
    trigger: v.union([v.literal("manual"), v.literal("auto")]),
  }),

  SessionStart: buildHookInputSchema("SessionStart", {
    source: v.union([
      v.literal("startup"),
      v.literal("resume"),
      v.literal("clear"),
      v.literal("compact"),
    ]),
  }),

  SessionEnd: buildHookInputSchema("SessionEnd", {
    reason: v.string(),
  }),
} as const satisfies Record<SupportedHookEvent, ValibotSchemaLike>;
