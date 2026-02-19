# Templates

## type.ts

Types must **exactly match** API response schema - no transformation.

```typescript
import { TApiResponseData, TApiResponsePagination, TQueryParams } from "@/commons/types/api";

// [GENERATED TYPES]
// Map JSON schemas to TypeScript interfaces here.
// Use EXACT field names from API response.

// Example - matches API exactly:
export type T[Entity] = {
  id: string;
  entity_name: string;      // API field name, not "name"
  is_active: boolean;       // API field name, not "status"
  created_at: string | null;
  updated_at: string | null;
};

// Request type for POST/PUT
export type T[Entity]Request = {
  entity_name: string;
  is_active: boolean;
};

// Filter type for GET list
export type TFilter[Entity] = TQueryParams & {
  entity_name?: string;
  is_active?: boolean;
};
```

## index.ts

Return API response directly - **NO transformation**.

```typescript
import { api } from "@/utils/fetcher-v2";
import { TApiResponseData, TApiResponsePagination } from "@/commons/types/api";
import {
  T[Entity],
  T[Entity]Request,
  TFilter[Entity],
} from "./type";

const ENDPOINT = "/api/v1/[resource]";

// ✅ CORRECT - Return as-is
export const get[Entity]s = async (params?: TFilter[Entity]) => {
  return await api.get<TApiResponsePagination<T[Entity]>>(ENDPOINT, { params });
};

export const get[Entity]ById = async (params: { id: string }) => {
  return await api.get<TApiResponseData<T[Entity]>>(`${ENDPOINT}/${params.id}`);
};

export const create[Entity] = async (payload: T[Entity]Request) => {
  return await api.post<TApiResponseData<T[Entity]>>(ENDPOINT, payload);
};

export const update[Entity] = async (params: { id: string }, payload: T[Entity]Request) => {
  return await api.put<TApiResponseData<T[Entity]>>(`${ENDPOINT}/${params.id}`, payload);
};

export const delete[Entity] = async (params: { id: string }) => {
  return await api.delete<TApiResponseData<string>>(`${ENDPOINT}/${params.id}`);
};

// ❌ WRONG - Don't do this
// export const get[Entity]s = async (params?: TFilter) => {
//   const response = await api.get<...>(ENDPOINT, { params });
//   return {
//     ...response,
//     items: response.items?.map(transformToFrontend) ?? [],
//   };
// };
```

## Component Adaptation

When API field names differ from current UI, update components:

```typescript
// Before (old field names)
const columns = [
  { dataIndex: "name", title: "Name" },
  { dataIndex: "status", title: "Status" },
];
<span>{record.name}</span>

// After (API field names)
const columns = [
  { dataIndex: "entity_name", title: "Name" },
  { dataIndex: "is_active", title: "Status" },
];
<span>{record.entity_name}</span>
{record.is_active ? "Active" : "Inactive"}
```

## Form Schema Adaptation

```typescript
// Before
const schema = z.object({
  name: z.string().min(1),
  status: z.enum(["Active", "Inactive"]),
});

// After - match API request
const schema = z.object({
  entity_name: z.string().min(1),
  is_active: z.boolean(),
});
```
