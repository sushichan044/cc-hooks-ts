import type {
  AgentInput,
  AgentOutput,
  AskUserQuestionInput,
  AskUserQuestionOutput,
  BashInput,
  BashOutput,
  CronCreateInput,
  CronCreateOutput,
  CronDeleteInput,
  CronDeleteOutput,
  CronListInput,
  CronListOutput,
  EnterPlanModeInput,
  EnterPlanModeOutput,
  EnterWorktreeInput,
  EnterWorktreeOutput,
  ExitPlanModeInput,
  ExitPlanModeOutput,
  ExitWorktreeInput,
  ExitWorktreeOutput,
  FileEditInput,
  FileEditOutput,
  FileReadInput,
  FileReadOutput,
  FileWriteInput,
  FileWriteOutput,
  GlobInput,
  GlobOutput,
  GrepInput,
  GrepOutput,
  ListMcpResourcesInput,
  ListMcpResourcesOutput,
  McpInput,
  McpOutput,
  MonitorInput,
  MonitorOutput,
  NotebookEditInput,
  NotebookEditOutput,
  PushNotificationInput,
  PushNotificationOutput,
  ReadMcpResourceInput,
  ReadMcpResourceOutput,
  RemoteTriggerInput,
  RemoteTriggerOutput,
  REPLInput,
  REPLOutput,
  ScheduleWakeupInput,
  ScheduleWakeupOutput,
  TaskOutputInput,
  TaskStopInput,
  TaskStopOutput,
  TodoWriteInput,
  TodoWriteOutput,
  WebFetchInput,
  WebFetchOutput,
  WebSearchInput,
  WebSearchOutput,
  WorkflowInput,
  WorkflowOutput,
} from "@anthropic-ai/claude-agent-sdk/sdk-tools";

/**
 * Represents the input schema for each tool in the `PreToolUse` and `PostToolUse` hooks.
 *
 * This interface enables type-safe hook handling with tool-specific inputs and responses.
 * Users can extend this interface with declaration merging to add custom tool definitions.
 *
 * @example
 * ```ts
 * // Extend with custom tools
 * declare module "cc-hooks-ts" {
 *   interface ToolSchema {
 *     MyCustomTool: {
 *       input: {
 *         customParam: string;
 *         optionalParam?: number;
 *       };
 *       response: {
 *         result: string;
 *       };
 *     };
 *   }
 * }
 *
 * // Use in hook definition
 * const hook = defineHook({
 *   trigger: { PreToolUse: { MyCustomTool: true } },
 *   run: (context) => {
 *     // context.input.tool_input is now typed as { customParam: string; optionalParam?: number; }
 *     const { customParam, optionalParam } = context.input.tool_input;
 *     return context.success();
 *   }
 * });
 * ```
 */
export interface ToolSchema {
  AskUserQuestion: {
    input: AskUserQuestionInput;
    response: AskUserQuestionOutput;
  };

  Bash: {
    input: BashInput;
    response: BashOutput;
  };

  CronCreate: {
    input: CronCreateInput;
    response: CronCreateOutput;
  };

  CronDelete: {
    input: CronDeleteInput;
    response: CronDeleteOutput;
  };

  CronList: {
    input: CronListInput;
    response: CronListOutput;
  };

  Edit: {
    input: FileEditInput;
    response: FileEditOutput;
  };

  EnterPlanMode: {
    input: EnterPlanModeInput;
    response: EnterPlanModeOutput;
  };

  EnterWorktree: {
    input: EnterWorktreeInput;
    response: EnterWorktreeOutput;
  };

  ExitPlanMode: {
    input: ExitPlanModeInput;
    response: ExitPlanModeOutput;
  };

  ExitWorktree: {
    input: ExitWorktreeInput;
    response: ExitWorktreeOutput;
  };

  Glob: {
    input: GlobInput;
    response: GlobOutput;
  };

  Grep: {
    input: GrepInput;
    response: GrepOutput;
  };

  ListMcpResources: {
    input: ListMcpResourcesInput;
    response: ListMcpResourcesOutput;
  };

  Mcp: {
    input: McpInput;
    response: McpOutput;
  };

  Monitor: {
    input: MonitorInput;
    response: MonitorOutput;
  };

  NotebookEdit: {
    input: NotebookEditInput;
    response: NotebookEditOutput;
  };

  PushNotification: {
    input: PushNotificationInput;
    response: PushNotificationOutput;
  };

  Read: {
    input: FileReadInput;
    response: FileReadOutput;
  };

  ReadMcpResource: {
    input: ReadMcpResourceInput;
    response: ReadMcpResourceOutput;
  };

  RemoteTrigger: {
    input: RemoteTriggerInput;
    response: RemoteTriggerOutput;
  };

  REPL: {
    input: REPLInput;
    response: REPLOutput;
  };

  ScheduleWakeup: {
    input: ScheduleWakeupInput;
    response: ScheduleWakeupOutput;
  };

  Skill: {
    input: {
      args?: string;
      skill: string;
    };
    response: unknown;
  };

  Task: {
    input: AgentInput;
    response: AgentOutput;
  };

  TaskOutput: {
    input: TaskOutputInput;
    response: unknown;
  };

  TaskStop: {
    input: TaskStopInput;
    response: TaskStopOutput;
  };

  TodoWrite: {
    input: TodoWriteInput;
    response: TodoWriteOutput;
  };

  ToolSearch: {
    input: {
      /**
       * @default 5
       */
      max_results?: number;
      query: string;
    };
    response: unknown;
  };

  WebFetch: {
    input: WebFetchInput;
    response: WebFetchOutput;
  };

  WebSearch: {
    input: WebSearchInput;
    response: WebSearchOutput;
  };

  Workflow: {
    input: WorkflowInput;
    response: WorkflowOutput;
  };

  Write: {
    input: FileWriteInput;
    response: FileWriteOutput;
  };
}

export { defineHook } from "./define.ts";

export { runHook } from "./run.ts";

export type {
  ExtractAllHookInputsForEvent,
  ExtractSpecificHookInputForEvent,
} from "./hooks/index.ts";
