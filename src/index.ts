import type {
  AgentInput,
  BashInput,
  FileEditInput,
  FileReadInput,
  FileWriteInput,
  GlobInput,
  GrepInput,
  NotebookEditInput,
  TodoWriteInput,
  WebFetchInput,
  WebSearchInput,
} from "@anthropic-ai/claude-code/sdk-tools";

import type {
  BashOutput,
  EditOutput,
  GlobOutput,
  GrepOutput,
  NotebookEditOutput,
  ReadOutput,
  TaskOutput,
  TodoWriteOutput,
  WebFetchOutput,
  WebSearchOutput,
  WriteOutput,
} from "./tools/output";

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
  Bash: {
    input: BashInput;
    response: BashOutput;
  };

  Edit: {
    input: FileEditInput;
    response: EditOutput;
  };

  Glob: {
    input: GlobInput;
    response: GlobOutput;
  };

  Grep: {
    input: GrepInput;
    response: GrepOutput;
  };

  LS: {
    input: {
      path: string;
    };
    response: string;
  };

  MultiEdit: {
    input: {
      edits: Array<{
        new_string: string;
        old_string: string;
        /**
         * @default false
         */
        replace_all?: boolean;
      }>;
      file_path: string;
    };
    response: {
      edits: Array<{
        new_string: string;
        old_string: string;
        /**
         * @default false
         */
        replace_all?: boolean;
      }>;
      filePath: string;
      originalFileContents: string;
      structuredPatch: Array<{
        lines: string[];
        newLines: number;
        newStart: number;
        oldLines: number;
        oldStart: number;
      }>;
      userModified: boolean;
    };
  };

  NotebookEdit: {
    input: NotebookEditInput;
    response: NotebookEditOutput;
  };

  Read: {
    input: FileReadInput;
    response: ReadOutput;
  };

  Task: {
    input: AgentInput;
    response: TaskOutput;
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
    response: WriteOutput;
  };
}

export { defineHook } from "./define";

export { runHook } from "./run";

export type {
  ExtractAllHookInputsForEvent,
  ExtractSpecificHookInputForEvent,
} from "./input";
