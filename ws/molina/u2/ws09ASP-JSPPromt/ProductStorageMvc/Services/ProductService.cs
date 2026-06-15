using Microsoft.EntityFrameworkCore;
using ProductStorageMvc.Data;
using ProductStorageMvc.Models;
using ProductStorageMvc.ViewModels;

namespace ProductStorageMvc.Services
{
    public class ProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateProductAsync(ProductCreateViewModel viewModel)
        {
            Product product = new Product
            {
                Name = viewModel.Name.Trim(),
                Price = viewModel.Price,
                Quantity = viewModel.Quantity
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task<ProductListViewModel> GetProductListAsync()
        {
            List<Product> products = await _context.Products
                .AsNoTracking()
                .OrderBy(product => product.Id)
                .ToListAsync();

            ProductListViewModel viewModel = new ProductListViewModel();

            foreach (Product product in products)
            {
                decimal totalValue = product.Price * product.Quantity;

                viewModel.Products.Add(new ProductRowViewModel
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    Quantity = product.Quantity,
                    TotalValue = totalValue
                });
            }

            viewModel.TotalQuantity = viewModel.Products.Sum(product => product.Quantity);
            viewModel.TotalInventoryValue = viewModel.Products.Sum(product => product.TotalValue);

            return viewModel;
        }

        public async Task<bool> UpdateProductAsync(ProductEditViewModel viewModel)
        {
            int affectedRows = await _context.Products
                .Where(product => product.Id == viewModel.Id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(product => product.Name, viewModel.Name.Trim())
                    .SetProperty(product => product.Price, viewModel.Price)
                    .SetProperty(product => product.Quantity, viewModel.Quantity));

            return affectedRows > 0;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            int affectedRows = await _context.Products
                .Where(product => product.Id == id)
                .ExecuteDeleteAsync();

            return affectedRows > 0;
        }
    }
}
