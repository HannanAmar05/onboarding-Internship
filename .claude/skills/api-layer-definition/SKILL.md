---
name: api-layer-definition
description: Define API layer (type.ts, index.ts) with proper fetcher (api/apiMock) from API documentation
tools: Read, Write, Edit, Glob, Grep
---

# API Layer Definition Skill

Defines or updates the API layer (`type.ts`, `index.ts`) for a module by reading API documentation and configuring the appropriate fetcher.

## Input

1. **Target Module Path**: Path to module in `src/modules/`
2. **API Doc Path**: Path to API documentation JSON file
3. **Fetcher**: `api` (real) or `apiMock` (mock)

## Critical Rules

### NO Response Transformation

- **NEVER** transform API responses in `index.ts`
- **NEVER** create transformer functions (e.g., `transformToFrontend`)
- **ALWAYS** return API response as-is
- **Components/pages MUST adapt** to API response structure

### Component Modification Rules

**ONLY modify these in components:**
- Field names (e.g., `name` → `entity_name`)
- Column `dataIndex` values
- Form field `name` props
- Rendering logic to match API data types

**NEVER do these:**
- **NEVER** delete existing fields/columns from components
- **NEVER** add new fields/columns that don't exist in current component
- **NEVER** remove Form.Item or table columns
- **NEVER** add new Form.Item or table columns
- **NEVER** change component structure or layout

**Example - CORRECT:**
```typescript
// Before
{ dataIndex: "name", title: "Nama" }
// After - only change dataIndex
{ dataIndex: "entity_name", title: "Nama" }
```

**Example - WRONG:**
```typescript
// DON'T remove columns
[{ dataIndex: "name" }, { dataIndex: "status" }]  →  [{ dataIndex: "entity_name" }]  // ❌

// DON'T add columns
[{ dataIndex: "name" }]  →  [{ dataIndex: "entity_name" }, { dataIndex: "new_field" }]  // ❌
```

### NEVER Delete Components or Features

- **NEVER** delete existing components, features, or UI elements
- **NEVER** remove functionality from the current implementation
- If a feature has no API endpoint, **keep it** with local mock data
- If API doesn't provide a field that component needs, **create local mock**
- Only replace data fetching logic, not UI components

### Handle Missing API Fields

If a component uses a field that API doesn't provide:

```typescript
// API doesn't provide 'calculated_total' field
// TODO: Backend needs to add 'calculated_total' to response
export const getEntitiesWithTotal = async (params?: TFilter) => {
  const response = await api.get<TApiResponsePagination<TEntity>>(ENDPOINT, { params });
  return {
    ...response,
    items: response.items?.map(item => ({
      ...item,
      calculated_total: item.quantity * item.price, // Local calculation
    })),
  };
};
```

### Handle Missing API Endpoints

1. Keep the feature intact in UI
2. Create local mock function in `index.ts`
3. Add `// TODO: Replace with real API when available` comment

## Fetcher Options

### Real API (`api`)

```typescript
import { api } from "@/utils/fetcher-v2";

export const getEntities = async (params?: TFilter) => {
  return await api.get<TApiResponsePagination<TEntity>>(ENDPOINT, { params });
};
```

### Mock API (`apiMock`)

```typescript
import { apiMock } from "@/utils/fetcher-v2";

export const getEntities = async (params?: TFilter) => {
  return await apiMock.get<TApiResponsePagination<TEntity>>(ENDPOINT, { params });
};
```

### Local Mock (Fallback)

```typescript
const mockData: TEntity[] = [...];

// TODO: Replace with real API when available
export const getSpecialFeature = async (): Promise<TApiResponseData<TEntity[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { status_code: 200, data: mockData };
};
```

## Execution Steps

### Step 1: Read API Documentation

1. Read API doc JSON file
2. Identify endpoints, methods, schemas
3. Read referenced schemas from `docs/api/schemas/`

### Step 2: Analyze Existing Module

1. Read current `index.ts` and `type.ts`
2. Identify exported functions and usages
3. List features needing API support

### Step 3: Update Types (`type.ts`)

1. Create types that **exactly match** API response schema
2. Use API field names as-is (e.g., `entity_name`, not `name`)
3. Include all fields from API response
4. Add request types for POST/PUT/PATCH endpoints

**Example:**
```typescript
// API returns: { entity_id, entity_name, is_active }
// Type MUST match exactly:
export type TEntity = {
  entity_id: string;
  entity_name: string;
  is_active: boolean;
};

// NOT transformed like:
// type TEntity = { id: string; name: string; status: "Active" | "Inactive" };
```

### Step 4: Update API Functions (`index.ts`)

1. Replace mock functions with API calls
2. Use specified fetcher (`api` or `apiMock`)
3. **Return API response directly** - NO transformation
4. Keep local mock for features without API

**Example:**
```typescript
// ✅ CORRECT - Return as-is
export const getEntities = async (params?: TFilter) => {
  return await api.get<TApiResponsePagination<TEntity>>(ENDPOINT, { params });
};

// ❌ WRONG - Don't transform
export const getEntities = async (params?: TFilter) => {
  const response = await api.get<...>(ENDPOINT, { params });
  return {
    ...response,
    items: response.items?.map(transformToFrontend) ?? [], // DON'T DO THIS
  };
};
```

### Step 5: Update Dependent Components

Search and update all files using this module's types/functions:

1. **Find usages**: `grep -r "from '@/modules/[module-path]'" src/`
2. **Update field references** in components:
   - `record.name` → `record.entity_name`
   - `record.id` → `record.entity_id`
   - `record.status === "Active"` → `record.is_active`
3. **Update form schemas** to match API request structure
4. **Update table columns** to use API field names
5. **Update form field names** to match API

**Files to check:**
- `src/app/**/page.tsx` - List/Detail/Create/Edit pages
- `src/app/**/_components/form/index.tsx` - Form components
- `src/app/**/_components/form/schema.ts` - Zod schemas
- `src/app/**/_hooks/*.ts` - Custom hooks

### Step 6: Fix Type Errors

1. Run `npx tsc --noEmit` to find errors
2. Fix all type errors caused by field name changes
3. Ensure all components compile without errors

## Output Checklist

- [ ] Read API documentation
- [ ] Read referenced schemas
- [ ] Preserve existing features
- [ ] Update `type.ts` with exact API schema
- [ ] Update `index.ts` with correct fetcher (NO transformation)
- [ ] Keep local mock for missing endpoints
- [ ] Update components to use API field names
- [ ] Update form schemas to match API
- [ ] Update table columns
- [ ] Fix all type errors

## Standards

- **Imports**: `@/commons/types/api`, `@/utils/fetcher-v2`
- **Types**: Prefix with `T` (e.g., `TEntityResponse`)
- **Functions**: camelCase (e.g., `getEntities`)
- **Mock Comments**: `// TODO: Replace with real API when available`
- **JSDoc**: Add from API documentation
- **Field Names**: Use API field names exactly as documented
