import { groupPathsByHead, isJSONSchemaObjectType } from '../utils';
import type { JSONSchemaObject } from '../utils/types';
import type { DeepPaths, PickPropsDeepWith } from './types';

function pickPropsDeepInternal(
  schema: JSONSchemaObject,
  paths: readonly string[],
): JSONSchemaObject {
  isJSONSchemaObjectType(schema);

  const { bare, nested } = groupPathsByHead(paths);
  const keptKeys = new Set<string>([...bare, ...Object.keys(nested)]);
  const required = schema.required
    ? schema.required.filter((key) => keptKeys.has(key))
    : [];

  const properties: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema.properties)) {
    if (keptKeys.has(key)) {
      properties[key] = bare.has(key)
        ? value
        : pickPropsDeepInternal(
            // @ts-expect-error nested value is a JSONSchemaObject by DeepPaths constraint — TS cannot infer it through Record<string, unknown>
            value,
            nested[key]!,
          );
    }
  }

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
