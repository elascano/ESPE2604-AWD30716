import json
from decimal import Decimal
from datetime import datetime, date, time
from fastapi import HTTPException
from models.database import get_connection


class _Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):                return float(obj)
        if isinstance(obj, (datetime, date, time)): return str(obj)
        return super().default(obj)


class IngredientController:
    @staticmethod
    def get_by_sku(sku_code: str) -> dict:
        """
        Returns base ingredient data by SKU.
        Table: ingredients
        Used internally by the BL server.
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT sku_code, name, category, description,
                           unit_of_measurement, unit_cost
                    FROM ingredients
                    WHERE sku_code = %s
                """, (sku_code,))
                row = cur.fetchone()
                if not row:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Ingredient with SKU '{sku_code}' not found."
                    )
                return json.loads(json.dumps(dict(row), cls=_Encoder))
        finally:
            conn.close()
