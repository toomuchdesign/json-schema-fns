import type {
  CompactSchema,
  JSONSchemaObject,
  MergeRecords,
  OmitFromTuple,
  Simplify,
  SubPathsFor,
} from '../utils/types';

/**
 * Returns the subset of `Paths` that have no dot — i.e. the bare-key drops
 * that should remove a property (and any required entry for it) entirely.
 *
 * Distributes over the input union.
 *
 * @example
 * ```ts
 * BareKeyPath<'a' | 'b.x' | 'c'> // → 'a' | 'c'
 * ```
 */
export type BareKeyPath<Paths extends string> =
  Paths extends `${string}.${string}` ? never : Paths;

/**
 * Union-based core of `OmitPropsDeep`. Accepts `Paths` as a string union
 * (not a tuple) so all internal operations are distributive conditionals
 * with no tuple recursion.
 *
 * Three rules per property `Key`:
 * - **Drop whole** when a path is exactly `Key` ("whole wins"): the property
 *   is removed and any matching `required` entry is removed.
 * - **Recurse** when paths only target sub-paths of `Key`
 *   (`SubPathsFor<Paths, Key>` is non-`never`): the property is kept, but
 *   its sub-schema is recursively omitted from.
 * - **Untouched** when no path references `Key`.
 */
export type OmitPropsDeepWith<
  Schema extends JSONSchemaObject,
  Paths extends string,
> = CompactSchema<
  MergeRecords<
    Schema,
    {
      properties: Simplify<{
        [Key in keyof Schema['properties'] as Key extends Paths
          ? never
          : Key]: Key extends string
          ? SubPathsFor<Paths, Key> extends never
            ? Schema['properties'][Key]
            : Schema['properties'][Key] extends JSONSchemaObject
              ? OmitPropsDeepWith<
                  Schema['properties'][Key],
                  SubPathsFor<Paths, Key>
                >
              : Schema['properties'][Key]
          : Schema['properties'][Key];
      }>;
      required: Schema['required'] extends readonly string[]
        ? OmitFromTuple<Schema['required'], BareKeyPath<Paths>>
        : undefined;
    }
  >
>;
