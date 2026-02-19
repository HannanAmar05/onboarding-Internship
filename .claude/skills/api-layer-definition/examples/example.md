# API Layer Definition Examples

This directory contains examples for different API integration scenarios.

## Available Examples

| Example | Fetcher | Use Case |
|---------|---------|----------|
| [example-api-mock.md](./example-api-mock.md) | `apiMock` | BE mock endpoint (development) |
| [example-api-real.md](./example-api-real.md) | `api` | Production endpoint |
| [example-local-mock.md](./example-local-mock.md) | Local | No API endpoint available |

## Quick Reference

### 1. API Mock (`apiMock`)

Use when connecting to Backend mock server for development/testing.

```typescript
import { apiMock } from "@/utils/fetcher-v2";

export const getEntities = async (params?: TFilter) => {
  return await apiMock.get<TApiResponsePagination<TEntity>>(ENDPOINT, { params });
};
```

### 2. Real API (`api`)

Use when connecting to production Backend server.

```typescript
import { api } from "@/utils/fetcher-v2";

export const getEntities = async (params?: TFilter) => {
  return await api.get<TApiResponsePagination<TEntity>>(ENDPOINT, { params });
};
```

### 3. Local Mock (Fallback)

Use when API endpoint is not available yet but UI feature must work.

```typescript
// TODO: Replace with real API when available
export const getFeature = async (params: { id: string }): Promise<TApiResponseData<TFeature>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { status_code: 200, data: mockData };
};
```

## Key Rules (All Examples)

1. **NO transformation** - Return API response as-is
2. **Types match API** - Use exact field names from API schema
3. **Components adapt** - Update UI to use API field names
4. **Preserve features** - Keep local mock for missing endpoints
