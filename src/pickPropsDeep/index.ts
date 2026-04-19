import { isJSONSchemaObjectType } from '../utils';
import type { JSONSchemaObject } from '../utils/types';
import type { DeepPaths, PickPropsDeep } from './types';

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

  const required = objectSchema.required
    ? objectSchema.required.filter(
        (key) => keepWhole.has(key) || key in subPathsByKey,
      )
    : [];

  const properties = Object.fromEntries(
    Object.entries(objectSchema.properties)
      .filter(([key]) => keepWhole.has(key) || key in subPathsByKey)
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
