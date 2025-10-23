import { isJSONSchemaObjectType } from './utils';
import type {
  CompactSchema,
  JSONSchemaObject,
  MergeRecords,
  OmitFromTuple,
} from './utils/types';

type ObjectKeys = string | number | symbol;

type OptionalProps<
  Schema extends JSONSchemaObject,
  Keys extends ObjectKeys[] | never[] | undefined = undefined,
> = Keys extends undefined
  ? // If no keys:
    Omit<Schema, 'required'>
  : // If keys provided:
    MergeRecords<
      Schema,
      {
        required: OmitFromTuple<Schema['required'], NonNullable<Keys>[number]>;
      }
    >;
/**
 * Make specific properties of a object JSON schema optional.
 * If no keys provided, all properties become optional
 *
 * @example
 * ```ts
 * optionalProps(schema, ['key1', 'key2']);
 * ```
 */
export function optionalProps<
  const Schema extends JSONSchemaObject,
  const Keys extends (keyof Schema['properties'])[] | undefined = undefined,
>(schema: Schema, keys?: Keys): CompactSchema<OptionalProps<Schema, Keys>> {
  isJSONSchemaObjectType(schema);

  if (!schema.required) {
    // @ts-expect-error not relying on natural type flow
    return schema;
  }

  const required = keys
    ? schema.required.filter((key) => !keys.includes(key))
    : [];

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
  };
}

/**
 * Make specific properties of a object JSON schema optional.
 * If no keys provided, all properties become optional
 * Wraps `optionalProps` to support function piping.
 *
 * @example
 * ```ts
 * pipeWith(schema, pipeOptionalProps(['key1', 'key2']));
 * ```
 */
export function pipeOptionalProps<
  const Schema extends JSONSchemaObject,
  const Keys extends (keyof Schema['properties'])[] | undefined = undefined,
>(keys?: Keys) {
  return (schema: Schema) => optionalProps<Schema, Keys>(schema, keys);
}
