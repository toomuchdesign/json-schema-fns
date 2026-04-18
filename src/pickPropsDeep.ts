import { isJSONSchemaObjectType } from './utils';
import type {
  CompactSchema,
  JSONSchemaObject,
  MergeRecords,
  PickFromTuple,
  Simplify,
} from './utils/types';

/**
 * Union of all valid dot-notation deep-pick paths for a given object JSON schema.
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

type HasExactPath<
  Paths extends readonly string[],
  K extends string,
> = Paths extends readonly [infer Head, ...infer Tail extends readonly string[]]
  ? Head extends K
    ? true
    : HasExactPath<Tail, K>
  : false;

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

type SubPathsFor<
  Paths extends readonly string[],
  K extends string,
> = Paths extends readonly [infer Head, ...infer Tail extends readonly string[]]
  ? Head extends `${K}.${infer Rest}`
    ? readonly [Rest, ...SubPathsFor<Tail, K>]
    : SubPathsFor<Tail, K>
  : readonly [];

type TopLevelKeys<Paths extends readonly string[]> = Paths extends readonly [
  infer Head extends string,
  ...infer Tail extends readonly string[],
]
  ? (Head extends `${infer H}.${string}` ? H : Head) | TopLevelKeys<Tail>
  : never;

type PickPropsDeep<
  Schema extends JSONSchemaObject,
  Paths extends readonly string[],
> = CompactSchema<
  MergeRecords<
    Schema,
    {
      properties: Simplify<{
        [K in keyof Schema['properties'] as K extends string
          ? HasPathStartingWith<Paths, K> extends true
            ? K
            : never
          : never]: K extends string
          ? HasExactPath<Paths, K> extends true
            ? Schema['properties'][K]
            : Schema['properties'][K] extends JSONSchemaObject
              ? PickPropsDeep<Schema['properties'][K], SubPathsFor<Paths, K>>
              : Schema['properties'][K]
          : Schema['properties'][K];
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
