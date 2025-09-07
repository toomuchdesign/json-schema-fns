import type { ConditionalExcept, Simplify } from 'type-fest';

// https://github.com/ThomasAribart/json-schema-to-ts/blob/12767c1eab895159c01f5e6898d8e5e711ff9d1c/src/definitions/jsonSchema.ts
export type JSONSchemaObject = {
  type: 'object';
  required?: readonly string[];
  properties?: Readonly<Record<string, unknown>>;
  patternProperties?: Readonly<Record<string, unknown>>;
};

export type JSONSchemaObjectOutput<Schema> = Simplify<
  Readonly<
    // Remove undefined props and empty arrays
    ConditionalExcept<Schema, readonly [] | undefined>
  >
>;
