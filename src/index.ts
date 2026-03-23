import type {
  AgentInput,
  AgentOutput,
  AskUserQuestionInput,
  AskUserQuestionOutput,
  BashInput,
  BashOutput,
  ConfigInput,
  ConfigOutput,
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
  NotebookEditInput,
  NotebookEditOutput,
  ReadMcpResourceInput,
  ReadMcpResourceOutput,
  SubscribeMcpResourceInput,
  SubscribeMcpResourceOutput,
  SubscribePollingInput,
  SubscribePollingOutput,
  TaskOutputInput,
  TaskStopInput,
  TaskStopOutput,
  TodoWriteInput,
  TodoWriteOutput,
  UnsubscribeMcpResourceInput,
  UnsubscribeMcpResourceOutput,
  UnsubscribePollingInput,
  UnsubscribePollingOutput,
  WebFetchInput,
  WebFetchOutput,
  WebSearchInput,
  WebSearchOutput,
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

  Config: {
    input: ConfigInput;
    response: ConfigOutput;
  };

  Edit: {
    input: FileEditInput;
    response: FileEditOutput;
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

  NotebookEdit: {
    input: NotebookEditInput;
    response: NotebookEditOutput;
  };

  Read: {
    input: FileReadInput;
    response: FileReadOutput;
  };

  ReadMcpResource: {
    input: ReadMcpResourceInput;
    response: ReadMcpResourceOutput;
  };

  Skill: {
    input: {
      args?: string;
      skill: string;
    };
    response: unknown;
  };

  SubscribeMcpResource: {
    input: SubscribeMcpResourceInput;
    response: SubscribeMcpResourceOutput;
  };

  SubscribePolling: {
    input: SubscribePollingInput;
    response: SubscribePollingOutput;
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

  UnsubscribeMcpResource: {
    input: UnsubscribeMcpResourceInput;
    response: UnsubscribeMcpResourceOutput;
  };

  UnsubscribePolling: {
    input: UnsubscribePollingInput;
    response: UnsubscribePollingOutput;
  };

  WebFetch: {
    input: WebFetchInput;
    response: WebFetchOutput;
  };

  WebSearch: {
    input: WebSearchInput;
    response: WebSearchOutput;
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
