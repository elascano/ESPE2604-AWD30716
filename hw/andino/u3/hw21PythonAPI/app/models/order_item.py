from sqlalchemy import ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column("order_item_id", Integer, primary_key=True)
    order_id: Mapped[str] = mapped_column(String, ForeignKey("orders.order_id"))
    item_id: Mapped[str] = mapped_column(String)
    quantity: Mapped[int] = mapped_column(Integer)
    price_at_purchase: Mapped[float] = mapped_column(Numeric)

    order = relationship("Order", back_populates="items")