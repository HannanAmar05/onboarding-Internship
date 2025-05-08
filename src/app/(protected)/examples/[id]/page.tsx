import { Button, ConfigProvider, Descriptions, Flex, message, Space, Tag, Typography } from "antd";
import { generatePath, useNavigate, useParams } from "react-router";
import { Page, Section } from "admiral";
import { DescriptionsProps } from "antd/lib";
import dayjs from "dayjs";

import { ROUTES } from "@/commons/constants/routes";

import useGetDetailFaq from "./_hooks/use-get-detail-examples";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import useDeleteFaq from "../_hooks/use-delete-faq";
import getFaqStatus from "../_utils/faq-tag";

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const detailQuery = useGetDetailFaq(id!);
  const deleteMutation = useDeleteFaq();
  const data = detailQuery.data;

  const breadcrumbs = [
    {
      label: "Faqs",
      path: ROUTES.faq.list,
    },
    {
      label: `Detail ${data?.data.category}`,
      path: generatePath(ROUTES.faq.detail, { id: id! }),
    },
  ];

  const { label, color } = getFaqStatus(data?.data.status);

  const items: DescriptionsProps["items"] = [
    {
      key: "category",
      label: "Category",
      children: <Typography.Text strong>{data?.data.category ?? "-"}</Typography.Text>,
    },

    {
      key: "status",
      label: "Status",
      children: <Tag color={color}>{label}</Tag>,
    },
    {
      key: "question",
      label: "Question",
      span: 24,
      children: <Typography.Text strong>{data?.data.question ?? "-"}</Typography.Text>,
    },
    {
      key: "answer",
      span: 24,
      label: "Answer",
      children: <Typography.Text strong>{data?.data.answer ?? "-"}</Typography.Text>,
    },
  ];

  return (
    <Page
      title={`Detail : ${data?.data.category}`}
      breadcrumbs={breadcrumbs}
      noStyle
      goBack={() => navigate(ROUTES.faq.list)}
      topActions={
        <Flex gap={8}>
          <Button
            loading={deleteMutation.isPending}
            onClick={() => {
              deleteMutation.mutate(
                { id: id! },
                {
                  onSuccess: () => {
                    message.success("Faq berhasil dihapus");
                    navigate(-1);
                  },
                },
              );
            }}
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
          <ConfigProvider
            theme={{
              token: {
                colorError: "#003EB3",
              },
            }}
          >
            <Button
              onClick={() => navigate(generatePath(ROUTES.faq.update, { id }))}
              danger
              icon={<EditOutlined />}
            >
              Edit
            </Button>
          </ConfigProvider>
        </Flex>
      }
    >
      <Section loading={detailQuery.isLoading}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Section title="General Information">
            <Descriptions
              bordered
              layout="horizontal"
              items={items}
              labelStyle={{
                width: "20%",
                textAlign: "left",
              }}
              contentStyle={{
                width: "30%",
              }}
              column={{
                md: 1,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
            />
          </Section>
          <Section title="Detail Information">
            <Descriptions
              bordered
              layout="horizontal"
              items={[
                {
                  key: "creted",
                  label: "Created At",
                  children: (
                    <Typography.Text strong>
                      {data?.data.created_at
                        ? dayjs(data.data.created_at).format("DD/MM/YYYY")
                        : "-"}
                    </Typography.Text>
                  ),
                },
                {
                  key: "updated",
                  label: "Updated At",
                  children: (
                    <Typography.Text strong>
                      {data?.data.updated_at
                        ? dayjs(data.data.updated_at).format("DD/MM/YYYY")
                        : "-"}
                    </Typography.Text>
                  ),
                },
              ]}
              labelStyle={{
                width: "20%",
                textAlign: "left",
              }}
              contentStyle={{
                width: "30%",
              }}
              column={{
                md: 1,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
            />
          </Section>
        </Space>
      </Section>
    </Page>
  );
};

export default Component;
