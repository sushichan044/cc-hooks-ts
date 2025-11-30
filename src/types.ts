import type { ExtractHookOutput, SupportedHookEvent } from "./hooks";
import type {
  ExtractAllHookInputsForEvent,
  ExtractExtendedSpecificKeys,
  ExtractSpecificHookInputForEvent,
} from "./hooks";
import type { ToolSchema } from "./index";

export type ExtendedTools = keyof ToolSchema;

export type HookTrigger = Partial<{
  [TEvent in SupportedHookEvent]:
    | true // subscribe to all inputs for this event
    | Partial<{
        // subscribe to specific inputs for this event
        [SchemaKey in ExtractExtendedSpecificKeys<TEvent>]?: true;
      }>;
}>;

export type ExtractTriggeredHookInput<TTrigger extends HookTrigger> = {
  [EventKey in keyof TTrigger]: EventKey extends SupportedHookEvent
    ? TTrigger[EventKey] extends true
      ? // subscribe to all inputs for this event
        ExtractAllHookInputsForEvent<EventKey>
      : TTrigger[EventKey] extends Record<PropertyKey, true>
        ? // subscribe to specific inputs for this event
          {
            [SpecificKey in keyof TTrigger[EventKey]]: SpecificKey extends ExtractExtendedSpecificKeys<EventKey>
              ? ExtractSpecificHookInputForEvent<EventKey, SpecificKey>
              : never;
          }[keyof TTrigger[EventKey]]
        : never
    : never;
}[keyof TTrigger];

export type ExtractTriggeredHookOutput<TTrigger extends HookTrigger> = {
  [EventKey in keyof TTrigger]: EventKey extends SupportedHookEvent
    ? ExtractHookOutput<EventKey>
    : never;
}[keyof TTrigger];
