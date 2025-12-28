import { useQuery } from "@tanstack/react-query";
import { getDetailFaq } from "@/api/example";
import { QUERY_KEY } from "@/commons/constants/query-key";

const useFaqQuery = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.FAQ.DETAIL, { id }],
        queryFn: () => getDetailFaq({ id }),
    });
};

export default useFaqQuery;
