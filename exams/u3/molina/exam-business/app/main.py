import httpx
from fastapi import FastAPI, Request, status
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.clients.crud_client import crud_client
from app.config import settings
from app.controllers.items import router as items_router

app = FastAPI(
    title="Exam Business API",
    version="1.0.0",
    description="Business rules service. Frontend must communicate with this API.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items_router)


@app.exception_handler(RuntimeError)
async def runtime_error_handler(_: Request, exc: RuntimeError):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": str(exc)},
    )


@app.get("/", tags=["System"])
async def root():
    return {"message": "Business API running", "docs": "/docs"}


@app.get("/health", tags=["System"])
async def health():
    crud_status = "offline"
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            response = await client.get(f"{crud_client.base_url}/health")
            if response.status_code == 200:
                crud_status = "connected"
    except httpx.RequestError:
        pass

    return {
        "status": "healthy" if crud_status == "connected" else "degraded",
        "service": "business",
        "crud_api": crud_status,
        "crud_url": crud_client.base_url,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT)
