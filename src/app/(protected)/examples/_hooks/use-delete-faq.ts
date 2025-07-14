import { useMutation } from "@/app/_hooks/request/use-mutation";
import { deleteFaq } from "@/api/example";
import { QUERY_KEY } from "@/commons/constants/query-key";

const useDeleteFaq = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.FAQ.DELETE],
    mutationFn: deleteFaq,
    meta: { invalidatesQuery: [QUERY_KEY.FAQ.LIST] },
  });
};
export default useDeleteFaq;
