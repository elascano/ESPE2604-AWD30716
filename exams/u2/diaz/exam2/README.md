Netbeans, Visual Studio, any code

# Environment setup

This project uses local `.env` files for secrets and configuration. The repository includes example files to help configure each service without committing real credentials.

- Use `.env.example` at the repository root for shared deployment-related variables.
- Use `crud/.env.example` for the CRUD service.
- Use `business-logic/.env.example` for the business logic service.

Do not commit `.env` files; they are ignored by `.gitignore`.

# Multiple environments

If you add SST stages or different deployment environments, keep separate stage-specific configs and secrets.

Example with SST stages:

- `bunx sst deploy --stage dev`
- `bunx sst deploy --stage prod`

This creates separate resources such as `chickens-dev` and `chickens-prod`.

If you split the repo into separate deployable services, each service can have its own `sst.config.ts`:

```
proyecto/
├── crud/
│   ├── package.json
│   └── sst.config.ts
└── rules/
   ├── package.json
   └── sst.config.ts
```

Then deploy each one separately:

```
cd crud
bunx sst deploy
cd ../rules
bunx sst deploy
```

#Link to the project in the cloud: https://fabula-dental-managment.onrender.com