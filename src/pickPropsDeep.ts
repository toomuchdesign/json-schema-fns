import { isJSONSchemaObjectType } from './utils';
import type {
  CompactSchema,
  JSONSchemaObject,
  MergeRecords,
  PickFromTuple,
  Simplify,
} from './utils/types';

/**
 * Union of every valid dot-notation deep-pick path reachable through
 * the `properties` tree of an object JSON schema. Used as the constraint on
 * the `Paths` parameter so invalid paths fail at the call site.
 *
 * @example
 * ```ts
 * // Schema: { properties: { a: { type: 'object', properties: { x: ... } }, b: ... } }
 * // DeepPaths<Schema> → 'a' | 'a.x' | 'b'
 * ```
 */
type DeepPaths<Schema> = Schema extends { properties: infer P }
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
 * `true` when any element of `Paths` touches `K` — either an exact match or a
 * path shaped `${K}.${string}`. Drives the key-inclusion filter in the mapped
 * type: keys not touched by any path are dropped from the resulting schema.
 *
 * @example
 * ```ts
 * // HasPathStartingWith<readonly ['a.x', 'b'], 'a'> → true
 * // HasPathStartingWith<readonly ['a.x', 'b'], 'c'> → false
 * ```
 */
type HasPathStartingWith<
  Paths extends readonly string[],
  K extends string,
> = Paths extends readonly [infer Head, ...infer Tail extends readonly string[]]
  ? Head extends K
    ? true
    : Head extends `${K}.${string}`
      ? true
      : HasPathStartingWith<Tail, K>
  : false;

/**
 * For every path in `Paths` shaped `${K}.${Rest}`, extracts `Rest` into a new
 * tuple. Order is preserved. Paths that are an exact `K` or that don't start
 * with `${K}.` are skipped. The resulting tuple is what gets passed to the
 * recursive call into `Schema['properties'][K]`.
 *
 * @example
 * ```ts
 * // SubPathsFor<readonly ['a.x', 'a.y.z', 'b'], 'a'> → readonly ['x', 'y.z']
 * ```
 */
type SubPathsFor<
  Paths extends readonly string[],
  K extends string,
> = Paths extends readonly [infer Head, ...infer Tail extends readonly string[]]
  ? Head extends `${K}.${infer Rest}`
    ? readonly [Rest, ...SubPathsFor<Tail, K>]
    : SubPathsFor<Tail, K>
  : readonly [];

/**
 * Union of the first dot-separated segment of every path in `Paths`.
 * Used to filter the `required` tuple at the current level: a key is kept in
 * `required` only if it appears as a top-level segment of some path.
 *
 * @example
 * ```ts
 * // TopLevelKeys<readonly ['a.x', 'a.y', 'b']> → 'a' | 'b'
 * ```
 */
type TopLevelKeys<Paths extends readonly string[]> = Paths extends readonly [
  infer Head extends string,
  ...infer Tail extends readonly string[],
]
  ? (Head extends `${infer H}.${string}` ? H : Head) | TopLevelKeys<Tail>
  : never;

/**
 * Recursive core type of `pickPropsDeep`. For each property `K` of `Schema`:
 * - drop `K` entirely if no path touches it (`HasPathStartingWith` is false)
 * - keep the sub-schema unchanged if any path is exactly `K` (whole wins)
 * - otherwise recurse into the sub-schema with `SubPathsFor<Paths, K>`
 *
 * The "whole wins" check is inlined as `K extends Paths[number]` — i.e. `K`
 * appears as a bare entry in the `Paths` tuple.
 *
 * `required` is narrowed at every level to the keys surviving the filter,
 * and `CompactSchema` strips out empty `required` tuples / `undefined`
 * slots introduced by the narrowing.
 */
type PickPropsDeep<
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

/**
 * Deep pick specific nested `properties` from an object JSON schema using
 * dot-notation paths.
 *
 * Paths sharing a common prefix are merged. Picking a key without a sub-path
 * keeps that property unchanged.
 *
 * @example
 * ```ts
 * pickPropsDeep(schema, ['key1.keyA', 'key2.keyB']);
 * ```
 */
export function pickPropsDeep<
  const Schema extends JSONSchemaObject,
  const Paths extends readonly DeepPaths<Schema>[],
>(schema: Schema, paths: Paths): PickPropsDeep<Schema, Paths> {
  return pickPropsDeepInternal(schema, paths) as PickPropsDeep<Schema, Paths>;
}

function pickPropsDeepInternal(
  schema: unknown,
  paths: readonly string[],
): unknown {
  isJSONSchemaObjectType(schema as { type?: unknown });
  const objectSchema = schema as JSONSchemaObject;

  const keepWhole = new Set<string>();
  const subPathsByKey: Record<string, string[]> = {};

  for (const path of paths) {
    const dotIdx = path.indexOf('.');
    if (dotIdx === -1) {
      keepWhole.add(path);
    } else {
      const head = path.slice(0, dotIdx);
      const rest = path.slice(dotIdx + 1);
      (subPathsByKey[head] ??= []).push(rest);
    }
  }

  const keptKeys = new Set<string>([
    ...keepWhole,
    ...Object.keys(subPathsByKey),
  ]);

  const required = objectSchema.required
    ? objectSchema.required.filter((key) => keptKeys.has(key))
    : [];

  const properties = Object.fromEntries(
    Object.entries(objectSchema.properties)
      .filter(([key]) => keptKeys.has(key))
      .map(([key, value]) => {
        if (keepWhole.has(key)) {
          return [key, value];
        }
        return [key, pickPropsDeepInternal(value, subPathsByKey[key]!)];
      }),
  );

  return {
    ...objectSchema,
    required: required.length > 0 ? required : undefined,
    properties,
  };
}

/**
 * Deep pick specific nested `properties` from an object JSON schema using
 * dot-notation paths.
 * Wraps `pickPropsDeep` to support function piping.
 *
 * @example
 * ```ts
 * pipeWith(schema, pipePickPropsDeep(['key1.keyA', 'key2.keyB']));
 * ```
 */
export function pipePickPropsDeep<
  const Schema extends JSONSchemaObject,
  const Paths extends readonly DeepPaths<Schema>[],
>(paths: Paths): (schema: Schema) => PickPropsDeep<Schema, Paths> {
  return (schema: Schema) => pickPropsDeep<Schema, Paths>(schema, paths);
}
