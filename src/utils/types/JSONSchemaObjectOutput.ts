import type { OmitByValue } from './index';

/**
 * Remove undefined props and empty arrays and
 * simplifies the resulting type as a side-effect
 */
export type JSONSchemaObjectOutput<Schema extends Record<string, unknown>> =
  OmitByValue<Schema, readonly [] | undefined>;
