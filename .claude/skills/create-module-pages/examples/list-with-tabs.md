# List Page with Tabs Example

`src/app/(protected)/requests/page.tsx`

```typescript
import { Tabs } from "antd";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable, Page } from "admiral";
import { makeSource } from "@/utils/utils";
import { useRequestsQuery } from "../_hooks/use-requests-query";
import { PERMISSIONS } from "@/commons/constants/permissions";

export const permissions = [PERMISSIONS.REQUESTS.READ_REQUESTS];

export default function RequestsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("status") || "pending";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Example query: useRequestsQuery({ status: activeTab, ...filters })
  const { data: pendingData, isLoading: isPendingLoading } = useRequestsQuery({ status: "pending" });
  const { data: approvedData, isLoading: isApprovedLoading } = useRequestsQuery({ status: "approved" });
  const { data: rejectedData, isLoading: isRejectedLoading } = useRequestsQuery({ status: "rejected" });

  const columns = [
    { title: "Request ID", dataIndex: "id", key: "id" },
    { title: "Requester", dataIndex: "requester_name", key: "requester_name" },
    { title: "Date", dataIndex: "created_at", key: "created_at" },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSearchParams({ status: key });
  };

  const tabItems = [
    {
      label: "Pending Approval",
      key: "pending",
      children: (
        <DataTable
          source={makeSource(pendingData)}
          loading={isPendingLoading}
          columns={columns}
          rowKey="id"
          // Add filter components specific to pending tab if needed
        />
      )
    },
    {
      label: "Approved",
      key: "approved",
      children: (
        <DataTable
          source={makeSource(approvedData)}
          loading={isApprovedLoading}
          columns={columns}
          rowKey="id"
        />
      )
    },
    {
      label: "Rejected",
      key: "rejected",
      children: (
        <DataTable
          source={makeSource(rejectedData)}
          loading={isRejectedLoading}
          columns={columns}
          rowKey="id"
        />
      )
    },
  ];

  return (
    <Page title="Requests Management" noStyle>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        className="mb-4"
        destroyInactiveTabPane={true} // Optional: mount only active tab content
      />
    </Page>
  );
}
```
