import { useState } from "react";
import { Button, ConfigProvider, Descriptions, Flex, message, Space, Tag, Typography } from "antd";
import { generatePath, useNavigate, useParams } from "react-router";
import { Page, Section } from "admiral";
import { DescriptionsProps } from "antd/lib";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { ROUTES } from "@/commons/constants/routes";
import { formatDate } from "@/utils/date-format";
import ModalAction from "@/app/_components/ui/modals/modal-action";

import useFaqQuery from "./_hooks/use-faq-query";
import useDeleteFaqMutation from "../_hooks/use-delete-faq-mutation";
import getFaqStatus from "../_utils/faq-tag";

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const detailQuery = useFaqQuery(id || "");
  const deleteMutation = useDeleteFaqMutation();
  const data = detailQuery.data;
  console.log(data, "dataaa");

  const breadcrumbs = [
    {
      label: "Post",
      path: ROUTES.post.list,
    },
    {
      label: `Detail Post Category : ${data?.data.category}`,
      path: generatePath(ROUTES.post.detail, { id: id || "" }),
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
      key: "valid_date",
      label: "Valid Until",
      children: (
        <Typography.Text strong>{formatDate(data?.data.valid_date) ?? "-"}</Typography.Text>
      ),
    },
    {
      key: "question",
      label: "Title",
      span: 24,
      children: <Typography.Text strong>{data?.data.title ?? "-"}</Typography.Text>,
    },
    {
      key: "answer",
      span: 24,
      label: "Description",
      children: <Typography.Text strong>{data?.data.body ?? "-"}</Typography.Text>,
    },
    {
      key: "contacts",
      label: "Contacts",
      span: 24,
      children: (
        <Flex vertical gap={8}>
          {data?.data.contacts && data.data.contacts.length > 0 ? (
            data.data.contacts.map((contact, index) => (
              <Space key={index}>
                <Tag color="blue">{contact.type}</Tag>
                <Typography.Text strong>{contact.phone_number}</Typography.Text>
              </Space>
            ))
          ) : (
            <Typography.Text type="secondary">No contacts available</Typography.Text>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Page
      title={`Detail Post Category : ${data?.data.category}`}
      breadcrumbs={breadcrumbs}
      noStyle
      goBack={() => navigate(ROUTES.post.list)}
      topActions={
        <Flex gap={8}>
          <Button
            loading={deleteMutation.isPending}
            onClick={() => setShowDeleteModal(true)}
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
              onClick={() => navigate(generatePath(ROUTES.post.update, { id }))}
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
        </Space>
      </Section>

      <ModalAction
        type="delete"
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onOk={async () => {
          await deleteMutation.mutateAsync({ id: id || "" });
          message.success("Post deleted successfully");
          setShowDeleteModal(false);
          navigate(ROUTES.post.list);
        }}
      />
    </Page>
  );
};

export default Component;
