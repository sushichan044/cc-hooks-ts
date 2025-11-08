import type * as v from "valibot";

import type { SupportedHookEvent } from "../event";
import type { ToolSchema } from "../index";
import type { HookInputSchemas } from "./schemas";

/**
 * Internal type that combines base hook inputs with tool-specific inputs for PreToolUse events.
 * For non-PreToolUse events, this is equivalent to BaseHookInputs.
 *
 * @example
 * ```ts
 * type PreToolUseInputs = HookInputs["PreToolUse"]
 * // Result: Base inputs + { Read: SpecifiedToolUseInput<"Read">, WebFetch: SpecifiedToolUseInput<"WebFetch"> }
 * ```
 * @package
 */
export type HookInputs = {
  [EventKey in SupportedHookEvent]: EventKey extends "PreToolUse"
    ? ToolSpecificPreToolUseInput & {
        default: BaseHookInputs["PreToolUse"];
      }
    : EventKey extends "PostToolUse"
      ? ToolSpecificPostToolUseInput & {
          default: BaseHookInputs["PostToolUse"];
        }
      : {
          default: BaseHookInputs[EventKey];
        };
};

/**
 * Extracts all possible hook input types for a specific event type.
 * For non-tool-specific events, this returns only the default input type.
 * For tool-specific events (PreToolUse/PostToolUse), this returns a union of all possible inputs including default and tool-specific variants.
 *
 * @example
 * ```ts
 * // For non-tool-specific events
 * type SessionStartInputs = ExtractAllHookInputsForEvent<"SessionStart">
 * // Result: { cwd: string; hook_event_name: "SessionStart"; session_id: string; transcript_path: string }
 *
 * // For tool-specific events
 * type PreToolUseInputs = ExtractAllHookInputsForEvent<"PreToolUse">
 * // Result: Union of default input + all tool-specific inputs (Read, WebFetch, etc.)
 * ```
 * @package
 */
export type ExtractAllHookInputsForEvent<TEvent extends SupportedHookEvent> = {
  [K in keyof HookInputs[TEvent]]: HookInputs[TEvent][K];
}[keyof HookInputs[TEvent]];

/**
 * Extracts the hook input type for a specific tool within a given event type.
 * This type utility is used to get strongly-typed inputs for tool-specific hook handlers.
 * The second parameter is constrained to valid tool names for the given event type.
 *
 * @example
 * ```ts
 * // Extract Read tool input for PreToolUse event
 * type ReadPreInput = ExtractSpecificHookInputForEvent<"PreToolUse", "Read">
 * // Result: { cwd: string; hook_event_name: "PreToolUse"; session_id: string; transcript_path: string; tool_input: ReadInput; tool_name: "Read" }
 *
 * // Extract WebFetch tool input for PostToolUse event
 * type WebFetchPostInput = ExtractSpecificHookInputForEvent<"PostToolUse", "WebFetch">
 * // Result: { cwd: string; hook_event_name: "PostToolUse"; session_id: string; transcript_path: string; tool_input: WebFetchInput; tool_name: "WebFetch"; tool_response: WebFetchResponse }
 *
 * // Type error: "Read" is not valid for non-tool-specific events
 * type Invalid = ExtractSpecificHookInputForEvent<"SessionStart", "Read"> // ❌ Compile error
 * ```
 * @package
 */
export type ExtractSpecificHookInputForEvent<
  TEvent extends SupportedHookEvent,
  TSpecificKey extends ExtractExtendedSpecificKeys<TEvent>,
> = TSpecificKey extends keyof HookInputs[TEvent]
    ? HookInputs[TEvent][TSpecificKey]
    : never;

/**
 * @package
 */
export type ExtractExtendedSpecificKeys<TEvent extends SupportedHookEvent> =
  Exclude<keyof HookInputs[TEvent], "default">;

type BaseHookInputs = {
  [EventKey in SupportedHookEvent]: v.InferOutput<
    (typeof HookInputSchemas)[EventKey]
  >;
};

type ToolSpecificPreToolUseInput = {
  [K in keyof ToolSchema]: Omit<
    BaseHookInputs["PreToolUse"],
    "tool_input" | "tool_name"
  > & {
    tool_input: ToolSchema[K]["input"];
    tool_name: K;
  };
};

type ToolSpecificPostToolUseInput = {
  [K in keyof ToolSchema]: Omit<
    BaseHookInputs["PostToolUse"],
    "tool_input" | "tool_name" | "tool_response"
  > & {
    tool_input: ToolSchema[K]["input"];
    tool_name: K;
    tool_response: ToolSchema[K]["response"];
  };
};
