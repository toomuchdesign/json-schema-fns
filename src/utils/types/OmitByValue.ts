import type { UnknownRecord } from './definitions';

/**
 * Exclude keys from a record that matches the given `Condition`
 * It simplifies and makes the resulting type readonly as a side effect (to reduce nested generic)
 */
export type OmitByValue<Record extends UnknownRecord, Condition> = {
  readonly [Key in keyof Record as Record[Key] extends Condition
    ? never
    : Key]: Record[Key];
} & {};
