import type {
  BashInput,
  ExitPlanModeInput,
  FileEditInput,
  FileReadInput,
  FileWriteInput,
  GlobInput,
  GrepInput,
  NotebookEditInput,
  TodoWriteInput,
  WebFetchInput,
  WebSearchInput,
} from "@anthropic-ai/claude-code/sdk-tools.d.ts";

import type { AutoComplete } from "./utils/types";

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
    response: {
      interrupted: boolean;
      isImage: boolean;
      stderr: string;
      stdout: string;
    };
  };
  Edit: {
    input: FileEditInput;
    response: {
      filePath: string;
      newString: string;
      oldString: string;
      originalFile: string;
      replaceAll: boolean;
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

  ExitPlanMode: {
    input: ExitPlanModeInput;
    response: unknown;
  };

  Glob: {
    input: GlobInput;
    response: {
      durationMs: number;
      filenames: string[];
      numFiles: number;
      truncated: boolean;
    };
  };

  Grep: {
    input: GrepInput;
    response: {
      content: string;
      mode: "content" | "count" | "files_with_matches";
      numFiles: number;
      numLines: number;
    };
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
    response: {
      cell_type: "code" | "markdown";
      edit_mode: "delete" | "insert" | "replace";
      error: string;
      language: string;
      new_source: string;
    };
  };

  Read: {
    input: FileReadInput;
    response:
      | {
          file: {
            cells: Array<
              | {
                  cell_id: string;
                  cellType: "code";
                  language: string;
                  source: string;
                }
              | {
                  cell_id: string;
                  cellType: "markdown";
                  source: string;
                }
            >;
            filePath: string;
          };
          type: "notebook";
        }
      | {
          file: {
            content: string;
            filePath: string;
            numLines: number;
            startLine: number;
            totalLines: number;
          };
          type: "text";
        };
  };

  Task: {
    input: {
      description: string;
      prompt: string;
      subagent_type: AutoComplete<
        "general-purpose" | "output-style-setup" | "statusline-setup"
      >;
    };
    response: {
      content: Array<{
        text: string;
        type: "text";
      }>;
      totalDurationMs: number;
      totalTokens: number;
      totalToolUseCount: number;
      usage: {
        cache_creation: {
          ephemeral_1h_input_tokens: number;
          ephemeral_5m_input_tokens: number;
        };
        cache_creation_input_tokens: number;
        cache_read_input_tokens: number;
        input_tokens: number;
        output_tokens: number;
      };
    };
  };

  TodoWrite: {
    input: TodoWriteInput;
    response: unknown;
  };

  WebFetch: {
    input: WebFetchInput;
    response: {
      bytes: number;
      code: number;
      codeText: string;
      durationMs: number;
      result: string;
      url: string;
    };
  };

  WebSearch: {
    input: WebSearchInput;
    response: unknown;
  };

  Write: {
    input: FileWriteInput;
    response: {
      content: string;
      filePath: string;
      structuredPatch: unknown[];
      type: "create";
    };
  };
}

export { defineHook } from "./define";

export { runHook } from "./run";

export type {
  ExtractAllHookInputsForEvent,
  ExtractSpecificHookInputForEvent,
} from "./input";
