using Microsoft.AspNetCore.Mvc;
using TaxProblem.Web.Models;
using TaxProblem.Web.Services;

namespace TaxProblem.Web.Controllers;

/// <summary>
/// Controlador para gestionar productos (CRUD)
/// Responsabilidad: Orquestar servicios y retornar vistas
/// </summary>
public class ProductsController : Controller
{
    private readonly IProductService _productService;
    private readonly ITaxCalculatorService _taxCalculator;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(
        IProductService productService,
        ITaxCalculatorService taxCalculator,
        ILogger<ProductsController> logger)
    {
        _productService = productService ?? throw new ArgumentNullException(nameof(productService));
        _taxCalculator = taxCalculator ?? throw new ArgumentNullException(nameof(taxCalculator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// GET: Products/Index
    /// Lista todos los productos en una tabla Bootstrap
    /// </summary>
    public async Task<IActionResult> Index()
    {
        try
        {
            var products = await _productService.GetAllProductsAsync();
            return View(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener lista de productos");
            TempData["Error"] = "Error al cargar los productos";
            return RedirectToAction(nameof(Index));
        }
    }

    /// <summary>
    /// GET: Products/Create
    /// Muestra formulario para crear nuevo producto
    /// </summary>
    public IActionResult Create()
    {
        ViewBag.IVARate = _taxCalculator.GetIVARate();
        return View();
    }

    /// <summary>
    /// POST: Products/Create
    /// Guarda nuevo producto con cálculo automático de IVA y total
    /// </summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Name,Quantity,Price")] Product product)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                ViewBag.IVARate = _taxCalculator.GetIVARate();
                return View(product);
            }

            await _productService.CreateProductAsync(product);
            TempData["Success"] = $"Producto '{product.Name}' creado exitosamente";
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear producto");
            ModelState.AddModelError("", "Error al guardar el producto: " + ex.Message);
            ViewBag.IVARate = _taxCalculator.GetIVARate();
            return View(product);
        }
    }

    /// <summary>
    /// GET: Products/Edit/5
    /// Muestra formulario para editar producto existente
    /// </summary>
    public async Task<IActionResult> Edit(long id)
    {
        try
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                TempData["Error"] = "Producto no encontrado";
                return RedirectToAction(nameof(Index));
            }

            ViewBag.IVARate = _taxCalculator.GetIVARate();
            return View(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener producto para editar");
            TempData["Error"] = "Error al cargar el producto";
            return RedirectToAction(nameof(Index));
        }
    }

    /// <summary>
    /// POST: Products/Edit/5
    /// Actualiza producto existente, recalculando IVA y total
    /// </summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(long id, [Bind("Id,Name,Quantity,Price")] Product product)
    {
        if (id != product.Id)
        {
            TempData["Error"] = "ID de producto no válido";
            return RedirectToAction(nameof(Index));
        }

        try
        {
            if (!ModelState.IsValid)
            {
                ViewBag.IVARate = _taxCalculator.GetIVARate();
                return View(product);
            }

            await _productService.UpdateProductAsync(id, product);
            TempData["Success"] = $"Producto '{product.Name}' actualizado exitosamente";
            return RedirectToAction(nameof(Index));
        }
        catch (KeyNotFoundException)
        {
            TempData["Error"] = "Producto no encontrado";
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar producto");
            ModelState.AddModelError("", "Error al actualizar el producto: " + ex.Message);
            ViewBag.IVARate = _taxCalculator.GetIVARate();
            return View(product);
        }
    }

    /// <summary>
    /// GET: Products/Delete/5
    /// Muestra confirmación de eliminación
    /// </summary>
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                TempData["Error"] = "Producto no encontrado";
                return RedirectToAction(nameof(Index));
            }

            return View(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener producto para eliminar");
            TempData["Error"] = "Error al cargar el producto";
            return RedirectToAction(nameof(Index));
        }
    }

    /// <summary>
    /// POST: Products/Delete/5
    /// Elimina producto confirmado
    /// </summary>
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(long id)
    {
        try
        {
            var success = await _productService.DeleteProductAsync(id);
            if (!success)
            {
                TempData["Error"] = "Producto no encontrado";
                return RedirectToAction(nameof(Index));
            }

            TempData["Success"] = "Producto eliminado exitosamente";
            return RedirectToAction(nameof(Index));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar producto");
            TempData["Error"] = "Error al eliminar el producto";
            return RedirectToAction(nameof(Index));
        }
    }
}
