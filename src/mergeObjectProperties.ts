import type { Merge, UnionToTuple, TupleToUnion } from 'type-fest';
import type {
  JSONSchemaObject,
  RequiredField,
  JSONSchemaObjectOutput,
} from './types';
import { isObjectType } from './utils';

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
    required: RequiredField<
      MergeTuples<Schema1['required'], Schema2['required']>
    >;
    properties: Merge<Schema1['properties'], Schema2['properties']>;
    patternProperties: MergeOptionalRecords<
      Schema1['patternProperties'],
      Schema2['patternProperties']
    >;
  }
>;

/**
 * Merge two JSON Schema object definitions.
 */
export function mergeObjectProperties<
  Schema1 extends JSONSchemaObject,
  Schema2 extends JSONSchemaObject,
>(
  schema1: Schema1,
  schema2: Schema2,
): JSONSchemaObjectOutput<MergeSchemas<Schema1, Schema2>> {
  isObjectType(schema1);
  isObjectType(schema2);

  const required = [
    ...new Set([
      ...(schema1?.required ? schema1.required : []),
      ...(schema2?.required ? schema2.required : []),
    ]),
  ];

  const properties = {
    ...schema1.properties,
    ...schema2.properties,
  };

  const patternProperties =
    schema1.patternProperties || schema2.patternProperties
      ? {
          ...schema1.patternProperties,
          ...schema2.patternProperties,
        }
      : undefined;

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema1,
    ...schema2,
    required: required.length > 0 ? required : undefined,
    properties,
    ...(patternProperties && { patternProperties }),
  };
}
