# Sample: Entity Districts Module

Complete example of an API module for managing entity districts, placed in the `management-reports` group.

## Folder Structure

```
src/modules/management-reports/entity-districts/
├── type.ts
└── index.ts
```

---

## type.ts

```typescript
import { TApiResponseData, TApiResponsePagination, TQueryParams } from "@/commons/types/api";

export type TEntityDistrictStatus = 0 | 1;

export type TEntityDistrict = {
  id: string;
  entity: string;
  district: string;
  description: string;
  row_status: TEntityDistrictStatus;
  created_at?: string | null;
  updated_at?: string | null;
};

export type TEntityDistrictCreateRequest = {
  entity: string;
  district: string;
  description: string;
  row_status?: TEntityDistrictStatus;
};

export type TEntityDistrictUpdateRequest = {
  entity: string;
  district: string;
  description: string;
  row_status: TEntityDistrictStatus;
};

export type TFilterEntityDistrict = TQueryParams & {
  entity?: string;
  district?: string;
  row_status?: TEntityDistrictStatus;
};

export type TEntityDistrictListResponse = TApiResponsePagination<TEntityDistrict>;
export type TEntityDistrictDetailResponse = TApiResponseData<TEntityDistrict>;
export type TEntityDistrictMutationResponse = TApiResponseData<string>;
```

---

## index.ts

```typescript
import {
  TFilterEntityDistrict,
  TEntityDistrict,
  TEntityDistrictCreateRequest,
  TEntityDistrictDetailResponse,
  TEntityDistrictListResponse,
  TEntityDistrictMutationResponse,
  TEntityDistrictUpdateRequest,
} from "./type";

const listEntityDistricts: TEntityDistrict[] = [
  {
    id: "1",
    entity: "PAMA",
    district: "PAMA",
    description: "PT. PAMA PERSADA NUSANTARA",
    row_status: 1,
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "2",
    entity: "PAMA",
    district: "Sangatta",
    description: "Site Sangatta",
    row_status: 1,
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "3",
    entity: "PAMA",
    district: "Tuban",
    description: "Site Tuban",
    row_status: 1,
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
  },
];

const delay = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });

export const getEntityDistricts = async (
  _params?: TFilterEntityDistrict,
): Promise<TEntityDistrictListResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    items: listEntityDistricts,
    meta: {
      total_page: 1,
      total: listEntityDistricts.length,
      page: 1,
      per_page: 10,
    },
    version: "1.0.0",
  });
};

export const getDetailEntityDistrict = async (params: {
  id: string;
}): Promise<TEntityDistrictDetailResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    data: listEntityDistricts.find((item) => item.id === params.id)!,
    version: "1.0.0",
  });
};

export const createEntityDistrict = async (
  _req: TEntityDistrictCreateRequest,
): Promise<TEntityDistrictMutationResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    data: "create success",
    version: "1.0.0",
  });
};

export const updateEntityDistrict = async (
  _params: { id: string },
  _req: TEntityDistrictUpdateRequest,
): Promise<TEntityDistrictMutationResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    data: "edit success",
    version: "1.0.0",
  });
};

export const deleteEntityDistrict = async (_params: {
  id: string;
}): Promise<TEntityDistrictMutationResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    data: "delete success",
    version: "1.0.0",
  });
};

export const deleteEntityDistricts = async (_req: {
  ids: string[];
}): Promise<TEntityDistrictMutationResponse> => {
  await delay(1000);
  return Promise.resolve({
    status_code: 200,
    data: "delete success",
    version: "1.0.0",
  });
};
```

---

## Notes

- All field names are in **English**
- All field names use **snake_case** format
- Status uses numeric type (0 = Inactive, 1 = Active)
- Create request has optional `row_status` (defaults to 1)
- Update request has all required fields including `row_status`
- List response: `items` and `meta` at root level (not wrapped in `data`)
- Detail response: `data` at root level
- Mutation responses: return `T[Module]MutationResponse` with string message
