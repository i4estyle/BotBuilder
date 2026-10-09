# BotBuilder ERD — Admin-only architecture

```mermaid
erDiagram
  BB_ADMIN {
    char ADMIN_ID PK
    varchar LOGIN_NAME UK
    varchar DISPLAY_NAME
    varchar EMAIL UK
    varchar PASSWORD_HASH
    enum STATUS
    int AUTH_VERSION
    timestamp CREATED_AT
    timestamp UPDATED_AT
    timestamp DELETED_AT
  }

  BB_AUTH_TOKEN {
    int AUTH_TOKEN_ID PK
    char ADMIN_ID FK
    enum PURPOSE
    char TOKEN_HASH UK
    timestamp EXPIRES_AT
    timestamp USED_AT
    timestamp CREATED_AT
  }

  BB_PAGE_SECTION {
    int PAGE_ID PK
    json SECTION_DATA
    timestamp CREATED_AT
    timestamp UPDATED_AT
    timestamp DELETED_AT
  }

  BB_CHILD_ACCESS_CODE {
    char ACCESS_CODE PK
    varchar CHILD_NAME
    varchar ENROLLMENT
    boolean IS_ACTIVE
  }

  BB_ADMIN ||--o{ BB_AUTH_TOKEN : owns
```

`BB_PAGE_SECTION` and `BB_CHILD_ACCESS_CODE` are managed by an authenticated admin but have no required database foreign key to the admin account. The public landing page reads page sections without authentication.
