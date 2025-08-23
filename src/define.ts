import type { HookContext, HookResponse } from "./context";
import type { HookTrigger } from "./types";
import type { Awaitable } from "./utils/types";

/**
 * Creates a type-safe Claude Code hook definition.
 *
 * This function provides a way to define hooks with full TypeScript type safety,
 * including input validation using Valibot schemas and strongly typed context.
 *
 * @param definition - The hook definition object containing trigger events and handler function
 * @returns The same hook definition, but with enhanced type safety
 *
 * @example
 * ```ts
 * // Basic session start hook
 * const sessionHook = defineHook({
 *   trigger: { SessionStart: true },
 *   run: (context) => {
 *     console.log(`Session started: ${context.input.session_id}`);
 *     return context.success({
 *       messageForUser: "Welcome to your coding session!"
 *     });
 *   }
 * });
 *
 * // Tool-specific PreToolUse hook
 * const readHook = defineHook({
 *   trigger: { PreToolUse: { Read: true } },
 *   run: (context) => {
 *     // context.input.tool_input is typed as { file_path: string }
 *     const { file_path } = context.input.tool_input;
 *
 *     if (file_path.includes('.env')) {
 *       return context.blockingError('Cannot read environment files');
 *     }
 *
 *     return context.success();
 *   }
 * });
 *
 * // Multiple event triggers with conditional logic
 * const multiEventHook = defineHook({
 *   trigger: {
 *     PreToolUse: { Read: true, WebFetch: true },
 *     PostToolUse: { Read: true }
 *   },
 *   shouldRun: () => process.env.NODE_ENV === 'development',
 *   run: (context) => {
 *     // Handle different events and tools based on context.input
 *     return context.success();
 *   }
 * });
 * ```
 */
export function defineHook<THookTrigger extends HookTrigger = HookTrigger>(
  definition: HookDefinition<THookTrigger>,
): HookDefinition<THookTrigger> {
  return definition;
}

export type HookDefinition<THookTrigger extends HookTrigger = HookTrigger> = {
  /**
   * The event that triggers the hook.
   */
  trigger: THookTrigger;

  /**
   * The function to run when the hook is triggered.
   *
   * @example
   * ```ts
   * // Example usage
   * (context) => {
   *   const input = context.input;
   *
   *   // Your hook logic here
   *
   *   return context.success();
   * }
   */
  run: HookHandler<THookTrigger>;

  /**
   * Determines whether the hook should run.
   *
   * @default true
   *
   * @returns Whether the hook should run.
   */
  shouldRun?: (() => Awaitable<boolean>) | boolean;
};

type HookHandler<THookTrigger extends HookTrigger> = (
  context: HookContext<THookTrigger>,
) => Awaitable<HookResponse<THookTrigger>>;
