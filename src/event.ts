export const SUPPORTED_HOOK_EVENTS = [
  "PreToolUse",
  "PostToolUse",
  "Notification",
  "UserPromptSubmit",
  "Stop",
  "SubagentStop",
  "PreCompact",
  "SessionStart",
  "SessionEnd",
] as const;

/**
 * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks#hook-events}
 */
export type SupportedHookEvent = (typeof SUPPORTED_HOOK_EVENTS)[number];
