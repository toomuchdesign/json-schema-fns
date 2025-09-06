// https://github.com/sindresorhus/type-fest/blob/e790c3f166dd95a253ca442b533bf9f9d8ccbe45/source/simplify.d.ts#L58C1-L58C67
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

export type JSONSchemaObject = {
  type: 'object';
  properties: Record<string, unknown>;
  required?: readonly string[];
};
