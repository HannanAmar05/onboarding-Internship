# AI Prototype Project – Standards & Rules

## Project Integrity

* **This is a Working Application**

  * **Do not edit or delete any existing files**.
  * Only add or extend functionality as required, while preserving the integrity of the existing codebase.

## Naming & Importing

* Use **plural form** for resource names.

  * **Incorrect:** `book`, `user`
  * **Correct:** `books`, `users`

* Use **absolute imports** based on folder structure.

  * **Do not use** relative imports.

* Always use **snake\_case** for:

  * API request payloads
  * API responses
  * API type definitions

## Shared Components & Example Data

* **Form Shared Component**

  * Create before the Create/Update pages.
  * Path: `src/app/(protected)/[resource]/_components/Form.jsx`
  * Must be reusable.

## Use Meaningful Example Data

* **Incorrect:** `{ title: "Song 1", artist: "Artist 1" }`
* **Correct:** `{ title: "Bohemian Rhapsody", artist: "Queen" }`

## Date Format

* Use ISO 8601 format: `DD-MM-YYYY`
* Use `dayjs` for date handling

## Table Structure

* Use `DataTable` from `admiral`, not `antd`
* Expected response shape:

```json
{
  "data": {
    "status_code": 200,
    "version": "1.0.0",
    "data": {
      "items": [
        { "id": 1, "name": "Item 1", "created_at": "2023-10-01T00:00:00.000Z", "updated_at": "2023-10-01T00:00:00.000Z" }
      ],
      "meta": {
        "total_page": 1,
        "total": 10,
        "page": 1,
        "per_page": 10
      }
    }
  },
  "loading": false
}
```

## Tech Stack

* React Vite (Typescript)
* Not Next.js App
* React Router (not React Router DOM)
* TanStack Query
* Antd
