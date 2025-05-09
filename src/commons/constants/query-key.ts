export const QUERY_KEY = {
  FAQ: {
    LIST: "get-faq-list",
    DETAIL: "get-detail-faq",
    CREATE: "create-faq",
    UPDATE: "update-faq",
    DELETE: "delete-faq",
  },
  BOOKS: {
    LIST: "get-books-list",
    DETAIL: "get-books-detail",
    CREATE: "post-create-book",
    UPDATE: "put-update-book",
    DELETE: "delete-delete-book",
  },
  USERS: {
    LIST: "get-users-list",
    DETAIL: "get-users-detail",
    CREATE: "post-create-user",
    UPDATE: "put-update-user",
    DELETE: "delete-delete-user",
  },
} as const;
