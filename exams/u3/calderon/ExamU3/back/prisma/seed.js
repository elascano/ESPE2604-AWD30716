const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  
  console.log('Deleted existing products.');

  const products = [
    {
      name: 'MacBook Pro 16"',
      description: 'Apple M3 Max Chip, 36GB Unified Memory, 1TB SSD, Space Black',
      price: 3499.99,
      category: 'Laptop'
    },
    {
      name: 'Dell XPS 15 9530',
      description: 'Intel Core i9-13900H, 32GB DDR5 RAM, 1TB NVMe SSD, RTX 4070, 15.6" OLED Touchscreen',
      price: 2199.99,
      category: 'Laptop'
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon Gen 11',
      description: 'Intel Core i7-1365U, 16GB RAM, 512GB NVMe SSD, 14" WUXGA Display, Win 11 Pro',
      price: 1549.99,
      category: 'Laptop'
    },
    {
      name: 'ASUS ROG Strix G16',
      description: 'Intel Core i7-13650HX, 16GB RAM, 1TB SSD, NVIDIA GeForce RTX 4060, 16" 165Hz FHD+',
      price: 1299.99,
      category: 'Laptop'
    },
    {
      name: 'HP Pavilion Desktop',
      description: 'AMD Ryzen 7 5700G, 16GB RAM, 512GB SSD, AMD Radeon Graphics, Keyboard & Mouse',
      price: 699.99,
      category: 'Desktop'
    },
    {
      name: 'Custom Gaming PC Build',
      description: 'AMD Ryzen 9 7900X, 32GB DDR5, RTX 4080 Super 16GB, 2TB NVMe PCIe 4.0 SSD, Liquid Cooling',
      price: 2599.99,
      category: 'Desktop'
    },
    {
      name: 'iMac 24-inch',
      description: 'Apple M3 Chip with 8-core CPU and 10-core GPU, 8GB Unified Memory, 256GB SSD, Blue',
      price: 1299.99,
      category: 'Desktop'
    }
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: product
    });
    console.log(`Created product: ${created.name} (ID: ${created.id})`);
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
