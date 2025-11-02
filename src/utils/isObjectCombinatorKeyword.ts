const objectCombinators = ['not'] as const;
export type ObjectCombinators = (typeof objectCombinators)[number];

/**
 * Return true is provided string is a JSON schema object combinator: `not`.
 * https://json-schema.org/understanding-json-schema/reference/combining
 */
export function isObjectCombinatorKeyword(
  key: string,
): key is ObjectCombinators {
  return objectCombinators.includes(key as ObjectCombinators);
}
