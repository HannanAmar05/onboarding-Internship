---
name: create-module-pages
description: Create page components (list, detail, create, edit) for a module within a group
tools: Write, Edit, Read
---

# Create Module Pages

Create page components for a module in `src/app/(authenticated)/[group]/[module]/`.

## Overview

This skill creates the standard CRUD pages for a module within a specific group: List, Detail, Create, and Edit.

## Input

The user will provide the group name and module name as arguments. Example: `/create-module-pages hr holiday-dates`

## Expected Output

After running this skill, the following structure will be created:

```
src/app/(authenticated)/[group]/[module]/
├── page.tsx               # List Page
├── create/
│   ├── page.tsx           # Create Page
│   └── _hooks/
│       └── use-create-[module]-mutation.ts
├── [id]/
│   ├── page.tsx           # Detail Page
│   ├── _hooks/
│   │   └── use-get-detail-[module].ts
│   └── edit/
│       ├── page.tsx       # Edit Page
│       └── _hooks/
│           └── use-edit-[module]-mutation.ts
├── _components/
│   └── form/
│       ├── index.tsx      # Shared Form Component
│       └── schema.ts      # Zod Validation Schema
└── _hooks/
    ├── use-get-[module]s.ts
    └── use-delete-[module].ts
```

## Output Checklist

- [ ] Create folder `src/app/(authenticated)/[group]/[module]/`
- [ ] Create `page.tsx` (List Page)
- [ ] Create `create/page.tsx` (Create Page) - **Condition: Only if requested or exists in reference/xml**
- [ ] Create `[id]/page.tsx` (Detail Page) - **Condition: Only if requested or exists in reference/xml**
- [ ] Create `[id]/edit/page.tsx` (Edit Page) - **Condition: Only if requested or exists in reference/xml**
- [ ] Create `_components/form/index.tsx` (Shared Form)
- [ ] Create `_components/form/schema.ts` (Validation Schema)
- [ ] Create `_hooks/use-get-[module]s.ts`
- [ ] Create `_hooks/use-delete-[module].ts`
- [ ] Create `create/_hooks/use-create-[module]-mutation.ts` - **Condition/Related: Create hooks**
- [ ] Create `[id]/_hooks/use-get-detail-[module].ts` - **Condition/Related: Detail/Edit hooks**
- [ ] Create `[id]/edit/_hooks/use-edit-[module]-mutation.ts` - **Condition/Related: Detail/Edit hooks**
- [ ] Update `src/commons/route/index.ts` with [Module] routes

## Steps

1. **Create module folder** at `src/app/(authenticated)/[group]/[module]/`
2. **Create List Page** (`page.tsx`)
3. **Create Create Page** (`create/page.tsx`) - _(Optional: check User Request/XML)_
4. **Create Detail Page** (`[id]/page.tsx`) - _(Optional: check User Request/XML)_
5. **Create Edit Page** (`[id]/edit/page.tsx`) - _(Optional: check User Request/XML)_
6. **Create Form Component** (`_components/form/index.tsx` & `_components/form/schema.ts`)
7. **Create Hooks**
   - `_hooks/use-get-[module]s.ts`
   - `_hooks/use-delete-[module].ts`
   - `create/_hooks/use-create-[module]-mutation.ts` _(Optional)_
   - `[id]/_hooks/use-get-detail-[module].ts` _(Optional)_
   - `[id]/edit/_hooks/use-edit-[module]-mutation.ts` _(Optional)_
8. **Update Routes**
   - Add module routes to `Route` enum in `src/commons/route/index.ts`

## Standards

- **Routes**: Use `Route` enum from `@/commons/route` and `route()` helper.
- **Navigation**: Use `useRouter` hook from `@/app/_hooks/router/use-router`.
- **Validation**: Use **Zod** schema defined in `schema.ts`.
- **Forms**: Use `Ant Design` Form with `createZodSync`.
- **Loading State**: Use `isPending` / `isLoading` from TanStack Query.
- **Error Handling**: Use `useFormErrorHandling` hook.
- **Components**: Use `Admiral` components (`Page`, `Section`, `DataTable`).
- **Module Naming**: Folder must use **dash-case** (e.g., `holiday-dates`).
- **Group Naming**: Folder must use **dash-case** (e.g., `finance`, `human-resources`).
- **Path Structure Rules**:
  - When migrating/creating based on an original path (e.g., `src/protected/master-data/descriptions`), the target structure must be:
    `src/app/(authenticated)/[group]/[original_relative_path]`
  - Example: Original `src/protected/master-data/descriptions` + Group `management-reports` -> `src/app/(authenticated)/management-reports/master-data/descriptions`.

## References

- See `template.md` for code templates
- **See `reference.md` for standard page implementations** (points to `src/app/(authenticated)/examples`)
