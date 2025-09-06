import type { Merge, Simplify } from 'type-fest';
import type { JSONSchemaObject, RequiredField } from './types';
import { isObjectType } from './utils';

type NormalizeTuple<T> = T extends readonly unknown[] | unknown[] ? T : [];
// @TODO handle duplicates
type MergeTuples<T1, T2> = readonly [
  ...NormalizeTuple<T1>,
  ...NormalizeTuple<T2>,
];

type MergeSchemas<
  Schema1 extends JSONSchemaObject,
  Schema2 extends JSONSchemaObject,
> = Merge<
  Merge<Schema1, Schema2>,
  Readonly<{
    required: RequiredField<
      MergeTuples<Schema1['required'], Schema2['required']>
    >;
    properties: Merge<Schema1['properties'], Schema2['properties']>;
  }>
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
): Simplify<MergeSchemas<Schema1, Schema2>> {
  isObjectType(schema1);
  isObjectType(schema2);

  const required = [
    ...(schema1?.required ? schema1.required : []),
    ...(schema2?.required ? schema2.required : []),
  ];

  const properties = {
    ...schema1.properties,
    ...schema2.properties,
  };

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema1,
    ...schema2,
    required: required.length > 0 ? required : undefined,
    properties,
  };
}
