# API Module Templates

## type.ts Template

```typescript
import {
  TApiResponseData,
  TApiResponsePagination,
  TQueryParams,
} from "@/commons/types/api";

// Status type (adjust based on module needs)
export type T[Module]Status = 0 | 1; // or "active" | "inactive"

export type T[Module] = {
  id: string;
  // ... all fields from prototype
  row_status: T[Module]Status;
  created_at?: string | null;
  updated_at?: string | null;
};

export type T[Module]CreateRequest = {
  // ... fields for create (row_status optional, defaults to 1/active)
  row_status?: T[Module]Status;
};

export type T[Module]UpdateRequest = {
  // ... all required fields for update
  row_status: T[Module]Status;
};

export type TFilter[Module] = TQueryParams & {
  // ... optional filters
  row_status?: T[Module]Status;
};

export type T[Module]ListResponse = TApiResponsePagination<T[Module]>;
export type T[Module]DetailResponse = TApiResponseData<T[Module]>;
// For mutations (create/update/delete), return string message
export type T[Module]MutationResponse = TApiResponseData<string>;
```

## index.ts Template (Mock Data)

```typescript
import {
  TFilter[Module],
  T[Module],
  T[Module]CreateRequest,
  T[Module]DetailResponse,
  T[Module]ListResponse,
  T[Module]MutationResponse,
  T[Module]UpdateRequest,
} from "./type";

// Mock data array
const list[Module]s: T[Module][] = [
  {
    id: "1",
    // ... fields
    row_status: 1,
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  // ... more items
];

const delay = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });

// List - returns items directly with meta at root level
export const get[Module]s = async (
  _params?: TFilter[Module],
): Promise<T[Module]ListResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    items: list[Module]s,
    meta: {
      total_page: 1,
      total: list[Module]s.length,
      page: 1,
      per_page: 10,
    },
    version: "1.0.0",
  });
};

// Detail - returns data at root level
export const getDetail[Module] = async (params: {
  id: string;
}): Promise<T[Module]DetailResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    data: list[Module]s.find((item) => item.id === params.id)!,
    version: "1.0.0",
  });
};

// Create - returns string message
export const create[Module] = async (
  _req: T[Module]CreateRequest,
): Promise<T[Module]MutationResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    data: "create success",
    version: "1.0.0",
  });
};

// Update - returns string message
export const update[Module] = async (
  _params: { id: string },
  _req: T[Module]UpdateRequest,
): Promise<T[Module]MutationResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    data: "edit success",
    version: "1.0.0",
  });
};

// Delete - returns string message
export const delete[Module] = async (_params: {
  id: string;
}): Promise<T[Module]MutationResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    data: "delete success",
    version: "1.0.0",
  });
};

// Bulk delete - returns string message
export const delete[Module]s = async (_req: {
  ids: string[];
}): Promise<T[Module]MutationResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    data: "delete success",
    version: "1.0.0",
  });
};
```
