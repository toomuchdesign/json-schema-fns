import Ajv, { type AnySchema } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);

/**
 * Asserts that `schema` is itself a valid JSON Schema under the Draft-07
 * meta-schema — the dialect declared in M1.1 of the v1 roadmap.
 *
 * Pair with the existing `toEqual` / `expectTypeOf` assertions to guarantee
 * every output of a public function is a real schema, not just structurally
 * equal to a fixture.
 */
export function assertValidSchema(schema: unknown): void {
  const valid = ajv.validateSchema(schema as AnySchema);
  if (!valid) {
    throw new Error(
      `Schema is not valid under the Draft-07 meta-schema:\n${ajv.errorsText(
        ajv.errors,
      )}`,
    );
  }
}
