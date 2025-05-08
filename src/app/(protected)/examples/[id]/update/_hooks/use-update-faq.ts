import { updateFaq } from "@/api/example";
import { TFaqRequest } from "@/api/example/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useUpdateFaq = (id: string) => {
  return useMutation({
    mutationKey: ["update-faq", { id }],
    mutationFn: (req: TFaqRequest) => updateFaq({ id }, req),
  });
};

export default useUpdateFaq;
