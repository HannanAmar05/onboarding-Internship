# Example: API Mock Integration

This example shows how to integrate using `apiMock` (BE mock endpoint).

## Request

"Integrate the Data Uploads API into `src/modules/management-reports/data-uploads` using `apiMock`."

## Input

- **MODULE_PATH**: `management-reports/data-uploads`
- **API_DOC_PATH**: `docs/api/modules/DataUploads.json`
- **FETCHER**: `apiMock`

## Execution

### 1. Read API Documentation

```json
// docs/api/modules/DataUploads.json
{
  "endpoints": [
    {
      "method": "GET",
      "path": "/mreport/api/v1/data-uploads",
      "response": { "$ref": "../schemas/DataUploadListResponse.json" }
    },
    {
      "method": "GET",
      "path": "/mreport/api/v1/data-uploads/{id}",
      "response": { "$ref": "../schemas/DataUploadDetailResponse.json" }
    },
    {
      "method": "POST",
      "path": "/mreport/api/v1/data-uploads",
      "request": { "$ref": "../schemas/DataUploadRequest.json" }
    }
  ]
}
```

### 2. Resolve Schemas

```json
// docs/api/schemas/DataUploadDetailResponse.json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "file_name": { "type": "string" },
    "file_path": { "type": "string" },
    "description_id": { "type": "string" },
    "table_name": { "type": "string" },
    "period_year": { "type": "number" },
    "period_month": { "type": "number" },
    "status": { "type": "number" },
    "created_at": { "type": "string", "nullable": true },
    "updated_at": { "type": "string", "nullable": true }
  }
}
```

### 3. Generate `type.ts`

```typescript
// src/modules/management-reports/data-uploads/type.ts
import { TApiResponseData, TApiResponsePagination, TQueryParams } from "@/commons/types/api";

// Exact match with API response - NO transformation
export type TDataUpload = {
  id: string;
  file_name: string;
  file_path: string;
  description_id: string;
  table_name: string;
  period_year: number;
  period_month: number;
  status: number;
  created_at: string | null;
  updated_at: string | null;
};

// Request type for POST/PUT
export type TDataUploadRequest = {
  file_name: string;
  file_path: string;
  description_id: string;
  table_name: string;
  period_year: number;
  period_month: number;
};

// Filter type for GET list
export type TFilterDataUpload = TQueryParams & {
  file_name?: string;
  description_id?: string;
  period_year?: number;
  status?: number;
};
```

### 4. Generate `index.ts`

```typescript
// src/modules/management-reports/data-uploads/index.ts
import { apiMock } from "@/utils/fetcher-v2";  // ← Using apiMock
import { TApiResponseData, TApiResponsePagination } from "@/commons/types/api";
import { TDataUpload, TDataUploadRequest, TFilterDataUpload } from "./type";

const ENDPOINT = "/mreport/api/v1/data-uploads";

// Query key for cache invalidation
export const getDataUploadsQueryKey = "get-data-uploads";
export const getDataUploadDetailQueryKey = "get-data-upload-detail";

// ✅ Return as-is - NO transformation
export const getDataUploads = async (params?: TFilterDataUpload) => {
  return await apiMock.get<TApiResponsePagination<TDataUpload>>(ENDPOINT, { params });
};

export const getDataUploadById = async (params: { id: string }) => {
  return await apiMock.get<TApiResponseData<TDataUpload>>(`${ENDPOINT}/${params.id}`);
};

export const createDataUpload = async (data: TDataUploadRequest) => {
  return await apiMock.post<TApiResponseData<TDataUpload>>(ENDPOINT, data);
};

export const updateDataUpload = async (params: { id: string }, data: TDataUploadRequest) => {
  return await apiMock.put<TApiResponseData<TDataUpload>>(`${ENDPOINT}/${params.id}`, data);
};

export const deleteDataUpload = async (params: { id: string }) => {
  return await apiMock.delete<TApiResponseData<string>>(`${ENDPOINT}/${params.id}`);
};
```

### 5. Update Components

**Table columns** - use API field names:
```typescript
// src/app/(authenticated)/management-reports/data-uploads/page.tsx
const columns: ColumnsType<TDataUpload> = [
  { dataIndex: "file_name", title: "File Name", sorter: true },
  { dataIndex: "table_name", title: "Table Name", sorter: true },
  { dataIndex: "period_year", title: "Year", sorter: true },
  { dataIndex: "period_month", title: "Month", sorter: true },
  {
    dataIndex: "status",
    title: "Status",
    render: (status: number) => (
      <Tag color={status === 1 ? "green" : "red"}>
        {status === 1 ? "Active" : "Inactive"}
      </Tag>
    ),
  },
];
```

**Form schema** - match API request:
```typescript
// src/app/(authenticated)/management-reports/data-uploads/_components/form/schema.ts
import { z } from "zod";

export const Schema = z.object({
  file_name: z.string().min(1, "Nama file wajib diisi"),
  file_path: z.string().min(1, "Path file wajib diisi"),
  description_id: z.string().min(1, "Deskripsi wajib dipilih"),
  table_name: z.string().min(1, "Nama tabel wajib diisi"),
  period_year: z.number().min(2000, "Tahun tidak valid"),
  period_month: z.number().min(1).max(12, "Bulan tidak valid"),
});

export type TFormData = z.infer<typeof Schema>;
```

**Form fields** - use API field names:
```typescript
// src/app/(authenticated)/management-reports/data-uploads/_components/form/index.tsx
<Form.Item name="file_name" label="Nama File" rules={[rule]}>
  <Input placeholder="Masukkan nama file" />
</Form.Item>

<Form.Item name="description_id" label="Deskripsi" rules={[rule]}>
  <Select placeholder="Pilih deskripsi" options={descriptionOptions} />
</Form.Item>

<Form.Item name="table_name" label="Nama Tabel" rules={[rule]}>
  <Input placeholder="Masukkan nama tabel" />
</Form.Item>

<Form.Item name="period_year" label="Tahun" rules={[rule]}>
  <InputNumber style={{ width: "100%" }} />
</Form.Item>
```

### 6. Verify

```bash
npx tsc --noEmit  # No errors
pnpm run lint     # No errors
```

## Key Points

1. **Fetcher**: `apiMock` - connects to BE mock endpoint
2. **Types**: Exact match with API schema (`file_name`, `description_id`, etc.)
3. **No transformation**: API response returned as-is
4. **Components adapted**: All field names match API
