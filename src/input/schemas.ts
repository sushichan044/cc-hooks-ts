import * as v from "valibot";

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
    tool_input: v.unknown(),
    tool_name: v.intersect([v.string(), v.record(v.string(), v.never())]),
  }),

  PostToolUse: buildHookInputSchema("PostToolUse", {
    tool_input: v.unknown(),
    tool_name: v.string(),
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
