import os
import json
from decimal import Decimal
from datetime import datetime, date, time

import httpx
import psycopg2
import psycopg2.extras
from fastapi import HTTPException, status
from dotenv import load_dotenv

load_dotenv()

CRUD_BASE_URL = os.getenv("CRUD_SERVER_URL", "http://localhost:3000")


class _Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):                return float(obj)
        if isinstance(obj, (datetime, date, time)): return str(obj)
        return super().default(obj)


def _get_conn():
    return psycopg2.connect(
        os.getenv("DATABASE_URL"),
        cursor_factory=psycopg2.extras.RealDictCursor,
        sslmode="require"
    )


class IngredientBLController:

    @staticmethod
    def _classify_stock(current: float, reorder: float) -> tuple:
        """
        Regla de negocio: clasifica el estado del stock según el nivel de reorden.
          >= 75 % del nivel de reorden → OK
          25 % – 74 %                  → BAJO
          < 25 %                       → CRITICO
        """
        if reorder == 0:
            return 100.0, "OK"
        pct = round((current / reorder) * 100, 1)
        if pct < 25:
            stock_status = "CRITICO"
        elif pct < 75:
            stock_status = "BAJO"
        else:
            stock_status = "OK"
        return pct, stock_status

    @classmethod
    async def get_ingredient_detail(cls, sku_code: str) -> dict:
        """
        Flujo:
        1. Llama al CRUD server para obtener los datos base del ingrediente.
        2. Consulta la tabla inventory directamente para datos de stock.
        3. Aplica la regla de negocio de clasificación de stock.
        4. Retorna la respuesta enriquecida.
        """

        # ── 1. Datos base desde el CRUD server ─────────────────────────
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{CRUD_BASE_URL}/ops/ingredients/{sku_code}",
                    timeout=5.0
                )
            except httpx.RequestError as ex:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=f"CRUD server no disponible en {CRUD_BASE_URL}. Detalle: {str(ex)}"
                )

        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail=f"Ingrediente con SKU '{sku_code}' no encontrado."
            )
        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"CRUD server respondió con error {response.status_code}."
            )

        ingredient = response.json()

        # ── 2. Datos de inventario desde la BD ──────────────────────────
        conn = _get_conn()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT current_stock, reorder_level, supplier, expiry_date
                    FROM inventory
                    WHERE sku_code = %s
                    ORDER BY updated_at DESC
                    LIMIT 1
                """, (sku_code,))
                inv_row = cur.fetchone()
        finally:
            conn.close()

        # ── 3. Regla de negocio: clasificar estado de stock ─────────────
        if inv_row:
            inv = json.loads(json.dumps(dict(inv_row), cls=_Encoder))
            current = float(inv["current_stock"])
            reorder = float(inv["reorder_level"])
            pct, stock_status = cls._classify_stock(current, reorder)
            supplier    = inv.get("supplier")
            expiry_date = inv.get("expiry_date")
        else:
            current = reorder = pct = None
            stock_status = "SIN_INVENTARIO"
            supplier = expiry_date = None

        # ── 4. Respuesta enriquecida ────────────────────────────────────
        return {
            **ingredient,
            "current_stock":    current,
            "reorder_level":    reorder,
            "stock_percentage": pct,
            "stock_status":     stock_status,
            "supplier":         supplier,
            "expiry_date":      expiry_date,
        }
