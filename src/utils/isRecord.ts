export function isRecord(input: unknown): input is Record<string, unknown> {
  return (
    typeof input === 'object' && input !== null && input.constructor === Object
  );
}
