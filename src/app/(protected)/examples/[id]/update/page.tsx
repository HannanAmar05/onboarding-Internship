import { Page } from "admiral";
import { generatePath, useNavigate, useParams } from "react-router";
import { message } from "antd";

import { ROUTES } from "@/commons/constants/routes";
import { formatDate, formatStringToDate } from "@/utils/date-format";

import FormFaq from "../../_components/form";
import { TFAQFormData } from "../../_components/form/schema";
import useGetDetailFaq from "../_hooks/use-get-detail-examples";
import useUpdateFaq from "./_hooks/use-update-faq";

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateMutation = useUpdateFaq(id!);
  const detailQuery = useGetDetailFaq(id!);

  const breadcrumbs = [
    {
      label: "FAQs",
      path: ROUTES.faq.list,
    },
    {
      label: `Detail ${detailQuery.data?.data.category ?? ""}`,
      path: generatePath(ROUTES.faq.detail, { id }),
    },
    {
      label: "Update FAQ",
      path: "",
    },
  ];

  return (
    <Page
      title={`Update ${detailQuery.data?.data.category ?? ""}`}
      breadcrumbs={breadcrumbs}
      noStyle
      goBack={() => navigate(ROUTES.faq.list)}
    >
      <FormFaq
        key={detailQuery.data?.data.id}
        error={updateMutation.error}
        loading={updateMutation.isPending}
        editForm={true}
        formProps={{
          disabled: updateMutation.isPending || !detailQuery.data?.data,
          initialValues: {
            category: detailQuery.data?.data.category,
            question: detailQuery.data?.data.question,
            answer: detailQuery.data?.data.answer,
            status: detailQuery.data?.data.status === "active",
            valid_date: formatStringToDate(detailQuery.data?.data.valid_date),
          },
          onFinish: (data: TFAQFormData) => {
            updateMutation.mutate(
              {
                ...data,
                valid_date: formatDate(data.valid_date)!,
                status: data.status ? "active" : "hide",
              },
              {
                onSuccess: () => {
                  message.success("FAQ updated successfully");
                  navigate(ROUTES.faq.list);
                },
              },
            );
          },
        }}
      />
    </Page>
  );
};

export default Component;
