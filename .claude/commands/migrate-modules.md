---
description: Migrate all modules from repomix to the src directory
---

# Migrate Modules Command

This command orchestrates the migration of all modules found in the `repomix` directory.

## Steps

1.  **Detect Modules**:
    -   Scan the `repomix` directory for all files matching `*.xml`.
    -   Exclude any files starting with `.` or `_` if they are not module definitions (based on your observation, most seem to start with `(protected)_` which ARE valid modules).
    -   List all detected XML files.

2.  **Process Each Module**:
    -   For **EACH** detected XML file found in step 1:
        -   Run the `migration-agent` located at `.claude/agents/migration-agent.md`.
        -   Pass the **absolute path** of the current XML file as the context/input to the agent.
        -   Wait for the agent to complete the migration of that module before moving to the next (or run in parallel if supported, but sequential is safer).
