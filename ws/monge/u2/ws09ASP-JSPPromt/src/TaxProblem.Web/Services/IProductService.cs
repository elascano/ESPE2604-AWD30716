using TaxProblem.Web.Models;

namespace TaxProblem.Web.Services;

/// <summary>
/// Servicio para operaciones CRUD de productos
/// Single Responsibility: gestionar persistencia de productos
/// </summary>
public interface IProductService
{
    /// <summary>
    /// Obtiene todos los productos
    /// </summary>
    Task<IEnumerable<Product>> GetAllProductsAsync();

    /// <summary>
    /// Obtiene un producto por su ID
    /// </summary>
    Task<Product?> GetProductByIdAsync(long id);

    /// <summary>
    /// Crea un nuevo producto con cálculos de IVA y total
    /// </summary>
    Task<Product> CreateProductAsync(Product product);

    /// <summary>
    /// Actualiza un producto existente
    /// </summary>
    Task<Product> UpdateProductAsync(long id, Product product);

    /// <summary>
    /// Elimina un producto por su ID
    /// </summary>
    Task<bool> DeleteProductAsync(long id);
}
