# HW18 Customer Table - Three VM Architecture

This package contains three separated projects for the Azure IaaS deployment:

```text
hw18-fe             -> hw18-frontend-vue
hw18-business-be    -> hw18-business-backend
hw18-data-be        -> hw18-data-backend
```

## Real communication flow

```text
Browser / Postman
    -> Frontend VM (Nginx + Vue)
    -> Business Backend VM (Express business rules)
    -> Data Backend VM (Express + Mongoose + MongoDB)
    -> MongoDB database
```

## Environment variables by VM

Only `hw18-data-backend` connects directly to MongoDB.

```text
hw18-data-backend:      MONGODB_URI
hw18-business-backend:  DATA_API_BASE_URL=http://10.0.0.6:4010/computerstore
hw18-frontend-vue:      VITE_BUSINESS_API_BASE_URL=/computerstore
```

See `docs/endpoints.md` before deploying.
