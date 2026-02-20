import * as v from "valibot";

import type { AutoComplete } from "../../utils/types";
import type { ValibotSchemaLike } from "../../utils/valibot";
import type { SupportedHookEvent } from "../event";

import { permissionUpdateSchema } from "../permission";

const baseHookInputSchema = v.object({
  cwd: v.string(),
  permission_mode: v.exactOptional(v.string()),
  session_id: v.string(),
  transcript_path: v.string(),
});

function buildHookInputSchema<TName extends string, TEntries extends v.ObjectEntries>(
  hook_event_name: TName,
  entries: TEntries,
) {
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
    tool_use_id: v.string(),
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
    tool_use_id: v.string(),
  }),

  PostToolUseFailure: buildHookInputSchema("PostToolUseFailure", {
    tool_name: v.pipe(
      // inputType should be v.string(), otherwise validation will fail
      // instead, transform it to AutoComplete<T> after parsing to enable auto completion with outputType
      v.string(),
      v.transform((s) => s as AutoComplete<typeof s>),
    ),

    error: v.string(),
    is_interrupt: v.exactOptional(v.boolean()),
    tool_input: v.unknown(),
    tool_use_id: v.string(),
  }),

  Notification: buildHookInputSchema("Notification", {
    message: v.string(),
    notification_type: v.string(),
    title: v.exactOptional(v.string()),
  }),

  UserPromptSubmit: buildHookInputSchema("UserPromptSubmit", {
    prompt: v.string(),
  }),

  Stop: buildHookInputSchema("Stop", {
    last_assistant_message: v.exactOptional(v.string()),
    stop_hook_active: v.boolean(),
  }),

  SubagentStart: buildHookInputSchema("SubagentStart", {
    agent_id: v.string(),
    agent_type: v.string(),
  }),

  SubagentStop: buildHookInputSchema("SubagentStop", {
    agent_id: v.string(),
    agent_transcript_path: v.string(),
    agent_type: v.string(),
    last_assistant_message: v.exactOptional(v.string()),
    stop_hook_active: v.boolean(),
  }),

  PreCompact: buildHookInputSchema("PreCompact", {
    custom_instructions: v.nullable(v.string()),
    trigger: v.picklist(["manual", "auto"]),
  }),

  SessionStart: buildHookInputSchema("SessionStart", {
    agent_type: v.exactOptional(v.string()),
    model: v.exactOptional(v.string()),
    source: v.picklist(["startup", "resume", "clear", "compact"]),
  }),

  SessionEnd: buildHookInputSchema("SessionEnd", {
    reason: v.picklist([
      "clear",
      "logout",
      "prompt_input_exit",
      "other",
      "bypass_permissions_disabled",
    ]),
  }),

  PermissionRequest: buildHookInputSchema("PermissionRequest", {
    permission_suggestions: v.exactOptional(v.array(permissionUpdateSchema)),
    tool_input: v.unknown(),
    tool_name: v.string(),
  }),

  Setup: buildHookInputSchema("Setup", {
    trigger: v.picklist(["init", "maintenance"]),
  }),

  TeammateIdle: buildHookInputSchema("TeammateIdle", {
    team_name: v.string(),
    teammate_name: v.string(),
  }),

  TaskCompleted: buildHookInputSchema("TaskCompleted", {
    task_description: v.exactOptional(v.string()),
    task_id: v.string(),
    task_subject: v.string(),
    team_name: v.exactOptional(v.string()),
    teammate_name: v.exactOptional(v.string()),
  }),

  ConfigChange: buildHookInputSchema("ConfigChange", {
    file_path: v.exactOptional(v.string()),
    source: v.picklist([
      "local_settings",
      "policy_settings",
      "project_settings",
      "skills",
      "user_settings",
    ]),
  }),
} as const satisfies Record<SupportedHookEvent, ValibotSchemaLike>;
