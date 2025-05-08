import { useQuery } from "@tanstack/react-query";

import { getFaqs } from "@/api/example";
import { TFilterFaq } from "@/api/example/type";
import { QUERY_KEY } from "@/commons/constants/query-key";

const useGetFaqs = (params: TFilterFaq = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY.FAQ.LIST, params],
    queryFn: () => getFaqs(params),
  });
};

export default useGetFaqs;
