import type {
  AgentInput,
  AgentOutput,
  AskUserQuestionInput,
  AskUserQuestionOutput,
  BashInput,
  BashOutput,
  ExitPlanModeInput,
  ExitPlanModeOutput,
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
  NotebookEditInput,
  NotebookEditOutput,
  ReadMcpResourceInput,
  ReadMcpResourceOutput,
  TaskOutputInput,
  TaskStopInput,
  TaskStopOutput,
  TodoWriteInput,
  TodoWriteOutput,
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

  Edit: {
    input: FileEditInput;
    response: FileEditOutput;
  };

  ExitPlanMode: {
    input: ExitPlanModeInput;
    response: ExitPlanModeOutput;
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

export { defineHook } from "./define";

export { runHook } from "./run";

export type { ExtractAllHookInputsForEvent, ExtractSpecificHookInputForEvent } from "./hooks";
