/**
 * Convert a tuple type to a union type
 */
export type TupleToUnion<ArrayType> = ArrayType extends readonly unknown[]
  ? ArrayType[number]
  : never;
