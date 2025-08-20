import { ROUTES } from "./commons/constants/routes";
import { PERMISSIONS } from "./commons/constants/permissions";
import { registerMiddleware } from "./libs/react-router";
import { SessionUser } from "./libs/localstorage";
import { filterPermission } from "./utils/permission";

const mappingRoutePermissions = [
  { path: ROUTES.dashboard },
  { path: ROUTES.iam.users.list, permissions: [PERMISSIONS.USERS.READ_USERS] },
];

const mappingPublicRoutes = [ROUTES.auth.login, ROUTES.auth.callback];

registerMiddleware({
  matcher: "^/$",
  handler: () => {
    const session = SessionUser.get();
    if (session) {
      return { redirect: ROUTES.dashboard };
    }
    return { redirect: ROUTES.auth.login };
  },
});

registerMiddleware({
  matcher: ".*",
  handler: (request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const session = SessionUser.get();

    const isPublicRoute = mappingPublicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (!isPublicRoute && !session) {
      const redirectTo = `${ROUTES.auth.login}?redirect=${encodeURIComponent(pathname)}`;
      return { redirect: redirectTo };
    }

    if (isPublicRoute && session) {
      return { redirect: ROUTES.dashboard };
    }

    if (session) {
      const userPermissions: string[] =
        session?.user?.roles
          ?.map((role) => role.permissions.map((perm: { name: string }) => perm.name))
          ?.flat() || [];

      const rulesForPath = mappingRoutePermissions.filter((rule) => rule.path === pathname);
      const allowedRules = filterPermission(rulesForPath, (rule) => {
        if (!rule.permissions || rule.permissions.length === 0) return true;
        return rule.permissions.some((perm) => userPermissions.includes(perm));
      });

      if (rulesForPath.length > 0 && allowedRules.length === 0) {
        return { redirect: ROUTES.dashboard };
      }
    }

    return;
  },
});
