import * as v from "valibot";

const permissionBehaviorSchema = v.union([
  v.literal("allow"),
  v.literal("deny"),
  v.literal("ask"),
]);

const permissionUpdateDestinationSchema = v.union([
  v.literal("userSettings"),
  v.literal("projectSettings"),
  v.literal("localSettings"),
  v.literal("session"),
  v.literal("cliArg"),
]);

const permissionRuleValueSchema = v.object({
  ruleContent: v.exactOptional(v.string()),
  toolName: v.string(),
});

/**
 * @package
 */
export const permissionUpdateSchema = v.variant("type", [
  v.object({
    behavior: permissionBehaviorSchema,
    destination: permissionUpdateDestinationSchema,
    rules: v.array(permissionRuleValueSchema),
    type: v.literal("addRules"),
  }),
  v.object({
    behavior: permissionBehaviorSchema,
    destination: permissionUpdateDestinationSchema,
    rules: v.array(permissionRuleValueSchema),
    type: v.literal("replaceRules"),
  }),
  v.object({
    behavior: permissionBehaviorSchema,
    destination: permissionUpdateDestinationSchema,
    rules: v.array(permissionRuleValueSchema),
    type: v.literal("removeRules"),
  }),
  v.object({
    destination: permissionUpdateDestinationSchema,
    mode: v.union([
      v.literal("acceptEdits"),
      v.literal("bypassPermissions"),
      v.literal("default"),
      v.literal("dontAsk"),
      v.literal("plan"),
    ]),
    type: v.literal("setMode"),
  }),
  v.object({
    destination: permissionUpdateDestinationSchema,
    directories: v.array(v.string()),
    type: v.literal("addDirectories"),
  }),
  v.object({
    destination: permissionUpdateDestinationSchema,
    directories: v.array(v.string()),
    type: v.literal("removeDirectories"),
  }),
]);

export type PermissionUpdate = v.InferOutput<typeof permissionUpdateSchema>;
