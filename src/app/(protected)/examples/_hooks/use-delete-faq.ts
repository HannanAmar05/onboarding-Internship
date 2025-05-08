import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { deleteFaq } from "@/api/example";
import { QUERY_KEY } from "@/commons/constants/query-key";

const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-faq-item"],
    mutationFn: deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FAQ.LIST],
      });
    },
  });
};
export default useDeleteFaq;
