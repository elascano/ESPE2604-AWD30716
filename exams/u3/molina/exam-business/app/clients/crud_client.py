from typing import Any
from urllib.parse import urlencode

import httpx

from app.config import settings


class CrudClient:
    def __init__(self, base_url: str = settings.CRUD_API_URL):
        self.base_url = base_url.rstrip("/")

    async def request(
        self,
        method: str,
        path: str,
        json: dict[str, Any] | None = None,
    ) -> Any:
        url = f"{self.base_url}/{path.lstrip('/')}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.request(method, url, json=json)
        except httpx.RequestError as exc:
            raise RuntimeError(f"CRUD API is unavailable: {exc}") from exc

        if response.status_code == 404:
            return None

        if response.status_code >= 400:
            try:
                detail = response.json().get("detail", "CRUD API error")
            except ValueError:
                detail = response.text or "CRUD API error"
            raise RuntimeError(detail)

        if response.status_code == 204:
            return None

        return response.json()

    async def list_items(self):
        return await self.request("GET", "/items")

    async def search_items(self, query: str):
        params = urlencode({"q": query})
        return await self.request("GET", f"/items/search?{params}")

    async def get_item(self, item_id: str):
        return await self.request("GET", f"/items/{item_id}")

    async def create_item(self, data: dict):
        return await self.request("POST", "/items", json=data)

    async def update_item(self, item_id: str, data: dict):
        return await self.request("PUT", f"/items/{item_id}", json=data)

    async def delete_item(self, item_id: str):
        return await self.request("DELETE", f"/items/{item_id}")


crud_client = CrudClient()
