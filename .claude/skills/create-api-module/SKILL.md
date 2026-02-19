---
name: create-api-module
description: Create the API layer for a new module within a group
tools: Write, Edit, Read
---

# Create API Module

Create the API layer for a new module at `src/modules/[group]/[module]/`.

## Overview

This skill creates the API layer for a new module within a specific group, following the project's standard structure.

## Input

The user will provide the group name and module name as arguments. Example: `/create-api-module hr holidays`

## Expected Output

After running this skill, the following structure will be created:

```
src/modules/[group]/[module]/
├── type.ts    # TypeScript types for entity, request, response
└── index.ts   # API functions with mock data
```

## Output Checklist

Adjust based on module requirements (not all modules need full CRUD):

- [ ] Create folder `src/modules/[group]/[module]/`
- [ ] Create `type.ts` with:
  - [ ] `T[Module]` - Entity type with all fields
  - [ ] `T[Module]Request` - Request payload type (if create/update needed)
  - [ ] `TFilter[Module]` - Filter params type (if list needed)
  - [ ] `T[Module]ListResponse` - Paginated response type (if list needed)
  - [ ] `T[Module]DetailResponse` - Single item response type (if detail needed)
- [ ] Create `index.ts` with functions based on requirements:
  - [ ] Mock data array (if applicable)
  - [ ] `get[Module]s()` - List with pagination (optional)
  - [ ] `getDetail[Module]()` - Get by ID (optional)
  - [ ] `create[Module]()` - Create new (optional)
  - [ ] `update[Module]()` - Update by ID (optional)
  - [ ] `delete[Module]()` - Delete by ID (optional)

## Steps

1. **Create module folder** at `src/modules/[group]/[module]/`

2. **Create type.ts** - Define types based on requirements

3. **Create index.ts** - Implement required API functions only

4. **Add mock data** - Use data from prototype if available

## Standards

- Use absolute imports: `@/commons/types/...`
- Include TypeScript types for all parameters and returns
- Mock data should match the prototype's structure
- All API functions return Promises with proper response types
- **Field names must be in English**
- **Field names must use snake_case** (e.g., `created_at`, `row_status`, `data_level`)
- **Module folder names must use dash-case** (e.g., `holiday-dates`, `user-profiles`)
- **Group folder names must use dash-case** (e.g., `human-resources`, `finance`)

## References

- See `template.md` for code templates
- See `reference.md` which points to the live reference at `src/modules/examples/`
- See `examples/sample.md` for a complete "Holidays" module example within an "HR" group
