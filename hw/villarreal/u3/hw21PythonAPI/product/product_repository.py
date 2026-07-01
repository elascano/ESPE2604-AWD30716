from typing import List, Optional
from sqlmodel import Session, select
from .models import Product, ProductCreate, ProductUpdate

class ProductRepository:
    def find_all(self, session: Session, categoryId: Optional[int] = None) -> List[Product]:
        statement = select(Product)
        if categoryId is not None:
            statement = statement.where(Product.categoryId == categoryId)
        statement = statement.order_by(Product.id)
        return session.exec(statement).all()

    def find_by_id(self, session: Session, product_id: int) -> Optional[Product]:
        return session.get(Product, product_id)

    def create(self, session: Session, product_data: ProductCreate) -> Product:
        db_product = Product.model_validate(product_data)
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product

    def update(self, session: Session, product_id: int, product_data: ProductUpdate) -> Optional[Product]:
        db_product = session.get(Product, product_id)
        if not db_product:
            return None
        
        update_data = product_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
            
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product

    def update_stock(self, session: Session, product_id: int, stock: int) -> Optional[Product]:
        db_product = session.get(Product, product_id)
        if not db_product:
            return None
        
        db_product.stock = stock
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product

    def remove(self, session: Session, product_id: int) -> bool:
        db_product = session.get(Product, product_id)
        if not db_product:
            return False
            
        session.delete(db_product)
        session.commit()
        return True

product_repository = ProductRepository()
