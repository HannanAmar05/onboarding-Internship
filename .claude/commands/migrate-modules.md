---
description: Migrate all modules from repomix to the src directory
---

# Migrate Modules Command

This command orchestrates the migration of all modules found in the `repomix` directory.

## Steps

1.  **Sync Backlog (`MIGRATION.md`)**:
    -   Check if `MIGRATION.md` exists in the project root.
    -   Scan `repomix` directory for `*.xml` files.
    -   **If `MIGRATION.md` is missing**:
        -   Create it with the header `# Migration Backlog`.
        -   Add a table or list with columns: `Status`, `Module Name`, `File Path`.
        -   Populate it with all found XML files, default status: `[ ] Pending`.
    -   **If `MIGRATION.md` exists**:
        -   Parse it to find which modules are already listed.
        -   Append any newly found XML files that are not yet in the backlog as `[ ] Pending`.
    -   *Display the current backlog status to the user.*

2.  **Process Modules**:
    -   Iterate through the modules listed in `MIGRATION.md`.
    -   **Filter** for modules with status `[ ] Pending` (or allow user to select specific ones).
    -   For **EACH** selected module:
        -   **Update Status**: Mark the module as `[/] Migrating` in `MIGRATION.md`.
        -   **Execute Agent**: Run the `migration-agent` (@[.claude/agents/migration-agent.md]) with the XML file path.
        -   **Completion**:
            -   If successful, update `MIGRATION.md` status to `[x] Done`.
            -   If failed, update `MIGRATION.md` status to `[!] Failed` or revert to Pending.

