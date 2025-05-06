import { deleteUser } from "@/api/user";
import { useMutation } from "@/app/_hooks/request/use-mutation";

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: deleteUser,
  });
};
