import type { OmitByValue } from './index';

/**
 * Produces a cleaned-up version of a JSON schema–like type by
 * removing properties whose values make them safely omittable in the final output on the root level.
 *
 * Specifically, it strips out keys whose values are `undefined` or empty arrays (`readonly []`).
 *
 * Side-effect:
 * - simplifies the resulting type
 * - sets the resulting type properties as readonly
 */
export type CompactSchema<Schema extends Record<string, unknown>> = OmitByValue<
  Schema,
  readonly [] | undefined
>;
