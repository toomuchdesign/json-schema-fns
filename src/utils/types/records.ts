type UnknownRecord = Record<string, unknown>;

/**
 * Flatten the type output to improve type hints shown in editors
 */
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

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
 * It simplifies and makes the resulting type readonly as a side effect (to reduce nested generic)
 */
export type OmitByValue<Record extends UnknownRecord, Condition> = {
  readonly [Key in keyof Record as Record[Key] extends Condition
    ? never
    : Key]: Record[Key];
} & {};
