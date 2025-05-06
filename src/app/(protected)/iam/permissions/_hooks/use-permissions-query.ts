import { getPermissions } from "@/api/permission";
import { TGetPermissionsParams } from "@/api/permission/type";
import { useQuery } from "@/app/_hooks/request/use-query";

export const usePermissionsQuery = (params: TGetPermissionsParams) => {
  return useQuery({
    queryKey: ["Permissions", params],
    queryFn: () => getPermissions(params),
  });
};
