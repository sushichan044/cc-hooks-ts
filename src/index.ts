/**
 * Represents the input schema for each tool in the `PreToolUse` and `PostToolUse` hooks.
 *
 * Users can extend this interface with declaration merging
 *
 * ```ts
 * declare module "claude-kata" {
 *   interface ToolSchema {
 *     MyCustomTool: {
 *       input: {
 *         customParam: string;
 *         optionalParam?: number;
 *       };
 *     };
 *   }
 * }
 * ```
 */
export interface ToolSchema {
  Read: {
    input: {
      file_path: string;
    };
    response: unknown;
  };
  WebFetch: {
    input: {
      prompt: string;
      url: string;
    };
    response: unknown;
  };
}
