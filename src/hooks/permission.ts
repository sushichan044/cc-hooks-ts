import * as v from "valibot";

const permissionBehaviorSchema = v.picklist(["allow", "deny", "ask"]);

const permissionUpdateDestinationSchema = v.picklist([
  "userSettings",
  "projectSettings",
  "localSettings",
  "session",
  "cliArg",
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
    mode: v.picklist([
      "acceptEdits",
      "bypassPermissions",
      "default",
      "dontAsk",
      "delegate",
      "plan",
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
