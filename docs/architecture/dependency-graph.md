# DevShelf Dependency Graph

These diagrams represent relationships verified from the current repository.

## Workspace and runtime relationship

```mermaid
flowchart LR
    Root[Root npm workspace] --> Client[client package]
    Root --> Server[server package]
    Client --> Browser[Browser]
    Client -->|REST /api/v1| Server
    Server --> Auth[auth.js]
    Server --> Cache[cache.js]
    Server --> Store[store.js]
    Server -. intended persistence .-> Models[Mongoose models]
    Models -. intended connection .-> Mongo[MongoDB Compose service]
```

## Public request flow

```mermaid
sequenceDiagram
    participant Browser
    participant Client as React client
    participant API as Express API
    participant Cache as MemoryCache
    participant Store as Demo store

    Browser->>Client: Search/filter resources
    Client->>API: GET /api/v1/resources
    API->>Cache: Read query cache key
    alt cache hit
        Cache-->>API: Cached page
    else cache miss
        API->>Store: Filter published resources
        Store-->>API: Paginated page
        API->>Cache: Store page with TTL
    end
    API-->>Client: JSON response envelope
    Client-->>Browser: Render resource cards
```

## Contribution and publishing flow

```mermaid
flowchart LR
    Contributor[Contributor] --> Form[Submission form]
    Form --> API[POST /submissions]
    API --> Submitted[submitted state]
    Admin[Admin] --> Queue[Admin queue]
    Queue -->|approve| Approved[approved state]
    Queue -->|request changes| Changes[changes_requested state]
    Approved -->|publish| Public[Published resource]
    Public --> Invalidate[Invalidate resources:* cache]
    Invalidate --> Explore[Public Explore API]
    Changes -. backend update/submit endpoints exist .-> Form
```

## CI dependency relationship

```mermaid
flowchart TB
    PR[Pull request or branch push] --> Install[npm ci]
    Install --> Build[build.yml]
    Install --> Test[test.yml]
    Install --> Security[security-scan.yml]
    Build --> Review[Review gate]
    Test --> Review
    Security --> Review
```

The existing `.github/workflows/ci.yml` remains as a combined legacy validation workflow; the separated workflows provide explicit governance checks without changing application code.
