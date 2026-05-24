import type { DeepPaths } from '../pickPropsDeep/types';
import type { RenameProps } from '../renameProps';
import type {
  CompactSchema,
  JSONSchemaObject,
  MergeRecords,
  Simplify,
} from '../utils/types';

/**
 * A deep rename map keyed by valid dot-notation paths into `Schema`. Values are
 * bare target names — renames don't move properties between levels.
 *
 * @internal
 */
export type DeepRenamesFor<Schema extends JSONSchemaObject> = Readonly<
  Partial<Record<DeepPaths<Schema>, string>>
>;

/**
 * Subset of `Renames` whose keys contain no dot — the renames that apply at
 * the current recursion level.
 *
 * @example
 * ```ts
 * BareRenamesOf<{ a: 'A'; 'b.x': 'X' }> // → { a: 'A' }
 * ```
 *
 * @internal
 */
export type BareRenamesOf<Renames> = {
  readonly [K in keyof Renames as K extends `${string}.${string}`
    ? never
    : K]: Renames[K];
};

/**
 * Subset of `Renames` whose keys start with `${Key}.`, with the prefix stripped.
 * Drives recursion into the child schema at `Key`.
 *
 * @example
 * ```ts
 * SubRenamesFor<{ 'a.x': 'X'; 'a.y.z': 'Z'; b: 'B' }, 'a'>
 * // → { x: 'X'; 'y.z': 'Z' }
 * ```
 *
 * @internal
 */
export type SubRenamesFor<Renames, Key extends string> = {
  readonly [K in keyof Renames as K extends `${Key}.${infer Rest}`
    ? Rest
    : never]: Renames[K];
};

/**
 * Recursive core of `RenamePropsDeep`.
 *
 * For each property `Key`:
 * - if no rename targets a child of `Key`, the sub-schema is untouched;
 * - otherwise the sub-schema is recursively rewritten with `SubRenamesFor`.
 *
 * The level's bare-key renames are then applied via the shallow `RenameProps`,
 * which already handles `properties` key rewriting and `required` rewriting.
 *
 * @internal
 */
export type RenamePropsDeepWith<
  Schema extends JSONSchemaObject,
  Renames,
> = CompactSchema<
  RenameProps<
    MergeRecords<
      Schema,
      {
        properties: Simplify<{
          readonly [Key in keyof Schema['properties']]: Key extends string
            ? keyof SubRenamesFor<Renames, Key> extends never
              ? Schema['properties'][Key]
              : Schema['properties'][Key] extends JSONSchemaObject
                ? RenamePropsDeepWith<
                    Schema['properties'][Key],
                    SubRenamesFor<Renames, Key>
                  >
                : Schema['properties'][Key]
            : Schema['properties'][Key];
        }>;
      }
    >,
    BareRenamesOf<Renames>
  >
>;
