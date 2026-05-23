/**
 * Split dot-notation paths into bare single-segment paths vs. nested
 * multi-segment paths, the latter grouped by their first segment ("head")
 * with that segment stripped.
 *
 * @example
 * groupPathsByHead(['a', 'b.c', 'b.d', 'e.f.g'])
 * // => { bare: Set('a'), nested: { b: ['c', 'd'], e: ['f.g'] } }
 */
export function groupPathsByHead(paths: readonly string[]): {
  bare: Set<string>;
  nested: Record<string, string[]>;
} {
  const bare = new Set<string>();
  const nested: Record<string, string[]> = {};

  for (const path of paths) {
    const dotIdx = path.indexOf('.');
    if (dotIdx === -1) {
      bare.add(path);
    } else {
      const head = path.slice(0, dotIdx);
      const rest = path.slice(dotIdx + 1);
      if (!nested[head]) {
        nested[head] = [];
      }
      nested[head].push(rest);
    }
  }

  return { bare, nested };
}
