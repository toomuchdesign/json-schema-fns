import { isJSONSchemaObjectType } from '../utils';
import type { JSONSchemaObject } from '../utils/types';
import type { DeepPaths, PickPropsDeepWith } from './types';

function pickPropsDeepInternal(
  schema: JSONSchemaObject,
  paths: readonly string[],
): JSONSchemaObject {
  isJSONSchemaObjectType(schema);

  const keepWhole = new Set<string>();
  const subPathsByKey: Record<string, string[]> = {};

  for (const path of paths) {
    const dotIdx = path.indexOf('.');
    if (dotIdx === -1) {
      keepWhole.add(path);
    } else {
      const head = path.slice(0, dotIdx);
      const rest = path.slice(dotIdx + 1);
      if (!subPathsByKey[head]) {
        subPathsByKey[head] = [];
      }
      subPathsByKey[head].push(rest);
    }
  }

  const keptKeys = new Set<string>([
    ...keepWhole,
    ...Object.keys(subPathsByKey),
  ]);

  const required = schema.required
    ? schema.required.filter((key) => keptKeys.has(key))
    : [];

  const properties = Object.fromEntries(
    Object.entries(schema.properties)
      .filter(([key]) => keptKeys.has(key))
      .map(([key, value]) => {
        if (keepWhole.has(key)) {
          return [key, value];
        }
        return [
          key,
          pickPropsDeepInternal(value as JSONSchemaObject, subPathsByKey[key]!),
        ];
      }),
  );

  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
    properties,
  };
}

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
>(schema: Schema, paths: Paths): PickPropsDeepWith<Schema, Paths[number]> {
  // @ts-expect-error not relying on natural type flow
  return pickPropsDeepInternal(schema, paths);
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
>(paths: Paths): (schema: Schema) => PickPropsDeepWith<Schema, Paths[number]> {
  return (schema: Schema) => pickPropsDeep<Schema, Paths>(schema, paths);
}
