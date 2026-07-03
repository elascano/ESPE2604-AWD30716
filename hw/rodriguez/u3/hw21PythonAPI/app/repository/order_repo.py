from app.models.order import Order
from app.schemas.order import OrderCreate, OrderUpdate

async def find_all(db=None) -> list[Order]:
    return await Order.find_all().to_list()

async def find_one(db, order_id: str) -> Order | None:
    return await Order.get(order_id)

async def create(db, data: OrderCreate) -> Order:
    order = Order(
        id=data.order_id,
        user_id=data.user_id,
        total_amount=data.total_amount,
        status=data.status,
        delivery_type=data.delivery_type,
        delivery_address=data.delivery_address,
        special_instructions=data.special_instructions,
        items=[]
    )
    await order.insert()
    return order

async def update(db, order_id: str, data: OrderUpdate) -> Order | None:
    order = await Order.get(order_id)
    if order is None:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(order, key, value)
    await order.save()
    return order

async def remove(db, order_id: str) -> bool:
    order = await Order.get(order_id)
    if order is None:
        return False
    await order.delete()
    return True
