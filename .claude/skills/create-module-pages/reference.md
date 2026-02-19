# Module Pages Reference

For the most up-to-date reference implementation, please consult the files in:

**Management Reports - Entity Districts Module:**
`src/app/(authenticated)/management-reports/master-data/entity-districts/`

- **List Page**: `src/app/(authenticated)/management-reports/master-data/entity-districts/page.tsx`
- **Create Page**: `src/app/(authenticated)/management-reports/master-data/entity-districts/create/page.tsx`
- **Detail Page**: `src/app/(authenticated)/management-reports/master-data/entity-districts/[id]/page.tsx`
- **Edit Page**: `src/app/(authenticated)/management-reports/master-data/entity-districts/[id]/edit/page.tsx`
- **Form Component**: `src/app/(authenticated)/management-reports/master-data/entity-districts/_components/form/index.tsx`
- **Form Schema**: `src/app/(authenticated)/management-reports/master-data/entity-districts/_components/form/schema.ts`
- **Hooks**: `src/app/(authenticated)/management-reports/master-data/entity-districts/_hooks/`

**For Configuration (period-plans, period-actuals):**
`src/app/(authenticated)/management-reports/configuration/`

Please read these files directly to understand the current patterns for module pages, including:
- ModalAction component usage for delete confirmations
- Query key exports from hooks
- Proper loading states and error handling
- Route enum naming (MR prefix for Management Reports)
