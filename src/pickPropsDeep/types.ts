import type {
  CompactSchema,
  JSONSchemaObject,
  MergeRecords,
  PickFromTuple,
  Simplify,
} from '../utils/types';

/**
 * @internal
 *
 * Builds a union of all valid dot-notation paths through a JSON schema's
 * `properties` tree. Shallow keys (`'a'`) and nested keys (`'a.x'`) are both
 * included. Only object sub-schemas (those with `type: 'object'` and their own
 * `properties`) are traversed further.
 *
 * @example
 * ```ts
 * type Schema = {
 *   properties: {
 *     a: { type: 'object'; properties: { x: { type: 'string' } } };
 *     b: { type: 'number' };
 *   };
 * };
 * DeepPaths<Schema> // → 'a' | 'a.x' | 'b'
 * ```
 */
export type DeepPaths<Schema> = Schema extends { properties: infer P }
  ? {
      [K in Extract<keyof P, string>]: P[K] extends {
        type: 'object';
        properties: object;
      }
        ? K | `${K}.${DeepPaths<P[K]>}`
        : K;
    }[Extract<keyof P, string>]
  : never;

/**
 * @internal
 *
 * Returns `true` if any element of `Paths` either equals `K` exactly or
 * begins with `${K}.`; `false` otherwise.
 *
 * @example
 * ```ts
 * HasPathStartingWith<readonly ['a.x', 'b'], 'a'> // → true
 * HasPathStartingWith<readonly ['a.x', 'b'], 'c'> // → false
 * ```
 */
export type HasPathStartingWith<
  Paths extends readonly string[],
  K extends string,
> = [Extract<Paths[number], K | `${K}.${string}`>] extends [never]
  ? false
  : true;

/**
 * @internal
 *
 * Filters `Paths` to those starting with `${K}.`, then strips that prefix,
 * returning the remainders as a new tuple. Paths that don't start with
 * `${K}.` are omitted entirely.
 *
 * @example
 * ```ts
 * SubPathsFor<readonly ['a.x', 'a.y.z', 'b'], 'a'> // → readonly ['x', 'y.z']
 * ```
 */
export type SubPathsFor<
  Paths extends readonly string[],
  K extends string,
> = Paths extends readonly [infer Head, ...infer Tail extends readonly string[]]
  ? Head extends `${K}.${infer Rest}`
    ? readonly [Rest, ...SubPathsFor<Tail, K>]
    : SubPathsFor<Tail, K>
  : readonly [];

/**
 * @internal
 *
 * Extracts the first dot-separated segment of a string. Returns the string
 * unchanged when it contains no dot. Distributes over unions.
 *
 * @example
 * ```ts
 * FirstSegment<'a.x'> // → 'a'
 * FirstSegment<'b'>   // → 'b'
 * FirstSegment<'a.x' | 'b'> // → 'a' | 'b'
 * ```
 */
export type FirstSegment<T extends string> = T extends `${infer H}.${string}`
  ? H
  : T;

/**
 * @internal
 *
 * Extracts the first dot-separated segment from every path in `Paths` into a
 * union. For a bare key like `'b'` the whole string is returned; for a
 * compound path like `'a.x'` only `'a'` is returned.
 *
 * @example
 * ```ts
 * TopLevelKeys<readonly ['a.x', 'a.y', 'b']> // → 'a' | 'b'
 * ```
 */
export type TopLevelKeys<Paths extends readonly string[]> = FirstSegment<
  Paths[number]
>;

/**
 * @internal
 *
 * Recursively filters a JSON schema's `properties` to those touched by `Paths`,
 * applying three rules per property `Key`:
 * - **Drop** `Key` when no path touches it (`HasPathStartingWith` is `false`).
 * - **Keep whole** when a path is exactly `Key` — the sub-schema is left
 *   unchanged ("whole wins" rule, checked as `Key extends Paths[number]`).
 * - **Recurse** otherwise, passing `SubPathsFor<Paths, Key>` into the
 *   sub-schema.
 *
 * `required` is narrowed at every level to `TopLevelKeys<Paths>`, and
 * `CompactSchema` removes any empty `required` tuples or `undefined` values
 * that result from the filtering.
 */
export type PickPropsDeep<
  Schema extends JSONSchemaObject,
  Paths extends readonly string[],
> = CompactSchema<
  MergeRecords<
    Schema,
    {
      properties: Simplify<{
        [Key in keyof Schema['properties'] as Key extends string
          ? HasPathStartingWith<Paths, Key> extends true
            ? Key
            : never
          : never]: Key extends Paths[number]
          ? Schema['properties'][Key]
          : Schema['properties'][Key] extends JSONSchemaObject
            ? PickPropsDeep<
                Schema['properties'][Key],
                SubPathsFor<Paths, Key & string>
              >
            : Schema['properties'][Key];
      }>;
      required: Schema['required'] extends readonly string[]
        ? PickFromTuple<Schema['required'], TopLevelKeys<Paths>>
        : undefined;
    }
  >
>;
