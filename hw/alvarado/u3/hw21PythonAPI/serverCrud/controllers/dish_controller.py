import json
from decimal import Decimal
from datetime import datetime, date, time
from models.database import get_connection


class _Encoder(json.JSONEncoder):
    """Serializes Python types that JSON does not support by default."""
    def default(self, obj):
        if isinstance(obj, Decimal):                return float(obj)
        if isinstance(obj, (datetime, date, time)): return str(obj)
        return super().default(obj)


def _serialize(rows: list) -> list:
    return json.loads(json.dumps([dict(r) for r in rows], cls=_Encoder))


class DishController:
    @staticmethod
    def get_all_dishes() -> list:
        """
        Retrieves all menu dishes along with their category.
        Table: menu_items JOIN menu_categories
        """
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT
                        mi.item_id,
                        mi.name,
                        mi.description,
                        mi.price,
                        mi.is_available,
                        mi.created_at,
                        mc.name AS category_name
                    FROM menu_items mi
                    LEFT JOIN menu_categories mc ON mi.category_id = mc.category_id
                    ORDER BY mi.name ASC
                """)
                return _serialize(cur.fetchall())
        finally:
            conn.close()
