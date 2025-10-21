import type { Simplify } from 'type-fest';

type UnknownRecord = Record<string, unknown>;

/**
 * Merge two Records into a new type. Keys of the second type overrides keys of the first type
 */
export type MergeRecords<
  Destination extends UnknownRecord,
  Source extends UnknownRecord,
> = Simplify<Omit<Destination, keyof Source> & Source>;

/**
 * Merge two optional records, keeping `undefined` if both are undefined
 */
export type MergeOptionalRecords<
  A extends UnknownRecord | undefined,
  B extends UnknownRecord | undefined,
> = A extends UnknownRecord
  ? B extends UnknownRecord
    ? MergeRecords<A, B>
    : A
  : B extends UnknownRecord
    ? B
    : undefined;

/**
 * Exclude keys from a record that matches the given `Condition`
 */
export type OmitByValue<Record extends UnknownRecord, Condition> = {
  [Key in keyof Record as Record[Key] extends Condition
    ? never
    : Key]: Record[Key];
};
