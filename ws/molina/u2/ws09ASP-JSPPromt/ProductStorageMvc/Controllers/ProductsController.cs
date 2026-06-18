using Microsoft.AspNetCore.Mvc;
using ProductStorageMvc.Services;
using ProductStorageMvc.ViewModels;

namespace ProductStorageMvc.Controllers
{
    public class ProductsController : Controller
    {
        private readonly ProductService _productService;

        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View(new ProductCreateViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ProductCreateViewModel viewModel)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.ErrorMessage = "Please check the entered data before saving the product.";
                return View(viewModel);
            }

            try
            {
                await _productService.CreateProductAsync(viewModel);
                ModelState.Clear();
                ViewBag.SuccessMessage = "Product saved successfully.";
                return View(new ProductCreateViewModel());
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = $"Save error: {ex.Message}";
                return View(viewModel);
            }
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            ProductListViewModel viewModel = await _productService.GetProductListAsync();
            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(ProductEditViewModel viewModel)
        {
            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Please check the entered data before updating the product.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                bool updated = await _productService.UpdateProductAsync(viewModel);
                TempData[updated ? "SuccessMessage" : "ErrorMessage"] = updated
                    ? "Product updated successfully."
                    : "The selected product was not found.";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"Update error: {ex.Message}";
            }

            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                bool deleted = await _productService.DeleteProductAsync(id);
                TempData[deleted ? "SuccessMessage" : "ErrorMessage"] = deleted
                    ? "Product deleted successfully."
                    : "The selected product was not found.";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"Delete error: {ex.Message}";
            }

            return RedirectToAction(nameof(Index));
        }
    }
}
