import type { DeepPaths } from '../pickPropsDeep/types';
import { isJSONSchemaObjectType } from '../utils';
import type { JSONSchemaObject } from '../utils/types';
import type { OmitPropsDeepWith } from './types';

function omitPropsDeepInternal(
  schema: JSONSchemaObject,
  paths: readonly string[],
): JSONSchemaObject {
  isJSONSchemaObjectType(schema);

  const dropWhole = new Set<string>();
  const subPathsByKey: Record<string, string[]> = {};

  for (const path of paths) {
    const dotIdx = path.indexOf('.');
    if (dotIdx === -1) {
      dropWhole.add(path);
    } else {
      const head = path.slice(0, dotIdx);
      const rest = path.slice(dotIdx + 1);
      if (!subPathsByKey[head]) {
        subPathsByKey[head] = [];
      }
      subPathsByKey[head].push(rest);
    }
  }

  const required = schema.required
    ? schema.required.filter((key) => !dropWhole.has(key))
    : [];

  const properties: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema.properties)) {
    if (dropWhole.has(key)) continue;
    if (subPathsByKey[key]) {
      properties[key] = omitPropsDeepInternal(
        // @ts-expect-error nested value is a JSONSchemaObject by DeepPaths constraint — TS cannot infer it through Record<string, unknown>
        value,
        subPathsByKey[key]!,
      );
    } else {
      properties[key] = value;
    }
  }

  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
    properties,
  };
}

/**
 * Deep omit specific nested `properties` from an object JSON schema using
 * dot-notation paths.
 *
 * Paths sharing a common prefix are merged. Omitting a bare key drops the
 * whole sub-schema; a dotted path drills in and drops only the leaf. When
 * both forms target the same key, the whole drop wins.
 *
 * @example
 * ```ts
 * omitPropsDeep(schema, ['key1.keyA', 'key2']);
 * ```
 */
export function omitPropsDeep<
  const Schema extends JSONSchemaObject,
  const Paths extends readonly DeepPaths<Schema>[],
>(schema: Schema, paths: Paths): OmitPropsDeepWith<Schema, Paths[number]> {
  // @ts-expect-error not relying on natural type flow
  return omitPropsDeepInternal(schema, paths);
}

/**
 * Deep omit specific nested `properties` from an object JSON schema using
 * dot-notation paths.
 * Wraps `omitPropsDeep` to support function piping.
 *
 * @example
 * ```ts
 * pipeWith(schema, pipeOmitPropsDeep(['key1.keyA', 'key2']));
 * ```
 */
export function pipeOmitPropsDeep<
  const Schema extends JSONSchemaObject,
  const Paths extends readonly DeepPaths<Schema>[],
>(paths: Paths): (schema: Schema) => OmitPropsDeepWith<Schema, Paths[number]> {
  return (schema: Schema) => omitPropsDeep<Schema, Paths>(schema, paths);
}
