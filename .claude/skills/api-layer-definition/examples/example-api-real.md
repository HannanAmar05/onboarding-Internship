# Example: Real API Integration

This example shows how to integrate using `api` (production endpoint).

## Request

"Integrate the Descriptions API into `src/modules/management-reports/master-data/descriptions` using `api`."

## Input

- **MODULE_PATH**: `management-reports/master-data/descriptions`
- **API_DOC_PATH**: `docs/api/modules/Descriptions.json`
- **FETCHER**: `api`

## Execution

### 1. Read API Documentation

```json
// docs/api/modules/Descriptions.json
{
  "endpoints": [
    {
      "method": "GET",
      "path": "/mreport/api/v1/master-data/descriptions",
      "response": { "$ref": "../schemas/DescriptionListResponse.json" }
    },
    {
      "method": "GET",
      "path": "/mreport/api/v1/master-data/descriptions/{id}",
      "response": { "$ref": "../schemas/DescriptionDetailResponse.json" }
    },
    {
      "method": "POST",
      "path": "/mreport/api/v1/master-data/descriptions",
      "request": { "$ref": "../schemas/DescriptionRequest.json" }
    },
    {
      "method": "PUT",
      "path": "/mreport/api/v1/master-data/descriptions/{id}",
      "request": { "$ref": "../schemas/DescriptionRequest.json" }
    },
    {
      "method": "DELETE",
      "path": "/mreport/api/v1/master-data/descriptions/{id}"
    }
  ]
}
```

### 2. Resolve Schemas

```json
// docs/api/schemas/DescriptionDetailResponse.json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "description_code": { "type": "string" },
    "description_name": { "type": "string" },
    "category_id": { "type": "string" },
    "category_name": { "type": "string" },
    "is_active": { "type": "boolean" },
    "notes": { "type": "string", "nullable": true },
    "created_at": { "type": "string", "nullable": true },
    "updated_at": { "type": "string", "nullable": true }
  }
}
```

### 3. Generate `type.ts`

```typescript
// src/modules/management-reports/master-data/descriptions/type.ts
import { TApiResponseData, TApiResponsePagination, TQueryParams } from "@/commons/types/api";

// Exact match with API response
export type TDescription = {
  id: string;
  description_code: string;
  description_name: string;
  category_id: string;
  category_name: string;
  is_active: boolean;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

// Request type for POST/PUT
export type TDescriptionRequest = {
  description_code: string;
  description_name: string;
  category_id: string;
  is_active: boolean;
  notes?: string;
};

// Filter type for GET list
export type TFilterDescription = TQueryParams & {
  description_code?: string;
  description_name?: string;
  category_id?: string;
  is_active?: boolean;
};
```

### 4. Generate `index.ts`

```typescript
// src/modules/management-reports/master-data/descriptions/index.ts
import { api } from "@/utils/fetcher-v2";  // ← Using api (REAL)
import { TApiResponseData, TApiResponsePagination } from "@/commons/types/api";
import { TDescription, TDescriptionRequest, TFilterDescription } from "./type";

const ENDPOINT = "/mreport/api/v1/master-data/descriptions";

// Query keys for cache invalidation
export const getDescriptionsQueryKey = "get-descriptions";
export const getDescriptionDetailQueryKey = "get-description-detail";

// ✅ Return as-is - NO transformation
export const getDescriptions = async (params?: TFilterDescription) => {
  return await api.get<TApiResponsePagination<TDescription>>(ENDPOINT, { params });
};

export const getDescriptionById = async (params: { id: string }) => {
  return await api.get<TApiResponseData<TDescription>>(`${ENDPOINT}/${params.id}`);
};

export const createDescription = async (data: TDescriptionRequest) => {
  return await api.post<TApiResponseData<TDescription>>(ENDPOINT, data);
};

export const updateDescription = async (params: { id: string }, data: TDescriptionRequest) => {
  return await api.put<TApiResponseData<TDescription>>(`${ENDPOINT}/${params.id}`, data);
};

export const deleteDescription = async (params: { id: string }) => {
  return await api.delete<TApiResponseData<string>>(`${ENDPOINT}/${params.id}`);
};
```

### 5. Update Components

**Table columns** - use API field names:
```typescript
// src/app/(authenticated)/management-reports/master-data/descriptions/page.tsx
const columns: ColumnsType<TDescription> = [
  { dataIndex: "description_code", title: "Kode", sorter: true },
  { dataIndex: "description_name", title: "Nama Deskripsi", sorter: true },
  { dataIndex: "category_name", title: "Kategori", sorter: true },
  {
    dataIndex: "is_active",
    title: "Status",
    render: (isActive: boolean) => (
      <Tag color={isActive ? "green" : "red"}>
        {isActive ? "Aktif" : "Tidak Aktif"}
      </Tag>
    ),
  },
  { dataIndex: "notes", title: "Catatan" },
];
```

**Form schema** - match API request:
```typescript
// src/app/(authenticated)/management-reports/master-data/descriptions/_components/form/schema.ts
import { z } from "zod";

export const Schema = z.object({
  description_code: z.string().min(1, "Kode wajib diisi"),
  description_name: z.string().min(1, "Nama deskripsi wajib diisi"),
  category_id: z.string().min(1, "Kategori wajib dipilih"),
  is_active: z.boolean(),
  notes: z.string().optional(),
});

export type TFormData = z.infer<typeof Schema>;
```

**Form fields** - use API field names:
```typescript
// src/app/(authenticated)/management-reports/master-data/descriptions/_components/form/index.tsx
<Form.Item name="description_code" label="Kode" rules={[rule]}>
  <Input placeholder="Masukkan kode" />
</Form.Item>

<Form.Item name="description_name" label="Nama Deskripsi" rules={[rule]}>
  <Input placeholder="Masukkan nama deskripsi" />
</Form.Item>

<Form.Item name="category_id" label="Kategori" rules={[rule]}>
  <Select placeholder="Pilih kategori" options={categoryOptions} />
</Form.Item>

<Form.Item name="is_active" label="Status" valuePropName="checked">
  <Switch checkedChildren="Aktif" unCheckedChildren="Tidak Aktif" />
</Form.Item>

<Form.Item name="notes" label="Catatan">
  <Input.TextArea rows={4} placeholder="Masukkan catatan (opsional)" />
</Form.Item>
```

**Detail page** - use API field names:
```typescript
// src/app/(authenticated)/management-reports/master-data/descriptions/[id]/page.tsx
<Descriptions>
  <Descriptions.Item label="Kode">{data?.description_code}</Descriptions.Item>
  <Descriptions.Item label="Nama">{data?.description_name}</Descriptions.Item>
  <Descriptions.Item label="Kategori">{data?.category_name}</Descriptions.Item>
  <Descriptions.Item label="Status">
    <Tag color={data?.is_active ? "green" : "red"}>
      {data?.is_active ? "Aktif" : "Tidak Aktif"}
    </Tag>
  </Descriptions.Item>
  <Descriptions.Item label="Catatan">{data?.notes ?? "-"}</Descriptions.Item>
</Descriptions>
```

### 6. Verify

```bash
npx tsc --noEmit  # No errors
pnpm run lint     # No errors
```

## Key Points

1. **Fetcher**: `api` - connects to REAL production endpoint
2. **Types**: Exact match with API schema (`description_code`, `is_active`, etc.)
3. **No transformation**: API response returned as-is
4. **Boolean handling**: `is_active` is boolean, render as "Aktif"/"Tidak Aktif"
5. **Nullable fields**: `notes` can be null, handle with `?? "-"`
