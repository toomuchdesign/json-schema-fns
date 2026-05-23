import { isJSONSchemaObjectType } from './utils';
import type {
  CompactSchema,
  JSONSchemaObject,
  MergeRecords,
  Simplify,
} from './utils/types';

type RenameKey<Key, Renames> = Key extends keyof Renames
  ? Renames[Key] extends string
    ? Renames[Key]
    : Key
  : Key;

type RenameProperties<Properties, Renames> = {
  readonly [K in keyof Properties as RenameKey<K, Renames>]: Properties[K];
};

type RenameRequired<
  Tuple extends readonly string[] | undefined,
  Renames,
> = Tuple extends readonly string[]
  ? { readonly [I in keyof Tuple]: RenameKey<Tuple[I], Renames> }
  : readonly [];

type RenameProps<Schema extends JSONSchemaObject, Renames> = MergeRecords<
  Schema,
  {
    properties: Simplify<RenameProperties<Schema['properties'], Renames>>;
    required: RenameRequired<Schema['required'], Renames>;
  }
>;

type RenamesFor<Schema extends JSONSchemaObject> = Readonly<
  Partial<Record<keyof Schema['properties'] & string, string>>
>;

/**
 * Rename specific properties in an object JSON schema.
 * Source keys must exist in `schema.properties`; target keys are arbitrary strings.
 * Position in `required` is preserved.
 *
 * @example
 * ```ts
 * renameProps(schema, { id: 'userId', email: 'emailAddress' });
 * ```
 */
export function renameProps<
  const Schema extends JSONSchemaObject,
  const Renames extends RenamesFor<Schema>,
>(
  schema: Schema,
  renames: Renames,
): CompactSchema<RenameProps<Schema, Renames>> {
  isJSONSchemaObjectType(schema);

  const renamesMap = renames as Record<string, string | undefined>;
  const properties = Object.fromEntries(
    Object.entries(schema.properties).map(([key, value]) => [
      renamesMap[key] ?? key,
      value,
    ]),
  );
  const required = schema.required?.map((key) => renamesMap[key] ?? key) ?? [];

  // @ts-expect-error not relying on natural type flow
  return {
    ...schema,
    required: required.length > 0 ? required : undefined,
    properties,
  };
}

/**
 * Rename specific properties in an object JSON schema.
 * Wraps `renameProps` to support function piping.
 *
 * @example
 * ```ts
 * pipeWith(schema, pipeRenameProps({ id: 'userId' }));
 * ```
 */
export function pipeRenameProps<
  const Schema extends JSONSchemaObject,
  const Renames extends RenamesFor<Schema>,
>(
  renames: Renames,
): (schema: Schema) => CompactSchema<RenameProps<Schema, Renames>> {
  return (schema: Schema) => renameProps<Schema, Renames>(schema, renames);
}
