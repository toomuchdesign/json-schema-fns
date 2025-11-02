import type { MergeRecords, Simplify } from './index';

export type JSONSchemaType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null';

// import type { JSONSchema } from 'json-schema-to-ts';
export type JSONSchema =
  | boolean
  | Readonly<{
      type?: JSONSchemaType;
      required?: readonly string[];
      properties?: Readonly<Record<string, unknown>>;
      patternProperties?: Readonly<Record<string, unknown>>;

      additionalProperties?: JSONSchema;
      unevaluatedProperties?: JSONSchema;

      // Combiners
      allOf?: readonly JSONSchema[];
      anyOf?: readonly JSONSchema[];
      oneOf?: readonly JSONSchema[];
      not?: JSONSchema;
    }>;

export type JSONSchemaObject = Simplify<
  MergeRecords<
    Exclude<JSONSchema, boolean>,
    {
      type: 'object';
      properties: Readonly<Record<string, unknown>>;
    }
  >
>;

export type StringTuple = readonly string[];
export type UnknownRecord = Record<string, unknown>;
export type UnknownArray = readonly unknown[];
