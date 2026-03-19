/**
 * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks#hook-events}
 *
 * @package
 */
export type SupportedHookEvent =
  | "PreToolUse"
  | "PostToolUse"
  | "PostToolUseFailure"
  | "Notification"
  | "UserPromptSubmit"
  | "SessionStart"
  | "SessionEnd"
  | "Stop"
  | "StopFailure"
  | "SubagentStart"
  | "SubagentStop"
  | "PreCompact"
  | "PostCompact"
  | "PermissionRequest"
  | "Setup"
  | "TeammateIdle"
  | "TaskCompleted"
  | "ConfigChange"
  | "WorktreeCreate"
  | "WorktreeRemove"
  | "Elicitation"
  | "ElicitationResult"
  | "InstructionsLoaded";
