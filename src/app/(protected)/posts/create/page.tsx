import { Page } from "admiral";
import { useNavigate } from "react-router";
import { message } from "antd";

import { ROUTES } from "@/commons/constants/routes";

import FormFaq from "../_components/form";
import useCreateFaq from "./_hooks/use-create-faq";
import { TFAQFormData } from "../_components/form/schema";
import { formatDate } from "@/utils/date-format";

export const Component = () => {
  const navigate = useNavigate();
  const createMutation = useCreateFaq();

  const breadcrumbs = [
    {
      label: "Post",
      path: ROUTES.post.list,
    },
    {
      label: "Create Post",
      path: "",
    },
  ];

  return (
    <Page
      title="Create Post"
      breadcrumbs={breadcrumbs}
      noStyle
      goBack={() => navigate(ROUTES.post.list)}
    >
      <FormFaq
        error={createMutation.error}
        loading={createMutation.isPending}
        editForm={false}
        formProps={{
          onFinish: (data: TFAQFormData) => {
            const validDate = formatDate(data.valid_date) ?? "";
            console.log({ ...data, valid_date: validDate }, "Data to submit"); // Debug: Cek data yang akan dikirim ke API
            createMutation.mutate(
              {
                ...data,
                valid_date: validDate,
                status: data.status ? "active" : "hide",
                contacts: data.contacts
              },
              {
                onSuccess: () => {
                  message.success("Post created successfully");
                  navigate(ROUTES.post.list);
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
