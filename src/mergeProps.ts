import { isJSONSchemaObjectType } from './utils';
import type {
  JSONSchemaObject,
  JSONSchemaObjectOutput,
  MergeOptionalRecords,
  MergeOptionalTuples,
  MergeRecords,
} from './utils/types';

type MergeProps<
  Schema1 extends JSONSchemaObject,
  Schema2 extends JSONSchemaObject,
> = MergeRecords<
  MergeRecords<Schema1, Schema2>,
  {
    required: Readonly<
      MergeOptionalTuples<Schema1['required'], Schema2['required']>
    >;
    properties: MergeRecords<Schema1['properties'], Schema2['properties']>;
    patternProperties: MergeOptionalRecords<
      Schema1['patternProperties'],
      Schema2['patternProperties']
    >;
  }
>;

function mergeOptionalRecords(
  record1?: Record<string, unknown>,
  record2?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  return record1 || record2
    ? {
        ...record1,
        ...record2,
      }
    : undefined;
}

/**
 * Merge two object JSON schemas `properties` and `patternProperties` props into one.
 * If the same property key exists in both schemas, the property from `schema2` takes precedence.
 *
 * @example
 * ```ts
 * mergeProps(schema1, schema2);
 * ```
 */
export function mergeProps<
  const Schema1 extends JSONSchemaObject,
  const Schema2 extends JSONSchemaObject,
>(
  schema1: Schema1,
  schema2: Schema2,
): JSONSchemaObjectOutput<MergeProps<Schema1, Schema2>> {
  isJSONSchemaObjectType(schema1);
  isJSONSchemaObjectType(schema2);

  const required = [
    ...new Set([...(schema1?.required ?? []), ...(schema2?.required ?? [])]),
  ];

  const properties = {
    ...schema1.properties,
    ...schema2.properties,
  };

  const patternProperties = mergeOptionalRecords(
    schema1.patternProperties,
    schema2.patternProperties,
  );

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema1,
    ...schema2,
    required: required.length > 0 ? required : undefined,
    properties,
    patternProperties,
  };
}

/**
 * Merge two object JSON schemas `properties` and `patternProperties` props into one.
 * If the same property key exists in both schemas, the property from `schema2` takes precedence.
 * Wraps `mergeProps` to support function piping.
 *
 * @example
 * ```ts
 * pipeWith(schema1, pipeMergeProps(schema2));
 * ```
 */
export function pipeMergeProps<
  const Schema1 extends JSONSchemaObject,
  const Schema2 extends JSONSchemaObject,
>(schema2: Schema2) {
  return (schema1: Schema1) => mergeProps<Schema1, Schema2>(schema1, schema2);
}
