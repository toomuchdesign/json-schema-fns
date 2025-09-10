/**
 * Assert that provided schema has type equal to "object"
 */
export function isJSONSchemaObjectType(schema: {
  type?: unknown;
}): asserts schema is { type: 'object' } {
  if (schema.type !== 'object') {
    throw new Error(
      'Schema is expected to have a "type" property set to "object"',
    );
  }
}
