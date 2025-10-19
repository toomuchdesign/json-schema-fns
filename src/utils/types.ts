import type { ConditionalExcept, Simplify, UnionToTuple } from 'type-fest';

// https://github.com/ThomasAribart/json-schema-to-ts/blob/12767c1eab895159c01f5e6898d8e5e711ff9d1c/src/definitions/jsonSchema.ts
export type JSONSchema = Readonly<{
  type: string;
  required?: readonly string[];
  properties?: Readonly<Record<string, unknown>>;
  patternProperties?: Readonly<Record<string, unknown>>;
  additionalProperties?: boolean;
}>;

export type JSONSchemaObject = MergeRecords<
  JSONSchema,
  {
    type: 'object';
    properties: Readonly<Record<string, unknown>>;
  }
>;

export type JSONSchemaObjectOutput<Schema> = Readonly<
  // Remove undefined props and empty arrays
  ConditionalExcept<Schema, readonly [] | undefined>
>;

type UnknownRecord = Record<string, unknown>;

/**
 * Merge two Records into a new type. Keys of the second type overrides keys of the first type.
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

type StringTuple = readonly string[];

/**
 * Produce a new tuple by removing specified entries from an existing tuple type
 */
export type OmitFromTuple<
  Tuple extends StringTuple | undefined,
  EntriesToOmit,
> = Tuple extends readonly [infer Head, ...infer Tail extends StringTuple]
  ? Head extends EntriesToOmit
    ? OmitFromTuple<Tail, EntriesToOmit>
    : readonly [Head, ...OmitFromTuple<Tail, EntriesToOmit>]
  : [];

/**
 * Produce a new tuple by picking specified entries from an existing tuple type
 */
export type PickFromTuple<
  Tuple extends StringTuple,
  EntriesToPick,
> = Tuple extends readonly [infer Head, ...infer Tail extends StringTuple]
  ? Head extends EntriesToPick
    ? readonly [Head, ...PickFromTuple<Tail, EntriesToPick>]
    : PickFromTuple<Tail, EntriesToPick>
  : readonly [];

/**
 * Merge and dedupe 2 tuples
 */
export type MergeTuples<
  T1 extends StringTuple,
  T2 extends StringTuple,
> = Readonly<
  UnionToTuple<
    // Transform tuples to union to remove duplicates
    T1[number] | T2[number]
  >
>;

/**
 * Merge and dedupe 2 optional tuples
 */
export type MergeOptionalTuples<
  T1 extends StringTuple | undefined,
  T2 extends StringTuple | undefined,
> = T1 extends StringTuple
  ? T2 extends StringTuple
    ? MergeTuples<T1, T2>
    : T1
  : T2 extends StringTuple
    ? T2
    : [];
