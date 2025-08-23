import type * as v from "valibot";

/**
 * A type that represents a Valibot schema.
 */
export type ValibotSchemaLike = v.BaseSchema<
  unknown,
  unknown,
  v.BaseIssue<unknown>
>;
