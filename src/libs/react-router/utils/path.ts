import { PATH_SEPARATOR } from "../types/route";

/**
 * Processes a file path to generate route segments, handling various routing patterns.
 *
 * @param filePath - The file path to process
 * @param transformer - Optional function to transform segment names
 * @returns Array of processed route segments
 */
export function getRouteSegmentsFromFilePath(
  filePath: string,
  transformer?: (segment: string, prevSegment: string) => string,
): string[] {
  const defaultTransformer = (segment: string, prevSegment: string): string =>
    `${prevSegment}${PATH_SEPARATOR}${segment.split(".")[0]}`;

  const actualTransformer = transformer || defaultTransformer;

  const segments = filePath
    .replace("/app", "")
    .split("/")
    .filter((segment) => !segment.startsWith("(index)") && !segment.startsWith("_"))
    .map((segment) => parseSegment(segment));

  // Normalize segments: if an optional group (e.g., "create?") is followed by the
  // same concrete segment (e.g., "create"), drop the optional one so the path
  // becomes "/.../create" instead of "/.../create?/create".
  const normalizedSegments: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    const current = segments[i];
    const next = segments[i + 1];

    const currentBase = current?.replace(/\?$/, "");
    const nextBase = next?.replace(/\?$/, "");

    if (current?.endsWith("?") && next && currentBase === nextBase) {
      continue; // skip optional duplicate
    }

    normalizedSegments.push(current);
  }

  return buildSegmentPath(normalizedSegments[0], normalizedSegments, actualTransformer);
}

/**
 * Parse a file path segment and convert it to a route path segment
 */
function parseSegment(segment: string): string {
  if (segment.startsWith(".")) return "/";
  if (segment.startsWith("(")) return segment.replace(/[()]/g, "") + "?";
  if (segment.startsWith("[...")) return "*";
  if (segment.startsWith("[")) return segment.replace("[", ":").replace("]", "");
  return segment;
}

/**
 * Builds segment path using a transformer function.
 */
export function buildSegmentPath(
  firstSegment: string,
  segments: string[],
  transformer: (seg: string, prev: string) => string,
  entries: string[] = [],
  index = 0,
): string[] {
  if (index >= segments.length) {
    return entries;
  }

  const segment = segments[index];
  const isLastSegment = index === segments.length - 1;

  if (isLastSegment) {
    const lastEntry = entries.pop() || "";
    entries.push(transformer(segment, lastEntry));
    return entries;
  }

  const nextIndex = index + 1;

  if (!segment.startsWith(":")) {
    entries.push(segment);
  } else {
    const lastEntry = entries.pop() || "";
    entries.push(`${lastEntry}/${segment}`);
  }

  return buildSegmentPath(firstSegment, segments, transformer, entries, nextIndex);
}

/**
 * Checks if a route is a dynamic parameter route.
 */
export function isDynamicRoute(path: string): boolean {
  return path.startsWith(":");
}
