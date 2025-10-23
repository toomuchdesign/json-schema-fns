import type { UnknownRecord } from './definitions';

/**
 * Merge two Records into a new type. Keys of the second type overrides keys of the first type
 */
export type MergeRecords<
  Destination extends UnknownRecord,
  Source extends UnknownRecord,
> = Omit<Destination, keyof Source> & Source;
