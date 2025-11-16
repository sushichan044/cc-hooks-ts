import type { ExtractHookOutput, SupportedHookEvent } from "./hooks";
import type { ExtractTriggeredHookInput, HookTrigger } from "./types";

export interface HookContext<THookTrigger extends HookTrigger> {
  /**
   * Cause a blocking error.
   *
   * @param error `error` is fed back to Claude to process automatically
   */
  blockingError: (error: string) => HookResponseBlockingError;

  input: ExtractTriggeredHookInput<THookTrigger>;

  /**
   * Direct access to advanced JSON output.
   *
   * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks#advanced%3A-json-output}
   */
  json: (
    payload: HookResultJSON<THookTrigger>,
  ) => HookResponseJSON<THookTrigger>;

  /**
   * Cause a non-blocking error.
   *
   * @param message `message` is shown to the user and execution continues.
   */
  nonBlockingError: (message?: string) => HookResponseNonBlockingError;

  /**
   * Indicate successful handling of the hook.
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
  | HookResponseJSON<THookTrigger>
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

type HookResponseJSON<TTrigger extends HookTrigger> = {
  kind: "json";
  payload: HookResultJSON<TTrigger>;
};

type HookResultJSON<TTrigger extends HookTrigger> = {
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
          output: ExtractHookOutput<EventKey>;
        }
      : never
    : never;
}[keyof TTrigger];
