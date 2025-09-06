export type JSONSchemaObject = {
  type: 'object';
  required?: readonly string[];
  properties: Record<string, unknown>;
  patternProperties?: Record<string, unknown>;
};

export type RequiredField<Fields extends readonly unknown[] | undefined> =
  Fields extends readonly [] ? undefined : Fields;
