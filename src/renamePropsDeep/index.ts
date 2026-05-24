import { renameProps } from '../renameProps';
import { isJSONSchemaObjectType } from '../utils';
import type { JSONSchemaObject } from '../utils/types';
import { groupRenamesByHead } from './groupRenamesByHead';
import type { DeepRenamesFor, RenamePropsDeepWith } from './types';

function renamePropsDeepInternal(
  schema: JSONSchemaObject,
  renames: Readonly<Record<string, string>>,
): JSONSchemaObject {
  isJSONSchemaObjectType(schema);

  const { bare, nested } = groupRenamesByHead(renames);
  const properties: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(schema.properties)) {
    if (nested[key]) {
      properties[key] = renamePropsDeepInternal(
        // @ts-expect-error nested value is a JSONSchemaObject by DeepRenamesFor constraint — TS cannot infer it through Record<string, unknown>
        value,
        nested[key]!,
      );
    } else {
      properties[key] = value;
    }
  }

  return renameProps({ ...schema, properties }, bare);
}

/**
 * Deep rename specific nested `properties` in an object JSON schema using
 * dot-notation paths. Values are bare target names — renames don't move
 * properties between levels.
 *
 * Renames at different levels coexist: `{ user: 'account', 'user.id': 'userId' }`
 * renames the top-level `user` to `account` and renames `id` to `userId` inside
 * the (now-renamed) object.
 *
 * @example
 * ```ts
 * renamePropsDeep(schema, { 'user.id': 'userId', meta: 'metadata' });
 * ```
 */
export function renamePropsDeep<
  const Schema extends JSONSchemaObject,
  const Renames extends DeepRenamesFor<Schema>,
>(schema: Schema, renames: Renames): RenamePropsDeepWith<Schema, Renames> {
  // @ts-expect-error not relying on natural type flow
  return renamePropsDeepInternal(
    schema,
    renames as Readonly<Record<string, string>>,
  );
}

/**
 * Deep rename specific nested `properties` in an object JSON schema using
 * dot-notation paths.
 * Wraps `renamePropsDeep` to support function piping.
 *
 * @example
 * ```ts
 * pipeWith(schema, pipeRenamePropsDeep({ 'user.id': 'userId' }));
 * ```
 */
export function pipeRenamePropsDeep<
  const Schema extends JSONSchemaObject,
  const Renames extends DeepRenamesFor<Schema>,
>(renames: Renames): (schema: Schema) => RenamePropsDeepWith<Schema, Renames> {
  return (schema: Schema) => renamePropsDeep<Schema, Renames>(schema, renames);
}
