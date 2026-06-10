# WS16 EndPoints - Torres Dance Store

Student: Carlos Alexander Torres Pincay

Port: `3016`

## Purpose

Build REST endpoints with Express and MongoDB for a custom store resource. This version uses dance items so it is different from the classmates' food and fruit examples.

## Run

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3016/
```

## Main URIs

| Method | URI | Description |
| --- | --- | --- |
| GET | `/api/health` | Shows server/database status and endpoint list. |
| GET | `/torresstore/items` | Lists all dance store items. |
| GET | `/torresstore/item/1601` | Finds one item by numeric id. |
| GET | `/torresstore/items/category/footwear` | Filters items by category. |
| POST | `/torresstore/item` | Creates a new item when MongoDB is connected. |

## Evidence

Screenshots were captured in:

- `evidence/ws16-dashboard.png`
- `evidence/ws16-health.png`
- `evidence/ws16-items.png`

## Notes

If MongoDB is not reachable from the current network, the server starts in demo mode so the GET endpoints still work for browser evidence.
