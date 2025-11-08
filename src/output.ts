import type { SupportedHookEvent } from "./event";
import type { AssertFalse, IsNever } from "./utils/types";

export type HookOutput = {
  PreToolUse: PreToolUseHookOutput;

  PostToolUse: PostToolUseHookOutput;

  UserPromptSubmit: UserPromptSubmitHookOutput;

  Stop: StopHookOutput;

  SubagentStop: SubagentStopHookOutput;

  SessionStart: SessionStartHookOutput;

  Notification: CommonHookOutputs;
  PreCompact: CommonHookOutputs;
  SessionEnd: CommonHookOutputs;
};

// Internal type checker.
// If "Type 'true' does not satisfy the constraint 'false'" is shown,
// it means `HookOutput` is missing required keys for `SupportedHookEvent`.
// We must implement the missing keys.
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type __TypeCheckExtractHookOutput = AssertFalse<
  IsNever<ExtractHookOutput<SupportedHookEvent>>
>;

export type ExtractHookOutput<TEvent extends SupportedHookEvent> =
  HookOutput extends Record<SupportedHookEvent, unknown>
    ? HookOutput[TEvent]
    : never;

/**
 * Common fields of hook outputs
 *
 * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks#common-json-fields}
 */
type CommonHookOutputs = {
  /**
   * Whether Claude should continue after hook execution
   *
   * If `continue` is false, Claude stops processing after the hooks run.
   * @default true
   */
  continue?: boolean;

  /**
   * Accompanies `continue` with a `reason` shown to the user, not shown to Claude.
   *
   * NOT FOR CLAUDE
   */
  stopReason?: string;

  /**
   * If `true`, user cannot see the stdout of this hook.
   *
   * @default false
   */
  suppressOutput?: boolean;

  /**
   * Optional warning message shown to the user
   */
  systemMessage?: string;

  /**
   * Use `hookSpecificOutput` in appropriate hook events instead.
   *
   * @deprecated
   */
  reason?: string;

  /**
   * Use `hookSpecificOutput` in appropriate hook events instead.
   *
   * @deprecated
   */
  decision?: "approve" | "block";
};

/**
 * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks#pretooluse-decision-control}
 */
interface PreToolUseHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "PreToolUse";

    /**
     * - `allow` bypasses the permission system. `permissionDecisionReason` is shown to the user but not to Claude.
     * - `deny` prevents the tool call from executing. `permissionDecisionReason` is shown to Claude.
     * - `ask` asks the user to confirm the tool call in the UI. `permissionDecisionReason` is shown to the user but not to Claude.
     */
    permissionDecision?: "allow" | "ask" | "deny";

    permissionDecisionReason?: string;
  };
}

/**
 * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks#posttooluse-decision-control}
 */
interface PostToolUseHookOutput extends CommonHookOutputs {
  /**
   * - `approve` has no effect; the tool response is processed normally.
   * - `block` automatically prompts Claude with `reason`.
   */
  decision?: "approve" | "block";

  hookSpecificOutput?: {
    hookEventName: "PostToolUse";

    /**
     * Adds context for Claude to consider.
     */
    additionalContext?: string;
  };

  reason?: string;
}

/**
 * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks#userpromptsubmit-decision-control}
 */
interface UserPromptSubmitHookOutput extends CommonHookOutputs {
  /**
   * - `approve` has no effect; the tool response is processed normally.
   * - `block` prevents the prompt from being processed.
   *   The submitted prompt is erased from context. `reason` is shown to the user but not added to context.
   */
  decision?: "approve" | "block";

  hookSpecificOutput?: {
    hookEventName: "UserPromptSubmit";

    /**
     * Adds the string to the context if not blocked.
     */
    additionalContext?: string;
  };

  reason?: string;
}

/**
 * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks#stop%2Fsubagentstop-decision-control}
 */
interface StopHookOutput extends CommonHookOutputs {
  /**
   * - `approve` has no effect; the tool response is processed normally.
   * - `block` prevents Claude from stopping. You must populate `reason` for Claude to know how to proceed.
   */
  decision?: "approve" | "block";

  /**
   * Reason for the decision.
   */
  reason?: string;
}

/**
 * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks#stop%2Fsubagentstop-decision-control}
 */
interface SubagentStopHookOutput extends CommonHookOutputs {
  /**
   * - `approve` has no effect; the tool response is processed normally.
   * - `block` prevents Claude from stopping. You must populate `reason` for Claude to know how to proceed.
   */

  /**
   * Reason for the decision.
   */
  reason?: string;
}

interface SessionStartHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "SessionStart";

    /**
     * Adds the string to the context.
     */
    additionalContext?: string;
  };
}
