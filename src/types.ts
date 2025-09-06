import type { ConditionalExcept, Simplify } from 'type-fest';

export type JSONSchemaObject = {
  type: 'object';
  required?: readonly string[];
  properties: Record<string, unknown>;
  patternProperties?: Record<string, unknown>;
};

export type JSONSchemaObjectOutput<Schema> = Simplify<
  Readonly<
    // Remove undefined props and empty arrays
    ConditionalExcept<Schema, readonly [] | undefined>
  >
>;
