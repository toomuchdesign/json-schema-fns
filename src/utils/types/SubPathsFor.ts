/**
 * Filters `Paths` to those starting with `${Key}.`, then strips that prefix,
 * returning the remainders as a union. Paths that are an exact `Key` or don't
 * start with `${Key}.` are omitted.
 *
 * Distributes over the input union, so no tuple recursion is needed.
 *
 * @example
 * ```ts
 * SubPathsFor<'a.x' | 'a.y.z' | 'b', 'a'> // → 'x' | 'y.z'
 * ```
 */
export type SubPathsFor<
  Paths extends string,
  Key extends string,
> = Paths extends `${Key}.${infer Rest}` ? Rest : never;
