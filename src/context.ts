import type { ExtractSyncHookOutput, SupportedHookEvent } from "./hooks";
import type { ExtractTriggeredHookInput, HookTrigger } from "./types";

export interface HookContext<THookTrigger extends HookTrigger> {
  /**
   * Cause a blocking error.
   *
   * When called, Claude Code stops processing and reports the error to Claude.
   * The hook exits with code 2, and the error message is fed back to Claude for automatic processing.
   *
   * @example
   * // Block access to sensitive files
   * const hook = defineHook({
   *   trigger: { PreToolUse: { Read: true } },
   *   run: (context) => {
   *     const { file_path } = context.input.tool_input;
   *
   *     if (file_path.includes('.env') || file_path.includes('secrets')) {
   *       return context.blockingError('Access to sensitive files is not allowed');
   *     }
   *
   *     return context.success();
   *   }
   * });
   */
  blockingError: (error: string) => HookResponseBlockingError;

  input: ExtractTriggeredHookInput<THookTrigger>;

  /**
   * Direct access to advanced JSON output.
   *
   * Provides fine-grained control over hook behavior through structured JSON output.
   * This is the most powerful way to control Claude Code's behavior, including
   * permission decisions, input modifications, and additional context.
   *
   * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks#advanced%3A-json-output}
   *
   * @example
   * // PreToolUse: Deny access with reason
   * const hook = defineHook({
   *   trigger: { PreToolUse: { Read: true } },
   *   run: (context) => {
   *     const { file_path } = context.input.tool_input;
   *
   *     if (file_path.includes('.env')) {
   *       return context.json({
   *         event: "PreToolUse",
   *         output: {
   *           hookSpecificOutput: {
   *             permissionDecision: "deny",
   *             permissionDecisionReason: "Access to .env files is restricted for security."
   *           }
   *         }
   *       });
   *     }
   *
   *     return context.success();
   *   }
   * });
   */
  json: (payload: SyncHookResultJSON<THookTrigger>) => HookResponseSyncJSON<THookTrigger>;

  /**
   * Cause a non-blocking error.
   *
   * The message is shown to the user and execution continues.
   *
   * The hook exits with code 1, but Claude Code proceeds with normal operation.
   *
   * @example
   * // Optional notification without message
   * const hook = defineHook({
   *   trigger: { Notification: true },
   *   run: (context) => {
   *     try {
   *       // Attempt to send notification
   *       sendNotification(context.input.message);
   *       return context.success();
   *     } catch (error) {
   *       // Fail silently - notification is optional
   *       return context.nonBlockingError();
   *     }
   *   }
   * });
   */
  nonBlockingError: (message?: string) => HookResponseNonBlockingError;

  /**
   * Indicate successful handling of the hook.
   *
   * The hook exits with code 0. Optionally provides a message for the user or additional context for Claude.
   *
   * @example
   * // Basic success without payload
   * const hook = defineHook({
   *   trigger: { PreToolUse: { Read: true } },
   *   run: (context) => {
   *     // Validation passed
   *     return context.success();
   *   }
   * });
   */
  success: (payload?: HookSuccessPayload) => HookResponseSuccess;
}

export function createContext<THookTrigger extends HookTrigger>(
  input: ExtractTriggeredHookInput<THookTrigger>,
): HookContext<THookTrigger> {
  return {
    blockingError: (error) => ({
      kind: "blocking-error",
      payload: error,
    }),

    input,

    nonBlockingError: (message) => ({
      kind: "non-blocking-error",
      payload: message,
    }),

    success: (result) => ({
      kind: "success",
      payload: {
        additionalClaudeContext: result?.additionalClaudeContext,
        messageForUser: result?.messageForUser,
      },
    }),

    json: (payload) => ({
      kind: "json",
      payload,
    }),
  };
}

export type HookResponse<THookTrigger extends HookTrigger> =
  | HookResponseBlockingError
  | HookResponseSyncJSON<THookTrigger>
  | HookResponseNonBlockingError
  | HookResponseSuccess;

type HookResponseNonBlockingError = {
  kind: "non-blocking-error";
  payload?: string;
};

type HookResponseBlockingError = {
  kind: "blocking-error";
  payload: string;
};

type HookResponseSuccess = {
  kind: "success";

  payload: HookSuccessPayload;
};

type HookSuccessPayload = {
  /**
   * Message shown to the user in transcript mode.
   */
  messageForUser?: string | undefined;

  /**
   * Additional context for Claude.
   *
   * Only works for `UserPromptSubmit` and `SessionStart` hooks.
   */
  additionalClaudeContext?: string | undefined;
};

type HookResponseSyncJSON<TTrigger extends HookTrigger> = {
  kind: "json";
  payload: SyncHookResultJSON<TTrigger>;
};

type SyncHookResultJSON<TTrigger extends HookTrigger> = {
  [EventKey in keyof TTrigger]: EventKey extends SupportedHookEvent
    ? TTrigger[EventKey] extends true | Record<PropertyKey, true>
      ? {
          /**
           * The name of the event being triggered.
           *
           * Required for proper TypeScript inference.
           */
          event: EventKey;

          /**
           * The output data for the event.
           */
          output: ExtractSyncHookOutput<EventKey>;
        }
      : never
    : never;
}[keyof TTrigger];
