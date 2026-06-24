# API source structure

The API uses a feature-first NestJS structure:

```text
src/
├── config/             # Environment parsing and validation
├── infrastructure/     # External systems shared by feature modules
│   ├── clickhouse/
│   └── database/
├── modules/            # Business features
│   ├── auth/
│   ├── dashboard/
│   └── prime/
│       └── sales/      # Prime sales dashboard API
├── app.module.ts       # Application composition root
└── main.ts             # HTTP bootstrap
```

Keep controllers, services, DTOs, repositories, and feature-specific types
inside their feature folder. Put a dependency in `infrastructure/` only when it
wraps an external system and is shared by multiple feature modules.
