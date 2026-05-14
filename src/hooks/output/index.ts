import type { SupportedHookEvent } from "../event.ts";
import type { PermissionUpdate } from "../permission.ts";

/**
 * @package
 */
export type HookOutput = {
  PreToolUse: PreToolUseHookOutput;

  PostToolUse: PostToolUseHookOutput;

  PostToolUseFailure: PostToolUseFailureHookOutput;

  PostToolBatch: PostToolBatchHookOutput;

  UserPromptExpansion: UserPromptExpansionHookOutput;
  UserPromptSubmit: UserPromptSubmitHookOutput;

  Stop: StopHookOutput;
  StopFailure: CommonHookOutputs;

  SubagentStart: SubagentStartHookOutput;
  SubagentStop: SubagentStopHookOutput;

  SessionStart: SessionStartHookOutput;

  PermissionDenied: PermissionDeniedHookOutput;
  PermissionRequest: PermissionRequestHookOutput;

  Setup: SetupHookOutput;

  Notification: NotificationHookOutput;

  Elicitation: ElicitationHookOutput;
  ElicitationResult: ElicitationResultHookOutput;

  CwdChanged: CwdChangedHookOutput;
  FileChanged: FileChangedHookOutput;

  ConfigChange: CommonHookOutputs;
  InstructionsLoaded: CommonHookOutputs;
  PostCompact: CommonHookOutputs;
  PreCompact: CommonHookOutputs;
  SessionEnd: CommonHookOutputs;
  TaskCompleted: CommonHookOutputs;
  TaskCreated: CommonHookOutputs;
  TeammateIdle: CommonHookOutputs;
  WorktreeCreate: WorktreeCreateHookOutput;
  WorktreeRemove: CommonHookOutputs;
};

/**
 * @package
 */
export type ExtractSyncHookOutput<TEvent extends SupportedHookEvent> =
  HookOutput extends Record<SupportedHookEvent, unknown> ? HookOutput[TEvent] : never;

/**
 * @package
 */
export type ExtractAsyncHookOutput<TEvent extends SupportedHookEvent> =
  _InternalExtractAsyncHookOutput<ExtractSyncHookOutput<TEvent>>;

/**
 * Compute ExtractSyncHookOutput<TEvent> only once for better performance.
 *
 * Only `systemMessage` and `hookSpecificOutput.additionalContext` are read by Claude Code if we are using async hook.
 * (This feature is not documented)
 *
 * @internal
 */
type _InternalExtractAsyncHookOutput<Output extends CommonHookOutputs> = Output extends {
  hookSpecificOutput?: {
    additionalContext?: infer TAdditionalContext;
  };
}
  ? Pick<Output, "systemMessage"> & {
      hookSpecificOutput?: {
        additionalContext?: TAdditionalContext;
      };
    }
  : Pick<Output, "systemMessage">;

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
   * A terminal escape sequence (e.g. OSC 9 / OSC 777 desktop-notification) for Claude Code to emit on your behalf.
   * Only notification/title OSCs (0, 1, 2, 9, 99, 777) and BEL are permitted; anything else is dropped.
   */
  terminalSequence?: string;

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
     * - `defer` exits gracefully so the tool can be resumed later.
     */
    permissionDecision?: "allow" | "ask" | "deny" | "defer";

    permissionDecisionReason?: string;

    updatedInput?: Record<string, unknown>;

    additionalContext?: string;
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

    /**
     * Replaces the tool output before it is sent to the model.
     */
    updatedToolOutput?: unknown;

    /**
     * Replaces the output for MCP tools only. Prefer `updatedToolOutput`, which works for all tools.
     */
    updatedMCPToolOutput?: unknown;
  };

  reason?: string;
}

interface PostToolUseFailureHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "PostToolUseFailure";

    /**
     * Adds context for Claude to consider.
     */
    additionalContext?: string;
  };
}

interface PostToolBatchHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "PostToolBatch";

    /**
     * Adds context for Claude to consider.
     */
    additionalContext?: string;
  };
}

/**
 * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks#userpromptsubmit-decision-control}
 */
interface UserPromptExpansionHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "UserPromptExpansion";

    /**
     * Adds the string to the context.
     */
    additionalContext?: string;
  };
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

    sessionTitle?: string;

    /**
     * When decision is "block", omit the original prompt from the block message.
     */
    suppressOriginalPrompt?: boolean;
  };

  reason?: string;
}

interface NotificationHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "Notification";

    /**
     * Adds the string to the context.
     */
    additionalContext?: string;
  };
}

interface WorktreeCreateHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "WorktreeCreate";
    worktreePath: string;
  };
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

interface SubagentStartHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "SubagentStart";

    /**
     * Adds the string to the context.
     */
    additionalContext?: string;
  };
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

    initialUserMessage?: string;

    watchPaths?: string[];
  };
}

interface SetupHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "Setup";

    /**
     * Adds context for Claude to consider.
     */
    additionalContext?: string;
  };
}

/**
 * @see {@link https://code.claude.com/docs/en/hooks#permissionrequest-decision-control}
 */
interface PermissionRequestHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "PermissionRequest";

    /**
     * For `behavior: "allow"` you can also optionally pass in an `updatedInput` that modifies the tool’s input parameters before the tool executes.
     *
     * For `behavior: "deny"` you can also optionally pass in a `message` string that tells the model why the permission was denied, and a boolean `interrupt` which will stop Claude.
     */
    decision:
      | {
          behavior: "allow";
          updatedInput?: Record<string, unknown>;
          updatedPermissions?: PermissionUpdate[];
        }
      | {
          behavior: "deny";
          interrupt?: boolean;
          message?: string;
        };
  };
}

interface PermissionDeniedHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "PermissionDenied";
    retry?: boolean;
  };
}

interface ElicitationHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    action?: "accept" | "decline" | "cancel";
    content?: Record<string, unknown>;
    hookEventName: "Elicitation";
  };
}

interface ElicitationResultHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    action?: "accept" | "decline" | "cancel";
    content?: Record<string, unknown>;
    hookEventName: "ElicitationResult";
  };
}

interface CwdChangedHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "CwdChanged";
    watchPaths?: string[];
  };
}

interface FileChangedHookOutput extends CommonHookOutputs {
  hookSpecificOutput?: {
    hookEventName: "FileChanged";
    watchPaths?: string[];
  };
}
