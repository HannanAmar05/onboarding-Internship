import { lazy } from "react";
import { createLoaderFunction, createActionFunction } from "../handlers/loader-action";
import { ExtendedRouteObject, LoadingModule, PageModule } from "../types/route";
import { getRouteSegmentsFromFilePath } from "../utils/path";
import { mergeRoutes } from "../utils/route";
import { createRoute } from "./route";

/**
 * Determines the appropriate loading component for a route.
 */
function findMatchingLoadingComponent(
  filePath: string,
  loadingFiles: Record<string, () => Promise<unknown>>,
) {
  // Normalize helper to try both with and without leading './'
  const tryKeys = (key: string): (() => Promise<unknown>) | undefined => {
    if (loadingFiles[key]) return loadingFiles[key];
    const alt = key.startsWith("./") ? key.slice(2) : `./${key}`;
    if (loadingFiles[alt]) return loadingFiles[alt];
    // Fallback: find by suffix to survive prefix differences
    const suffixes = [key.replace(/^\.\//, ""), alt.replace(/^\.\//, "")];
    for (const k of Object.keys(loadingFiles)) {
      if (suffixes.some((s) => k.endsWith(s))) {
        return loadingFiles[k];
      }
    }
    return undefined;
  };

  // Local candidate (same directory as the page/layout)
  const localKey = filePath.replace(/(page|layout)\.tsx$/, "loading.tsx");
  const localMod = tryKeys(localKey);
  if (localMod) {
    return lazy(localMod as LoadingModule);
  }

  // Group-level candidates: for each '(group)' directory in the path,
  // check for './app/.../(group)/loading.tsx' from nearest to farthest
  const groupCandidates: string[] = [];
  const parts = filePath.split("/");
  for (let i = parts.length - 1; i >= 0; i--) {
    if (/^\([^/]+\)$/.test(parts[i])) {
      const prefix = parts.slice(0, i + 1).join("/");
      const candidate = `${prefix}/loading.tsx`;
      groupCandidates.push(candidate);
    }
  }
  for (const candidate of groupCandidates) {
    const mod = tryKeys(candidate);
    if (mod) {
      return lazy(mod as LoadingModule);
    }
  }

  // Global fallback
  const globalMod = tryKeys("./app/loading.tsx");
  return globalMod ? lazy(globalMod as LoadingModule) : undefined;
}

/**
 * Converts file-system based pages into React Router compatible routes.
 *
 * @param files - Object mapping file paths to their dynamic import functions
 * @param loadingFiles - Object mapping loading component paths to their import functions
 * @returns A complete route configuration object
 */
export function convertPagesToRoute(
  files: Record<string, () => Promise<unknown>>,
  loadingFiles: Record<string, () => Promise<unknown>> = {},
): ExtendedRouteObject {
  const routes: ExtendedRouteObject = { path: "/" };

  // Process each file to create routes
  Object.entries(files).forEach(([filePath, importer]) => {
    const segments = getRouteSegmentsFromFilePath(filePath);
    const page = lazy(importer as PageModule);
    const loadingComponent = findMatchingLoadingComponent(filePath, loadingFiles);

    const route = createRoute({
      PageComponent: page,
      LoadingComponent: loadingComponent,
      segments,
      loader: createLoaderFunction(importer),
      action: createActionFunction(importer),
    });

    mergeRoutes(routes, route);
  });

  return routes;
}
