/**
 * Split a dot-notation rename map into bare single-segment renames vs.
 * nested multi-segment renames, the latter grouped by their first segment
 * ("head") with that segment stripped. Each rename keeps its target name.
 *
 * @example
 * groupRenamesByHead({ a: 'A', 'b.c': 'C', 'b.d': 'D', 'e.f.g': 'G' })
 * // => {
 * //   bare:   { a: 'A' },
 * //   nested: { b: { c: 'C', d: 'D' }, e: { 'f.g': 'G' } },
 * // }
 *
 * @internal
 */
export function groupRenamesByHead(renames: Readonly<Record<string, string>>): {
  bare: Record<string, string>;
  nested: Record<string, Record<string, string>>;
} {
  const bare: Record<string, string> = {};
  const nested: Record<string, Record<string, string>> = {};

  for (const [key, target] of Object.entries(renames)) {
    const dotIdx = key.indexOf('.');
    if (dotIdx === -1) {
      bare[key] = target;
    } else {
      const head = key.slice(0, dotIdx);
      const rest = key.slice(dotIdx + 1);
      if (!nested[head]) {
        nested[head] = {};
      }
      nested[head][rest] = target;
    }
  }

  return { bare, nested };
}
