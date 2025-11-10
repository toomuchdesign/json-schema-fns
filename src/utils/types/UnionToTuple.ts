import type { UnionToIntersection } from './';

type LastOfUnion<Union> =
  UnionToIntersection<
    Union extends any ? () => Union : never
  > extends () => infer R
    ? R
    : never;

type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Convert a union type into an unordered tuple type of its elements
 */
export type UnionToTuple<Union, Last = LastOfUnion<Union>> =
  IsNever<Union> extends false
    ? [...UnionToTuple<Exclude<Union, Last>>, Last]
    : [];
