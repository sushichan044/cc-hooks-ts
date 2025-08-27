import type { ClaudeCodeTodo } from "./hook-types";
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
    input: {
      command: string;
      description?: string;
      run_in_background?: boolean;
      /**
       * Timeout in milliseconds for the process (ignored if run_in_background is true).
       */
      timeout?: number;
    };
    response: {
      interrupted: boolean;
      isImage: boolean;
      stderr: string;
      stdout: string;
    };
  };

  Edit: {
    input: {
      file_path: string;
      new_string: string;
      old_string: string;
      /**
       * @default false
       */
      replace_all?: boolean;
    };
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

  Glob: {
    input: {
      /**
       * @default process.cwd()
       */
      path?: string;
      pattern: string;
    };
    response: {
      durationMs: number;
      filenames: string[];
      numFiles: number;
      truncated: boolean;
    };
  };

  Grep: {
    input: {
      "-A"?: number;
      "-B"?: number;
      "-C"?: number;
      "-i"?: boolean;
      "-n"?: boolean;
      glob?: string;
      head_limit?: number;
      multiline?: boolean;
      /**
       * @default "files_with_matches"
       */
      output_mode?: "content" | "count" | "files_with_matches";
      path?: string;
      pattern: string;
      type?: string;
    };
    response: {
      content: string;
      mode: "content" | "count" | "files_with_matches";
      numFiles: number;
      numLines: number;
    };
  };

  LS: {
    input: {
      ignore?: string[];
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
    /**
     * @default edit_mode: "replace"
     */
    input:
      | {
          cell_id: string;
          edit_mode: "delete";
          new_source: string;
          notebook_path: string;
        }
      | {
          cell_id: string;
          cell_type?: "code" | "markdown";
          edit_mode: "replace";
          new_source: string;
          notebook_path: string;
        }
      | {
          cell_id?: string;
          cell_type: "code" | "markdown";
          edit_mode: "insert";
          new_source: string;
          notebook_path: string;
        };
    response: {
      cell_type: "code" | "markdown";
      edit_mode: "delete" | "insert" | "replace";
      error: string;
      language: string;
      new_source: string;
    };
  };

  Read: {
    input: {
      file_path: string;
      limit?: number;
      offset?: number;
    };
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
    input: {
      todos: ClaudeCodeTodo[];
    };
    response: {
      newTodos: ClaudeCodeTodo[];
      oldTodos: ClaudeCodeTodo[];
    };
  };

  WebFetch: {
    input: {
      /**
       * @default 100
       */
      charThreshold?: number;
      prompt: string;
      url: string;
    };
    response: {
      bytes: number;
      code: number;
      codeText: string;
      durationMs: number;
      result: string;
      url: string;
    };
  };

  Write: {
    input: {
      content: string;
      file_path: string;
    };
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
