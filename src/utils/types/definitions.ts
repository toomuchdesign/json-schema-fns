import type { MergeRecords, Simplify } from './index';

// https://github.com/ThomasAribart/json-schema-to-ts/blob/12767c1eab895159c01f5e6898d8e5e711ff9d1c/src/definitions/jsonSchema.ts
export type JSONSchema = Readonly<{
  type: string;
  required?: readonly string[];
  properties?: Readonly<Record<string, unknown>>;
  patternProperties?: Readonly<Record<string, unknown>>;
  additionalProperties?: boolean;
}>;

export type JSONSchemaObject = Simplify<
  MergeRecords<
    JSONSchema,
    {
      type: 'object';
      properties: Readonly<Record<string, unknown>>;
    }
  >
>;

export type StringTuple = readonly string[];
export type UnknownRecord = Record<string, unknown>;
export type UnknownArray = readonly unknown[];
