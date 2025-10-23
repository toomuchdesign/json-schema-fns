import type { UnknownRecord } from './definitions';

/**
 * Exclude keys from a record that matches the given `Condition`
 * It simplifies and makes the resulting type readonly as a side effect (to reduce nested generic)
 *
 * Side-effect:
 * - simplifies the resulting type
 * - sets the resulting type properties as readonly
 */
export type OmitByValue<Record extends UnknownRecord, Condition> = {
  readonly [Key in keyof Record as Record[Key] extends Condition
    ? never
    : Key]: Record[Key];
} & {};
