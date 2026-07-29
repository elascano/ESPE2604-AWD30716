import asyncio
from prisma import Prisma

async def main():
    prisma_client = Prisma()
    await prisma_client.connect()
    await prisma_client.product.delete_many()

    products = [
        {
            "name": "Bread",
            "description": "Pan fresco recién horneado.",
            "price": 2.50,
            "stock": 50,
            "image_url": "https://example.com/bread.jpg"
        },
        {
            "name": "Milk",
            "description": "Leche entera fresca de granja.",
            "price": 3.20,
            "stock": 40,
            "image_url": "https://example.com/milk.jpg"
        },
        {
            "name": "Eggs",
            "description": "Docena de huevos de campo libres de jaula.",
            "price": 4.50,
            "stock": 30,
            "image_url": "https://example.com/eggs.jpg"
        },
        {
            "name": "Cheese",
            "description": "Queso cheddar maduro.",
            "price": 5.00,
            "stock": 25,
            "image_url": "https://example.com/cheese.jpg"
        }
    ]

    print("Inserting general products...")
    for product_data in products:
        product = await prisma_client.product.create(data=product_data)
        print(f"Product created: {product.name} (ID: {product.id})")

    print("Data inserted successfully.")
    await prisma_client.disconnect()

if __name__ == '__main__':
    asyncio.run(main())
