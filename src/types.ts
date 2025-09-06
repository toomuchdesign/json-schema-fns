import type { Simplify, ConditionalExcept } from 'type-fest';

export type JSONSchemaObject = {
  type: 'object';
  required?: readonly string[];
  properties: Record<string, unknown>;
  patternProperties?: Record<string, unknown>;
};

export type RequiredField<Fields extends readonly unknown[] | undefined> =
  Fields extends readonly [] ? undefined : Fields;

export type JSONSchemaObjectOutput<Schema> = Simplify<
  Readonly<
    // Remove undefined props
    ConditionalExcept<Schema, undefined>
  >
>;
