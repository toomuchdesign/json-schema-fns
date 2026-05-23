/**
 * Assert that provided schema has type equal to "object"
 */
export function isJSONSchemaObjectType(schema: {
  type?: unknown;
}): asserts schema is { type: 'object' } {
  if (schema.type !== 'object') {
    throw new TypeError(
      'Schema is expected to have a "type" property set to "object"',
    );
  }

  if ('properties' in schema === false || !schema.properties) {
    throw new TypeError('Schema is expected to have a "properties" property');
  }
}
