import type { HookContext, HookResponse } from "./context";
import type { HookTrigger } from "./types";
import type { Awaitable } from "./utils/types";

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
