import type { Merge, TupleToUnion, UnionToTuple } from 'type-fest';

import type { JSONSchemaObject, JSONSchemaObjectOutput } from './types';
import { isJSONSchemaObjectType } from './utils';

/**
 * Merge and dedupe 2 tuples
 */
type MergeTuples<T1, T2> = readonly [
  ...UnionToTuple<TupleToUnion<T1> | TupleToUnion<T2>>,
];

type MergeOptionalRecords<
  Object1 extends Record<string, unknown> | undefined,
  Object2 extends Record<string, unknown> | undefined,
> =
  Object1 extends Record<string, unknown>
    ? Object2 extends Record<string, unknown>
      ? Merge<Object1, Object2>
      : Object1
    : Object2 extends Record<string, unknown>
      ? Object2
      : undefined;

type MergeSchemas<
  Schema1 extends JSONSchemaObject,
  Schema2 extends JSONSchemaObject,
> = Merge<
  Merge<Schema1, Schema2>,
  {
    required: MergeTuples<Schema1['required'], Schema2['required']>;
    properties: MergeOptionalRecords<
      Schema1['properties'],
      Schema2['properties']
    >;
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
 * Merge two object schemas into one.
 */
export function mergeObjectProperties<
  Schema1 extends JSONSchemaObject,
  Schema2 extends JSONSchemaObject,
>(
  schema1: Schema1,
  schema2: Schema2,
): JSONSchemaObjectOutput<MergeSchemas<Schema1, Schema2>> {
  isJSONSchemaObjectType(schema1);
  isJSONSchemaObjectType(schema2);

  const required = [
    ...new Set([...(schema1?.required ?? []), ...(schema2?.required ?? [])]),
  ];

  const properties = mergeOptionalRecords(
    schema1.properties,
    schema2.properties,
  );

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
