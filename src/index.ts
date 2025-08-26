import type { ClaudeCodeTodo } from "./hook-types";

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
      description: string;
    };
    response: {
      interrupted: boolean;
      isImage: boolean;
      stderr: string;
      stdout: string;
    };
  };

  Glob: {
    input: {
      path: string;
      pattern: string;
    };
    response: {
      durationMs: number;
      filenames: string[];
      numFiles: number;
      truncated: boolean;
    };
  };

  LS: {
    input: {
      path: string;
    };
    response: string;
  };

  Read: {
    input: {
      file_path: string;
    };
    response: unknown;
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
      prompt: string;
      url: string;
    };
    response: unknown;
  };
}

export { defineHook } from "./define";

export { runHook } from "./run";

export type {
  ExtractAllHookInputsForEvent,
  ExtractSpecificHookInputForEvent,
} from "./input";
