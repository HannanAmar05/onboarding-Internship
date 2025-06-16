import { Button, Checkbox, Col, Flex, message, Row, Tag, Typography } from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Page } from "admiral";
import Datatable from "admiral/table/datatable/index";
import { generatePath, Link } from "react-router";

import { makeSource } from "@/utils/data-table";
import { TFaq } from "@/api/example/type";
import { ROUTES } from "@/commons/constants/routes";
import { useFilter } from "@/app/_hooks/datatable/use-filter";

import useGetFaqs from "./_hooks/use-get-faqs";
import useDeleteFaq from "./_hooks/use-delete-faq";
import getFaqStatus from "./_utils/faq-tag";

export const Component = () => {
  const { handleChange, pagination, filters } = useFilter();

  const listQuery = useGetFaqs({
    ...pagination,
    ...filters,
  });

  const deleteMutation = useDeleteFaq();

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
      title: "Question",
      sorter: true,
      render: (_, record) => {
        return (
          <Typography.Link underline>
            <Link
              to={generatePath(ROUTES.faq.detail, {
                id: record.id,
              })}
            >
              {record.question}
            </Link>
          </Typography.Link>
        );
      },
    },
    {
      dataIndex: "answer",
      key: "answer",
      title: "Answer",
      ellipsis: true,
      sorter: true,
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
              to={generatePath(ROUTES.faq.detail, {
                id: record.id,
              })}
            >
              <Button type="link" icon={<EyeOutlined style={{ color: "green" }} />} />
            </Link>
            <Button
              type="link"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              onClick={() => {
                deleteMutation.mutate(
                  { id: record.id },
                  {
                    onSuccess: () => {
                      message.success("Faq berhasil dihapus");
                    },
                  },
                );
              }}
            />
            <Link
              to={generatePath(ROUTES.faq.update, {
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
      label: "FAQs",
      path: ROUTES.faq.list,
    },
  ];

  return (
    <Page title="FAQs" breadcrumbs={breadcrumbs} topActions={<TopAction />} noStyle>
      <Datatable
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
              message.success("Role berhasil dihapus");
              cb.reset();
            },
            danger: true,
            icon: <DeleteOutlined />,
          },
          {
            key: "download",
            label: "Download",
            onClick: (_values, cb) => {
              message.success("Role berhasil didownload");
              cb.reset();
            },
            icon: <DownloadOutlined />,
          },
        ]}
        onChange={handleChange}
        rowKey="id"
        showRowSelection={true}
        loading={listQuery.isLoading}
        source={makeSource(listQuery.data)}
        columns={columns}
        search={filters.search}
      />
    </Page>
  );
};

const TopAction = () => (
  <Link to={ROUTES.faq.create}>
    <Button icon={<PlusCircleOutlined />}>Add Faq</Button>
  </Link>
);

export default Component;
