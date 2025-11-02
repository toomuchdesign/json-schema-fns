const arrayCombinators = ['allOf', 'anyOf', 'oneOf'] as const;
export type ArrayCombinators = (typeof arrayCombinators)[number];

/**
 * Return true is provided string is a JSON schema array combinator: `allOf`, `anyOf`, `oneOf`.
 * https://json-schema.org/understanding-json-schema/reference/combining
 */
export function isArrayCombinatorKeyword(key: string): key is ArrayCombinators {
  return arrayCombinators.includes(key as ArrayCombinators);
}
