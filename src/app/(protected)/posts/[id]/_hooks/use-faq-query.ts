import { useQuery } from "@/app/_hooks/request/use-query";

import { getDetailFaq } from "@/api/posts";

export const FAQ_QUERY_KEY = "get-detail-faq";

const useFaqQuery = (id: string) => {
  return useQuery({
    queryKey: [FAQ_QUERY_KEY, { id }],
    queryFn: () => getDetailFaq({ id }),
  });
};

export default useFaqQuery;
