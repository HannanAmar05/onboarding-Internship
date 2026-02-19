# Module Page Templates

**IMPORTANT NOTES:**
- For **Management Reports** modules, use `MR` prefix in route enum names (e.g., `MREntityDistricts`, `MRPeriodActuals`)
- Use `ModalAction` component for delete confirmations (both list and detail pages)
- Export query keys as constants from query hooks
- All labels, placeholders, and messages in **English**

## 1. List Page Template (`page.tsx`)

```typescript
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { DataTable } from "admiral";
import { Button, Flex, Tag, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { Link } from "react-router";

import { Route, route } from "@/commons/route";
import Page from "@/components/layouts/main/page";
import { T[Module] } from "@/modules/[group]/[module]/type";
import { useFilter } from "@/utils/filter-v2";
import { makeSource } from "@/utils/utils";

import ModalAction from "@/app/(authenticated)/_components/modal";
import { useDelete[Module] } from "./_hooks/use-delete-[module]";
import { useGet[Module]s } from "./_hooks/use-get-[module]s";

const Component = () => {
  const { handleChange, pagination, filters } = useFilter();
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const listQuery = useGet[Module]s({
    ...pagination,
    ...filters,
  });

  const deleteMutation = useDelete[Module]();

  const columns: ColumnsType<T[Module]> = [
    {
      dataIndex: "name", // Adjust based on actual field
      key: "name",
      title: "Name",
      sorter: true,
      render: (_, record) => {
        return <Typography.Text>{record.name}</Typography.Text>;
      },
    },
    // Add more columns as needed
    {
      dataIndex: "row_status",
      key: "row_status",
      title: "Status",
      sorter: true,
      align: "center",
      render: (row_status) => {
        const color = row_status === 1 ? "green" : "red";
        const label = row_status === 1 ? "Active" : "Inactive";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      dataIndex: "Action",
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Flex>
            <Tooltip title="Edit">
              <Link
                to={route(Route.[Module]Edit, {
                  id: record.id,
                })}
              >
                <Button type="link" icon={<EditOutlined />} data-testid={`edit-btn-${record.id}`} />
              </Link>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                icon={<DeleteOutlined style={{ color: "red" }} />}
                onClick={() => {
                  setOpenModal(true);
                  setSelectedId(record.id);
                }}
                data-testid={`delete-btn-${record.id}`}
              />
            </Tooltip>
          </Flex>
        );
      },
    },
  ];

  const breadcrumbs = [
    {
      label: "[Parent Label]",
      path: "",
    },
    {
      label: "[Module]s",
      path: Route.[Module],
    },
  ];

  return (
    <Page
      title="[Module]s"
      breadcrumbs={breadcrumbs}
      topActions={
        <Link to={Route.[Module]Create}>
          <Button type="primary" icon={<PlusOutlined />} data-testid="create-btn">
            [Module]
          </Button>
        </Link>
      }
      noStyle
    >
      <DataTable
        filterComponents={[
          {
            label: "Status",
            name: "row_status",
            type: "Select",
            placeholder: "Select Status",
            value: filters.row_status,
            options: [
              { label: "Active", value: 1 },
              { label: "Inactive", value: 0 },
            ],
          },
        ]}
        onChange={handleChange}
        rowKey="id"
        showRowSelection={false}
        loading={listQuery.isLoading}
        source={makeSource(listQuery.data)}
        columns={columns}
        search={filters.search}
        data-testid="[module]-table"
      />
      <ModalAction
        type="delete"
        open={openModal}
        onOk={() => {
          if (selectedId) {
            deleteMutation.mutate(
              { id: selectedId },
              {
                onSuccess: () => {
                  setOpenModal(false);
                  setSelectedId(null);
                },
              },
            );
          }
        }}
        onCancel={() => {
          setOpenModal(false);
          setSelectedId(null);
        }}
        cancelButtonProps={{
          disabled: deleteMutation.isPending,
        }}
        okButtonProps={{
          loading: deleteMutation.isPending,
        }}
        okType="primary"
        description="Are you sure you want to delete this data?"
        title="Delete Data"
        data-testid="delete-modal"
      />
    </Page>
  );
};
export default Component;
```

## 2. Create Page Template (`create/page.tsx`)

```typescript
import { useRouter } from "@/app/_hooks/router/use-router";
import Page from "@/components/layouts/main/page";

import { Route } from "@/commons/route";

import Form[Module] from "../_components/form";
import { T[Module]FormData } from "../_components/form/schema";
import { useCreate[Module]Mutation } from "./_hooks/use-create-[module]-mutation";

const Component = () => {
  const router = useRouter();
  const createMutation = useCreate[Module]Mutation();

  const breadcrumbs = [
    {
      label: "[Parent Label]",
      path: "",
    },
    {
      label: "[Module]s",
      path: Route.[Module],
    },
    {
      label: "Create [Module]",
      path: "",
    },
  ];

  return (
    <Page
      title="Create [Module]"
      breadcrumbs={breadcrumbs}
      noStyle
      goBack={() => {
        router.push(Route.[Module]);
      }}
    >
      <Form[Module]
        error={createMutation.error?.response?.data}
        loading={createMutation.isPending}
        editForm={false}
        formProps={{
          onFinish: (data: T[Module]FormData) => {
            createMutation.mutate(
              {
                ...data,
                // Add data transformation if needed (e.g., boolean to number)
              },
              {
                onSuccess: () => {
                  router.push(Route.[Module]);
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
```

## 3. Detail Page Template (`[id]/page.tsx`)

```typescript
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Page, Section } from "admiral";
import { Button, Descriptions, Flex, Tag, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router";
import { useParams } from "react-router";

import { Route, route } from "@/commons/route";

import ModalAction from "@/app/(authenticated)/_components/modal";
import { useDelete[Module] } from "../_hooks/use-delete-[module]";
import { useGetDetail[Module] } from "./_hooks/use-get-detail-[module]";

const Component = () => {
  const { id } = useParams<{ id: string }>();
  const detailQuery = useGetDetail[Module](id!);
  const deleteMutation = useDelete[Module]();
  const [openModal, setOpenModal] = useState(false);

  const handleDelete = () => {
    setOpenModal(true);
  };

  const breadcrumbs = [
    {
      label: "[Parent Label]",
      path: "",
    },
    {
      label: "[Module]s",
      path: Route.[Module],
    },
    {
      label: detailQuery.data?.data.name || "",
      path: "#",
    },
  ];

  const items = [
    {
      key: "name",
      label: "Name",
      children: <Typography.Text strong>{detailQuery.data?.data.name ?? "-"}</Typography.Text>,
    },
    {
      key: "row_status",
      label: "Status",
      children: (
        <Typography.Text strong>
          {detailQuery.data?.data.row_status === 1 ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          )}
        </Typography.Text>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      children: (
        <Typography.Text strong>
          {detailQuery.data?.data.created_at
            ? new Date(detailQuery.data.data.created_at).toLocaleString("en-US")
            : "-"}
        </Typography.Text>
      ),
    },
    {
      key: "updated_at",
      label: "Updated At",
      children: (
        <Typography.Text strong>
          {detailQuery.data?.data.updated_at
            ? new Date(detailQuery.data.data.updated_at).toLocaleString("en-US")
            : "-"}
        </Typography.Text>
      ),
    },
    // Add more fields
  ];

  return (
    <Page
      topActions={
        <Flex gap={10}>
          <Button
            htmlType="button"
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            danger
            data-testid="delete-btn"
          >
            Delete
          </Button>
          <Link
            to={route(Route.[Module]Edit, {
              id: id!,
            })}
          >
            <Button htmlType="button" type="primary" icon={<EditOutlined />} data-testid="edit-btn">
              Edit
            </Button>
          </Link>
        </Flex>
      }
      title={`Detail ${detailQuery.data?.data.name || ""}`}
      breadcrumbs={breadcrumbs}
      noStyle
    >
      <Section loading={detailQuery.isLoading}>
        <Section title="[Module] Information">
          <Descriptions
            bordered
            layout="horizontal"
            items={items}
            column={{
              md: 1,
              lg: 2,
              xl: 2,
              xxl: 2,
            }}
            data-testid="[module]-descriptions"
          />
        </Section>
      </Section>
      <ModalAction
        type="delete"
        open={openModal}
        onOk={() => {
          if (id) {
            deleteMutation.mutate(
              { id },
              {
                onSuccess: () => {
                  setOpenModal(false);
                  window.location.href = Route.[Module];
                },
              },
            );
          }
        }}
        onCancel={() => {
          setOpenModal(false);
        }}
        cancelButtonProps={{
          disabled: deleteMutation.isPending,
        }}
        okButtonProps={{
          loading: deleteMutation.isPending,
        }}
        okType="primary"
        description="Are you sure you want to delete this data?"
        title="Delete Data"
        data-testid="delete-modal"
      />
    </Page>
  );
};

export default Component;
```

## 4. Edit Page Template (`[id]/edit/page.tsx`)

```typescript
import { useRouter } from "@/app/_hooks/router/use-router";
import { useParams } from "react-router";
import Page from "@/components/layouts/main/page";

import { Route } from "@/commons/route";

import Form[Module] from "../../_components/form";
import { T[Module]FormData } from "../../_components/form/schema";
import { useGetDetail[Module] } from "../_hooks/use-get-detail-[module]";
import { useEdit[Module]Mutation } from "./_hooks/use-edit-[module]-mutation";

const Component = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const editMutation = useEdit[Module]Mutation(id!);
  const detailQuery = useGetDetail[Module](id!);

  const breadcrumbs = [
    {
      label: "[Parent Label]",
      path: "",
    },
    {
      label: "[Module]s",
      path: Route.[Module],
    },
    {
      label: "Edit [Module]",
      path: "",
    },
  ];

  return (
    <Page
      title="Edit [Module]"
      breadcrumbs={breadcrumbs}
      noStyle
      goBack={() => {
        router.push(Route.[Module]);
      }}
      loading={detailQuery.isLoading}
    >
      <Form[Module]
        key={detailQuery.data?.data.id}
        error={editMutation.error?.response?.data}
        loading={editMutation.isPending}
        editForm={true}
        formProps={{
          disabled: editMutation.isPending || !detailQuery.data?.data,
          initialValues: {
            // Map initial values here, including boolean to number conversion if needed
            name: detailQuery.data?.data.name,
            row_status: detailQuery.data?.data.row_status === 1,
          },
          onFinish: (formData: T[Module]FormData) => {
            editMutation.mutate(
              {
                ...formData,
                // Add transformations (e.g., boolean to number)
                row_status: formData.row_status ? 1 : 0,
              },
              {
                onSuccess: () => {
                  router.push(Route.[Module]);
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
```

## 5. Form Component (`_components/form/index.tsx`)

```typescript
import { Section } from "admiral";
import { Button, Col, Form, FormProps, Input, Row, Space, Switch } from "antd";

import { useRouter } from "@/app/_hooks/router/use-router";
import { useFormErrorHandling } from "@/app/_hooks/use-form-handling";
import { TApiResponseError } from "@/commons/types/api";
import { createZodSync } from "@/utils/zod-sync";

import { [Module]Schema } from "./schema";

interface Props {
  formProps: FormProps;
  loading?: boolean;
  loadingData?: boolean;
  error?: TApiResponseError | null;
  editForm?: boolean;
}

const rule = createZodSync([Module]Schema);

const Form[Module] = ({ formProps, loading, loadingData, error, editForm }: Props) => {
  const router = useRouter();
  const [form] = Form.useForm();

  useFormErrorHandling(error, ({ key, value }) => form.setFields([{ name: key, errors: [value] }]));

  return (
    <Form {...formProps} form={form} layout="vertical" data-testid="[module]-form">
      <Section loading={loadingData}>
        <Section title="[Module] Information">
          <Row gutter={[16, 0]}>
            <Col span={24} sm={12}>
              <Form.Item
                label="Name"
                name="name"
                required
                rules={[rule]}
                data-testid="[module]-name-input"
              >
                <Input placeholder="Enter name" data-testid="[module]-name-field" />
              </Form.Item>
            </Col>
            {editForm && (
              <Col span={24} sm={12}>
                <Form.Item
                  label="Status"
                  name="row_status"
                  valuePropName="checked"
                  rules={[rule]}
                  data-testid="[module]-status-switch"
                >
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    data-testid="[module]-status-field"
                  />
                </Form.Item>
              </Col>
            )}
            {/* Add more form items here */}
          </Row>
        </Section>
      </Section>

      <Form.Item style={{ textAlign: "right", marginTop: 16 }}>
        <Space>
          <Button
            type="default"
            htmlType="button"
            onClick={() => router.back()}
            disabled={loading}
            data-testid="[module]-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading || formProps.disabled}
            loading={loading}
            data-testid="[module]-save-btn"
          >
            {!editForm ? "Save" : "Save Changes"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default Form[Module];
```

## 6. Form Schema (`_components/form/schema.ts`)

```typescript
import { z } from "zod";

export const [Module]Schema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(1, { message: "Name is required" }),
  row_status: z.boolean().optional(), // In the form it's a switch (boolean). We convert to 0 | 1 on submit.
});

export type T[Module]FormData = z.infer<typeof [Module]Schema>;
```

## 7. Get List Hook Template (`_hooks/use-get-[module]s.ts`)

```typescript
import { get[Module]s } from "@/modules/[group]/[module]";
import { TFilter[Module] } from "@/modules/[group]/[module]/type";
import { useQuery } from "@tanstack/react-query";

export const get[Module]sQueryKey = "get-[module]-list";

export const useGet[Module]s = (params: TFilter[Module] = {}) => {
  return useQuery({
    queryKey: [get[Module]sQueryKey, params],
    queryFn: () => get[Module]s(params),
  });
};
```

## 8. Get Detail Hook Template (`[id]/_hooks/use-get-detail-[module].ts`)

```typescript
import { getDetail[Module] } from "@/modules/[group]/[module]";
import { useQuery } from "@tanstack/react-query";

export const getDetail[Module]QueryKey = "get-[module]-detail";

export const useGetDetail[Module] = (id: string) => {
  return useQuery({
    queryKey: [getDetail[Module]QueryKey, id],
    queryFn: () => getDetail[Module]({ id }),
    enabled: !!id,
  });
};
```

## 9. Create Mutation Hook Template (`create/_hooks/use-create-[module]-mutation.ts`)

```typescript
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { create[Module] } from "@/modules/[group]/[module]";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import { get[Module]sQueryKey } from "../../_hooks/use-get-[module]s";
import { getMutationError } from "@/utils/api-error";

export const useCreate[Module]Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-[module]"],
    mutationFn: create[Module],
    onSuccess: () => {
      message.success("Success create [module]");
      queryClient.invalidateQueries({ queryKey: [get[Module]sQueryKey] });
    },
    onError: (error) => {
      message.error(getMutationError(error, "Failed to create [module]"));
    },
  });
};
```

## 10. Edit Mutation Hook Template (`[id]/edit/_hooks/use-edit-[module]-mutation.ts`)

```typescript
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { update[Module] } from "@/modules/[group]/[module]";
import { T[Module]UpdateRequest } from "@/modules/[group]/[module]/type";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import { getDetail[Module]QueryKey } from "../../_hooks/use-get-detail-[module]";
import { get[Module]sQueryKey } from "../../../_hooks/use-get-[module]s";
import { getMutationError } from "@/utils/api-error";

export const useEdit[Module]Mutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-[module]", id],
    mutationFn: (req: T[Module]UpdateRequest) => update[Module]({ id }, req),
    onSuccess: () => {
      message.success("Success update [module]");
      queryClient.invalidateQueries({ queryKey: [get[Module]sQueryKey] });
      queryClient.invalidateQueries({ queryKey: [getDetail[Module]QueryKey, id] });
    },
    onError: (error) => {
      message.error(getMutationError(error, "Failed to update [module]"));
    },
  });
};
```

## 11. Delete Mutation Hook Template (`_hooks/use-delete-[module].ts`)

```typescript
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { delete[Module] } from "@/modules/[group]/[module]";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import { get[Module]sQueryKey } from "./use-get-[module]s";
import { getMutationError } from "@/utils/api-error";

export const useDelete[Module] = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-[module]"],
    mutationFn: delete[Module],
    onSuccess: () => {
      message.success("Success delete [module]");
      queryClient.invalidateQueries({ queryKey: [get[Module]sQueryKey] });
    },
    onError: (error) => {
      message.error(getMutationError(error, "Failed to delete [module]"));
    },
  });
};
```
