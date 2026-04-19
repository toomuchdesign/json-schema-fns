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
export type DeepPaths<Schema> = Schema extends { properties: infer Properties }
  ? {
      [Key in Extract<keyof Properties, string>]: Properties[Key] extends {
        type: 'object';
        properties: object;
      }
        ? Key | `${Key}.${DeepPaths<Properties[Key]>}`
        : Key;
    }[Extract<keyof Properties, string>]
  : never;

/**
 * @internal
 *
 * Returns `true` if any element of `Paths` either equals `Key` exactly or
 * begins with `${Key}.`; `false` otherwise.
 *
 * @example
 * ```ts
 * HasPathStartingWith<'a.x' | 'b', 'a'> // → true
 * HasPathStartingWith<'a.x' | 'b', 'c'> // → false
 * ```
 */
export type HasPathStartingWith<Paths extends string, Key extends string> = [
  Extract<Paths, Key | `${Key}.${string}`>,
] extends [never]
  ? false
  : true;

/**
 * @internal
 *
 * Filters `Paths` to those starting with `${Key}.`, then strips that prefix,
 * returning the remainders as a union. Paths that are an exact `Key` or don't
 * start with `${Key}.` are omitted.
 *
 * Distributes over the input union, so no tuple recursion is needed.
 *
 * @example
 * ```ts
 * SubPathsFor<'a.x' | 'a.y.z' | 'b', 'a'> // → 'x' | 'y.z'
 * ```
 */
export type SubPathsFor<
  Paths extends string,
  Key extends string,
> = Paths extends `${Key}.${infer Rest}` ? Rest : never;

/**
 * @internal
 *
 * Extracts the first dot-separated segment of a string. Returns the string
 * unchanged when it contains no dot. Distributes over unions.
 *
 * @example
 * ```ts
 * FirstPathSegment<'a.x'> // → 'a'
 * FirstPathSegment<'b'>   // → 'b'
 * FirstPathSegment<'a.x' | 'b'> // → 'a' | 'b'
 * ```
 */
export type FirstPathSegment<Path extends string> =
  Path extends `${infer Head}.${string}` ? Head : Path;

/**
 * @internal
 *
 * Union-based core of `PickPropsDeep`. Accepts `Paths` as a string union
 * (not a tuple) so all internal operations are distributive conditionals
 * with no tuple recursion.
 *
 * Three rules per property `Key`:
 * - **Drop** `Key` when no path touches it.
 * - **Keep whole** when a path is exactly `Key` ("whole wins").
 * - **Recurse** otherwise with `SubPathsFor<Paths, Key>`.
 */
export type PickPropsDeepWith<
  Schema extends JSONSchemaObject,
  Paths extends string,
> = CompactSchema<
  MergeRecords<
    Schema,
    {
      properties: Simplify<{
        [Key in keyof Schema['properties'] as Key extends string
          ? HasPathStartingWith<Paths, Key> extends true
            ? Key
            : never
          : never]: Key extends Paths
          ? Schema['properties'][Key]
          : Schema['properties'][Key] extends JSONSchemaObject
            ? PickPropsDeepWith<
                Schema['properties'][Key],
                SubPathsFor<Paths, Key & string>
              >
            : Schema['properties'][Key];
      }>;
      required: Schema['required'] extends readonly string[]
        ? PickFromTuple<Schema['required'], FirstPathSegment<Paths>>
        : undefined;
    }
  >
>;
