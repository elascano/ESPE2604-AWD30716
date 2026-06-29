from datetime import datetime
from sqlalchemy import String, Numeric, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Order(Base):
    __tablename__ = "orders"

    order_id: Mapped[str] = mapped_column(String, primary_key=True)
    user_id: Mapped[str | None] = mapped_column(String, nullable=True)
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str | None] = mapped_column(String, nullable=True) 
    delivery_type: Mapped[str] = mapped_column(String, nullable=False)
    delivery_address: Mapped[str | None] = mapped_column(Text, nullable=True) 
    special_instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan", lazy="selectin")