import { getUsers } from "@/api/user";
import { TGetUsersParams } from "@/api/user/type";
import { useQuery } from "@/app/_hooks/request/use-query";

export const useUsersQuery = (params: TGetUsersParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
};
