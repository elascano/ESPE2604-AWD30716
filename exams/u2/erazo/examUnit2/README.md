# Cellphone API — Two Backends

Serverless AWS Lambda API (SST + Bun + Mongoose) with two independent API Gateways:

- **CellphoneStack**: CRUD operations for cellphones
- **BusinessStack**: Business rules (sort by price, count)

Each stack creates its own `sst.aws.ApiGatewayV2`, so deployment returns two URLs: `CellphoneApiUrl` and `BusinessApiUrl`.

## Cellphone Model

| Field | Type | Description |
|-------|------|-------------|
| `serial_number` | String (unique) | Serial number provided by user |
| `price` | Number | Price in dollars |
| `model` | String | Model name |
| `year_launched` | Number | Launch year |
| `brand` | String | Brand name |
| `camera_quality` | String | Free text (e.g. "good", "great") |

Collection: `cellphones` in database `examUnit2`

## Folder Structure

```
examUnit2/
  sst.config.ts
  stacks/
    CellphoneStack.ts
    BusinessStack.ts
  packages/functions/src/
    cellphone/
      bootstrap.ts
      createCellphone.ts
      listCellphones.ts
      controllers/
        CellphoneController.ts
      repositories/
        CellphoneRepository.ts
      services/
        CellphoneService.ts
    business/
      bootstrap.ts
      sortByPrice.ts
      sortByPriceDesc.ts
      countCellphones.ts
      controllers/
        BusinessController.ts
      services/
        BusinessService.ts
    shared/
      database/
        mongoose.ts
      errors/
        ApplicationError.ts
      http/
        request.ts
        response.ts
      models/
        Cellphone.ts
```

## Endpoints

### CellphoneStack (Backend 1)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/cellphone` | Create a cellphone |
| `GET` | `/api/cellphone` | List all cellphones |

### BusinessStack (Backend 2)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/cellphone/priceSortedAscendent` | All cellphones sorted by price ascending |
| `GET` | `/api/cellphone/priceSortedDescendent` | All cellphones sorted by price descending |
| `GET` | `/api/cellphone/count` | Total count of cellphones |

## Environment

Create `.env` with:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.vkglsoo.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=examUnit2
```

## Deploy

```bash
bun install
sst deploy --stage production
```
