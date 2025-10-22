import type { MergeRecords, OmitByValue, Simplify } from './records';

// https://github.com/ThomasAribart/json-schema-to-ts/blob/12767c1eab895159c01f5e6898d8e5e711ff9d1c/src/definitions/jsonSchema.ts
export type JSONSchema = Readonly<{
  type: string;
  required?: readonly string[];
  properties?: Readonly<Record<string, unknown>>;
  patternProperties?: Readonly<Record<string, unknown>>;
  additionalProperties?: boolean;
}>;

export type JSONSchemaObject = MergeRecords<
  JSONSchema,
  {
    type: 'object';
    properties: Readonly<Record<string, unknown>>;
  }
>;

export type JSONSchemaObjectOutput<Schema extends JSONSchema> =
  // Remove undefined props and empty arrays
  OmitByValue<Schema, readonly [] | undefined>;
