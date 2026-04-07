import { useState } from "react";
import { Button, Checkbox, Col, Flex, message, Popover, Row, Tag, Typography } from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { DataTable, Page } from "admiral";
import { generatePath, Link } from "react-router";

import { makeSource } from "@/utils/data-table";
import { TFaq } from "@/api/posts/type";
import { ROUTES } from "@/commons/constants/routes";
import { useFilter } from "@/app/_hooks/datatable/use-filter";
import ModalAction from "@/app/_components/ui/modals/modal-action";

import useFaqsQuery from "./_hooks/use-faqs-query";
import useDeleteFaqMutation from "./_hooks/use-delete-faq-mutation";
import getFaqStatus from "./_utils/faq-tag";

export const Component = () => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { handleChange, pagination, filters } = useFilter();

  const faqsQuery = useFaqsQuery({
    ...pagination,
    ...filters,
  });

  const deleteMutation = useDeleteFaqMutation();

  const columns: ColumnsType<TFaq> = [
    {
      dataIndex: "category",
      key: "category",
      title: "Category",
      sorter: true,
    },
    {
      dataIndex: "question",
      key: "question",
      title: "Title",
      sorter: true,
      render: (_, record) => {
        return (
          <Typography.Link underline>
            <Link
              to={generatePath(ROUTES.post.detail, {
                id: record.id,
              })}
            >
              {record.title}
            </Link>
          </Typography.Link>
        );
      },
    },
    {
      dataIndex: "answer",
      key: "answer",
      title: "Description",
      ellipsis: true,
      sorter: true,
      render: (_, render) => {
        return <Typography.Text ellipsis>{render.body}</Typography.Text>;
      }
    },
    {
      dataIndex: "contacts",
      align: "center",
      key: "contacts",
      title: "Contacts",
      render: (_, record) => {
        const count = record.contacts?.length || 0;
        if (count === 0) return <Tag>No Contact</Tag>;
        return (
          <Popover
            title="Contact Details"
            content={
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {record.contacts?.map((c, i) => (
                  <li key={i}>
                    <span style={{ color: "#888" }}>{c.type}:</span> {c.phone_number}
                  </li>
                ))}
              </ul>
            }
          >
            <Tag color="cyan" style={{ cursor: "help" }}>
              {count} Numbers
            </Tag>
          </Popover>
        );
      },
    },
    {
      key: "status",
      title: "Status",
      sorter: true,
      align: "center",
      render: (_, record) => {
        const { label, color } = getFaqStatus(record.status);
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      dataIndex: "Action",
      title: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Flex>
            <Link
              to={generatePath(ROUTES.post.detail, {
                id: record.id,
              })}
            >
              <Button type="link" icon={<EyeOutlined style={{ color: "green" }} />} />
            </Link>
            <Button
              type="link"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              onClick={() => setDeleteId(record.id)}
            />
            <Link
              to={generatePath(ROUTES.post.update, {
                id: record.id,
              })}
            >
              <Button type="link" icon={<EditOutlined />} />
            </Link>
          </Flex>
        );
      },
    },
  ];

  const breadcrumbs = [
    {
      label: "Posts",
      path: ROUTES.post.list,
    },
  ];

  return (
    <Page title="Post Data" breadcrumbs={breadcrumbs} topActions={<TopAction />} noStyle>
      <DataTable
        filterComponents={[
          {
            label: "filter",
            name: "filter",
            type: "Group",
            icon: <FilterOutlined />,
            cols: 2,
            filters: [
              {
                label: "Category",
                name: "category",
                type: "Select",
                placeholder: "Filter Category",
                value: filters.category,
                options: [
                  {
                    label: "General",
                    value: "general",
                  },
                  {
                    label: "Account",
                    value: "account",
                  },
                  {
                    label: "Specific",
                    value: "specific",
                  },
                ],
              },
              {
                label: "Custom Range",
                name: "custom_range",
                type: "DateRangePicker",
                value: [filters.start_date, filters.end_date],
              },
              {
                label: "",
                name: "statuses",
                defaultValue: filters?.group?.statuses,
                span: 2,
                render: ({ value = [], onChange }) => {
                  const statuses = [
                    {
                      label: "Active",
                      value: "active",
                    },
                    {
                      label: "Inactive",
                      value: "inactive",
                    },
                    {
                      label: "Pending",
                      value: "pending",
                    },
                  ];
                  return (
                    <Checkbox.Group
                      name="statuses"
                      style={{ width: "100%" }}
                      defaultValue={value}
                      onChange={(checkedValues) => {
                        onChange(checkedValues);
                      }}
                    >
                      <Row gutter={[10, 10]}>
                        {statuses.map((item) => (
                          <Col key={item.value} xs={24} sm={12} md={12}>
                            <Checkbox value={item.value}>{item.label}</Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  );
                },
              },
            ],
          },
          {
            label: "Sort",
            title: "Sort",
            name: "sort",
            type: "Group",
            cols: 2,
            filters: [
              {
                label: "Sort by",
                name: "sort_by",
                type: "Select",
                placeholder: "Select",
                value: filters.sort_by,
                options: [
                  {
                    label: "Category",
                    value: "category",
                  },
                ],
              },
              {
                label: "Sort by",
                name: "sort_by",
                type: "Select",
                placeholder: "Select",
                value: filters.sort_by,
                options: [
                  {
                    label: "A-Z",
                    value: "asc",
                  },
                  {
                    label: "Z-A",
                    value: "desc",
                  },
                ],
              },
            ],
          },
        ]}
        batchActionMenus={[
          {
            key: "delete",
            label: "Delete",
            onClick: (_values, cb) => {
              message.success("Deleted successfully");
              cb.reset();
            },
            danger: true,
            icon: <DeleteOutlined />,
          },
          {
            key: "download",
            label: "Download",
            onClick: (_values, cb) => {
              message.success("Downloaded successfully");
              cb.reset();
            },
            icon: <DownloadOutlined />,
          },
        ]}
        onChange={handleChange}
        rowKey="id"
        showRowSelection={true}
        loading={faqsQuery.isLoading}
        source={makeSource(faqsQuery.data)}
        columns={columns}
        search={filters.search}
      />

      <ModalAction
        type="delete"
        title="Delete Post"
        description="Are you sure you want to delete this Post? This action cannot be undone."
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onOk={async () => {
          if (!deleteId) return;
          await deleteMutation.mutateAsync({ id: deleteId });
          message.success("Post deleted successfully");
          setDeleteId(null);
        }}
      />
    </Page>
  );
};

const TopAction = () => (
  <Link to={ROUTES.post.create}>
    <Button icon={<PlusCircleOutlined />}>Add Faq</Button>
  </Link>
);

export default Component;
