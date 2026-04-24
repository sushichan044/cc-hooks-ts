import * as v from "valibot";

import type { AutoComplete } from "../../utils/types.ts";
import type { ValibotSchemaLike } from "../../utils/valibot.ts";
import type { SupportedHookEvent } from "../event.ts";

import { permissionUpdateSchema } from "../permission.ts";

const baseHookInputSchema = v.object({
  agent_id: v.exactOptional(v.string()),
  agent_type: v.exactOptional(v.string()),
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

function buildSubagentInputSchema<TName extends string, TEntries extends v.ObjectEntries>(
  hook_event_name: TName,
  entries: TEntries,
) {
  const base = buildHookInputSchema(hook_event_name, entries);

  return v.object({
    ...v.omit(base, ["agent_id", "agent_type"]).entries,
    // agent_id and agent_type are required for subagent hooks
    agent_id: v.string(),
    agent_type: v.string(),
  });
}

/**
 * @package
 */
export const HookInputSchemas = {
  PreToolUse: buildHookInputSchema("PreToolUse", {
    tool_name: v.pipe(
      // parse as string, then type as AutoComplete<string>
      v.string(),
      v.guard((s): s is AutoComplete<string> => true),
    ),

    tool_input: v.unknown(),
    tool_use_id: v.string(),
  }),

  PostToolUse: buildHookInputSchema("PostToolUse", {
    tool_name: v.pipe(
      // parse as string, then type as AutoComplete<string>
      v.string(),
      v.guard((s): s is AutoComplete<string> => true),
    ),

    duration_ms: v.exactOptional(v.number()),
    tool_input: v.unknown(),
    tool_response: v.unknown(),
    tool_use_id: v.string(),
  }),

  PostToolUseFailure: buildHookInputSchema("PostToolUseFailure", {
    tool_name: v.pipe(
      // parse as string, then type as AutoComplete<string>
      v.string(),
      v.guard((s): s is AutoComplete<string> => true),
    ),

    duration_ms: v.exactOptional(v.number()),
    error: v.string(),
    is_interrupt: v.exactOptional(v.boolean()),
    tool_input: v.unknown(),
    tool_use_id: v.string(),
  }),

  PostToolBatch: buildHookInputSchema("PostToolBatch", {
    tool_calls: v.array(
      v.object({
        tool_input: v.unknown(),
        tool_name: v.string(),
        tool_response: v.exactOptional(v.unknown()),
        tool_use_id: v.string(),
      }),
    ),
  }),

  Notification: buildHookInputSchema("Notification", {
    message: v.string(),
    notification_type: v.string(),
    title: v.exactOptional(v.string()),
  }),

  UserPromptSubmit: buildHookInputSchema("UserPromptSubmit", {
    prompt: v.string(),
    session_title: v.exactOptional(v.string()),
  }),

  UserPromptExpansion: buildHookInputSchema("UserPromptExpansion", {
    command_args: v.string(),
    command_name: v.string(),
    command_source: v.exactOptional(v.string()),
    expansion_type: v.picklist(["slash_command", "mcp_prompt"]),
    prompt: v.string(),
  }),

  Stop: buildHookInputSchema("Stop", {
    last_assistant_message: v.exactOptional(v.string()),
    stop_hook_active: v.boolean(),
  }),

  StopFailure: buildHookInputSchema("StopFailure", {
    error: v.picklist([
      "authentication_failed",
      "billing_error",
      "rate_limit",
      "invalid_request",
      "server_error",
      "unknown",
      "max_output_tokens",
    ]),
    error_details: v.exactOptional(v.string()),
    last_assistant_message: v.exactOptional(v.string()),
  }),

  SubagentStart: buildSubagentInputSchema("SubagentStart", {}),

  SubagentStop: buildSubagentInputSchema("SubagentStop", {
    agent_transcript_path: v.string(),
    last_assistant_message: v.exactOptional(v.string()),
    stop_hook_active: v.boolean(),
  }),

  PreCompact: buildHookInputSchema("PreCompact", {
    custom_instructions: v.nullable(v.string()),
    trigger: v.picklist(["manual", "auto"]),
  }),

  PostCompact: buildHookInputSchema("PostCompact", {
    compact_summary: v.string(),
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
      "resume",
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

  PermissionDenied: buildHookInputSchema("PermissionDenied", {
    reason: v.string(),
    tool_input: v.unknown(),
    tool_name: v.string(),
    tool_use_id: v.string(),
  }),

  Setup: buildHookInputSchema("Setup", {
    trigger: v.picklist(["init", "maintenance"]),
  }),

  TeammateIdle: buildHookInputSchema("TeammateIdle", {
    team_name: v.string(),
    teammate_name: v.string(),
  }),

  TaskCreated: buildHookInputSchema("TaskCreated", {
    task_description: v.exactOptional(v.string()),
    task_id: v.string(),
    task_subject: v.string(),
    team_name: v.exactOptional(v.string()),
    teammate_name: v.exactOptional(v.string()),
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

  WorktreeCreate: buildHookInputSchema("WorktreeCreate", {
    name: v.string(),
  }),

  WorktreeRemove: buildHookInputSchema("WorktreeRemove", {
    worktree_path: v.string(),
  }),

  Elicitation: buildHookInputSchema("Elicitation", {
    elicitation_id: v.exactOptional(v.string()),
    mcp_server_name: v.string(),
    message: v.string(),
    mode: v.exactOptional(v.picklist(["form", "url"])),
    requested_schema: v.exactOptional(v.record(v.string(), v.unknown())),
    url: v.exactOptional(v.string()),
  }),

  ElicitationResult: buildHookInputSchema("ElicitationResult", {
    action: v.picklist(["accept", "decline", "cancel"]),
    content: v.exactOptional(v.record(v.string(), v.unknown())),
    elicitation_id: v.exactOptional(v.string()),
    mcp_server_name: v.string(),
    mode: v.exactOptional(v.picklist(["form", "url"])),
  }),

  InstructionsLoaded: buildHookInputSchema("InstructionsLoaded", {
    file_path: v.string(),
    globs: v.exactOptional(v.array(v.string())),
    load_reason: v.picklist([
      "session_start",
      "nested_traversal",
      "path_glob_match",
      "include",
      "compact",
    ]),
    memory_type: v.picklist(["User", "Project", "Local", "Managed"]),
    parent_file_path: v.exactOptional(v.string()),
    trigger_file_path: v.exactOptional(v.string()),
  }),

  CwdChanged: buildHookInputSchema("CwdChanged", {
    new_cwd: v.string(),
    old_cwd: v.string(),
  }),

  FileChanged: buildHookInputSchema("FileChanged", {
    event: v.picklist(["change", "add", "unlink"]),
    file_path: v.string(),
  }),
} as const satisfies Record<SupportedHookEvent, ValibotSchemaLike>;
