import { createFaq } from "@/api/example";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useCreateFaq = () => {
  return useMutation({
    mutationKey: ["create-faq"],
    mutationFn: createFaq,
  });
};

export default useCreateFaq;
