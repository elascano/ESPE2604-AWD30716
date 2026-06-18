using Microsoft.EntityFrameworkCore;
using TaxProblem.Web.Data;
using TaxProblem.Web.Models;

namespace TaxProblem.Web.Services;

/// <summary>
/// Implementación del servicio CRUD de productos
/// Coordina: Persistencia (DbContext) + Cálculo de impuestos (ITaxCalculatorService)
/// </summary>
public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;
    private readonly ITaxCalculatorService _taxCalculator;

    public ProductService(ApplicationDbContext context, ITaxCalculatorService taxCalculator)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _taxCalculator = taxCalculator ?? throw new ArgumentNullException(nameof(taxCalculator));
    }

    /// <summary>
    /// Obtiene todos los productos ordenados por fecha de creación (descendente)
    /// </summary>
    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _context.Products
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Obtiene un producto específico por ID
    /// </summary>
    public async Task<Product?> GetProductByIdAsync(long id)
    {
        if (id <= 0)
            throw new ArgumentException("El ID debe ser mayor a cero", nameof(id));

        return await _context.Products.FindAsync(id);
    }

    /// <summary>
    /// Crea un nuevo producto calculando automáticamente IVA y total
    /// </summary>
    public async Task<Product> CreateProductAsync(Product product)
    {
        if (product == null)
            throw new ArgumentNullException(nameof(product));

        // Calcular impuestos
        var (subtotal, iva, total) = _taxCalculator.CalculateTax(product.Price, product.Quantity);

        // Asignar valores calculados
        product.Subtotal = subtotal;
        product.IVA = iva;
        product.Total = total;
        product.CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);

        // Guardar en base de datos
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return product;
    }

    /// <summary>
    /// Actualiza un producto existente, recalculando IVA y total
    /// </summary>
    public async Task<Product> UpdateProductAsync(long id, Product product)
    {
        if (id <= 0)
            throw new ArgumentException("El ID debe ser mayor a cero", nameof(id));

        if (product == null)
            throw new ArgumentNullException(nameof(product));

        var existingProduct = await _context.Products.FindAsync(id);
        if (existingProduct == null)
            throw new KeyNotFoundException($"Producto con ID {id} no encontrado");

        // Actualizar campos
        existingProduct.Name = product.Name;
        existingProduct.Quantity = product.Quantity;
        existingProduct.Price = product.Price;

        // Recalcular impuestos
        var (subtotal, iva, total) = _taxCalculator.CalculateTax(product.Price, product.Quantity);
        existingProduct.Subtotal = subtotal;
        existingProduct.IVA = iva;
        existingProduct.Total = total;

        _context.Products.Update(existingProduct);
        await _context.SaveChangesAsync();

        return existingProduct;
    }

    /// <summary>
    /// Elimina un producto por ID
    /// </summary>
    public async Task<bool> DeleteProductAsync(long id)
    {
        if (id <= 0)
            throw new ArgumentException("El ID debe ser mayor a cero", nameof(id));

        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return true;
    }
}
