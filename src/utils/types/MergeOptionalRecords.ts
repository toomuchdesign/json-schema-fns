import type { MergeRecords } from './MergeRecords';
import type { UnknownRecord } from './definitions';

/**
 * Merge two optional records, keeping `undefined` if both are undefined
 */
export type MergeOptionalRecords<
  A extends UnknownRecord | undefined,
  B extends UnknownRecord | undefined,
> = A extends UnknownRecord
  ? B extends UnknownRecord
    ? MergeRecords<A, B>
    : A
  : B extends UnknownRecord
    ? B
    : undefined;
