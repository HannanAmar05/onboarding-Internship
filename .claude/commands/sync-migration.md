---
description: Sync MIGRATION.md with API documentation modules
---

# Sync Migration Command

Scans `docs/api/modules/` and updates `MIGRATION.md` with API documentation mappings and integration status.

## Steps

1. **List API Documentation Files**:
   - Read all JSON files in `docs/api/modules/`
   - Display the list of available API documentation

2. **Update API Doc File Column**:
   - Match module names to API doc file names using the mapping below
   - Update the `API Doc File` column in `MIGRATION.md`

3. **Check API Integration Status & Type**:
   - For each module, check `src/modules/[group]/[module]/index.ts`
   - Set **API Integration** status:
     - `Done` - All endpoints integrated with real/mock API
     - `Integrating` - Partial API integration (some endpoints converted)
     - `Pending` - Not yet integrated
     - `N/A` - No API documentation available
   - Set **API Type** based on fetcher used:
     - `Real` - Uses `api` from `@/utils/fetcher-v2` (production endpoint)
     - `Mock` - Uses `apiMock` from `@/utils/fetcher-v2` (BE mock endpoint)
     - `Local` - Uses local mock data in `index.ts` (no endpoint hit)
     - `-` - Not yet integrated

4. **Report Unmapped API Docs**:
   - List any API doc files that don't match existing modules
   - Suggest potential module mappings

## Module to API Doc Mapping

| Module Name | API Doc File | Notes |
|-------------|--------------|-------|
| data-uploads | Import From Spec.json | Contains data upload endpoints |
| data-uploads-files | Import From Spec.json | File detail endpoints |
| descriptions | Descriptions.json | Master data descriptions |
| entity-districts | Entity Districts.json | Entity districts master data |
| period-actuals | Configuration.json | Period configuration |
| period-plans | Configuration.json | Period configuration |

## Detection Patterns

### Real API (API Type: `Real`)
```typescript
// Uses `api` constant from @/utils/fetcher-v2
import { api } from "@/utils/fetcher-v2";

export const getEntities = async (params) => {
  return await api.get(ENDPOINTS.ENTITIES, { params });
};
```

### Mock API (API Type: `Mock`)
```typescript
// Uses `apiMock` constant from @/utils/fetcher-v2 (hits BE mock endpoint)
import { apiMock } from "@/utils/fetcher-v2";

export const getEntities = async (params) => {
  return await apiMock.get(ENDPOINTS.ENTITIES, { params });
};
```

### Local Mock (API Type: `Local`)
```typescript
// Local mock data - no endpoint hit
const mockData = [...];

export const getEntities = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { status_code: 200, data: mockData };
};
```

### Mixed Usage (API Integration: `Integrating`)
```typescript
// Some functions use real/mock API, others use local mock
import { api } from "@/utils/fetcher-v2";

export const getList = async () => api.get(ENDPOINT); // Real API
export const exportData = async () => localMockExport; // Local mock
```

## Output

After running this command, `MIGRATION.md` will be updated with:
- Accurate `API Integration` status for all modules
- Correct `API Type` based on fetcher used (`Real`, `Mock`, `Local`, `-`)
- Correct `API Doc File` mappings
- List of unmapped API documentation files (if any)
