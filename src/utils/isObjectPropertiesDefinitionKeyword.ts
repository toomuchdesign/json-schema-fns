const objectPropertyDefinition = ['properties', 'patternProperties'] as const;
export type ObjectPropertiesDefinitionKeyword =
  (typeof objectPropertyDefinition)[number];

/**
 * Return true is provided string is a JSON schema object properties definition: `properties`, `patternProperties`.
 * https://json-schema.org/understanding-json-schema/reference/object
 */
export function isObjectPropertiesDefinitionKeyword(
  key: string,
): key is ObjectPropertiesDefinitionKeyword {
  return objectPropertyDefinition.includes(
    key as ObjectPropertiesDefinitionKeyword,
  );
}
