package com.products.controller;

import com.products.model.Product;
import com.products.service.ProductService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class ProductController extends HttpServlet {
    private ProductService productService;

    @Override
    public void init() throws ServletException {
        super.init();
        this.productService = new ProductService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                pathInfo = "/list";
            }

            if (pathInfo.equals("/list")) {
                handleListProducts(request, response);
            } else {
                response.sendError(404);
            }
        } catch (Exception e) {
            request.setAttribute("errorMessage", e.getMessage());
            request.getRequestDispatcher("/jsp/error.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                pathInfo = "/create";
            }

            if (pathInfo.equals("/create")) {
                handleCreateProduct(request, response);
            } else if (pathInfo.equals("/update")) {
                handleUpdateProduct(request, response);
            } else if (pathInfo.startsWith("/delete/")) {
                String id = pathInfo.substring(8);
                handleDeleteProduct(id, request, response);
            } else {
                response.sendError(404);
            }
        } catch (Exception e) {
            request.setAttribute("errorMessage", e.getMessage());
            request.getRequestDispatcher("/jsp/error.jsp").forward(request, response);
        }
    }

    private void handleCreateProduct(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            String name = request.getParameter("name");
            String description = request.getParameter("description");
            String category = request.getParameter("category");
            Double weight = Double.parseDouble(request.getParameter("weight"));
            String weightUnit = request.getParameter("weightUnit");
            Double price = Double.parseDouble(request.getParameter("price"));
            Integer quantity = Integer.parseInt(request.getParameter("quantity"));
            String manufacturer = request.getParameter("manufacturer");
            String barcode = request.getParameter("barcode");

            Product product = new Product(name, description, category, weight, weightUnit,
                    price, quantity, manufacturer, barcode);

            productService.createProduct(product);

            request.setAttribute("successMessage", "Product created successfully");
            handleListProducts(request, response);
        } catch (IllegalArgumentException e) {
            request.setAttribute("errorMessage", "Validation error: " + e.getMessage());
            request.getRequestDispatcher("/jsp/form.jsp").forward(request, response);
        } catch (Exception e) {
            request.setAttribute("errorMessage", "Error creating product: " + e.getMessage());
            request.getRequestDispatcher("/jsp/error.jsp").forward(request, response);
        }
    }

    private void handleUpdateProduct(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            String id = request.getParameter("id");
            if (id == null || id.trim().isEmpty()) {
                request.setAttribute("errorMessage", "Product ID is required");
                handleListProducts(request, response);
                return;
            }

            Product product = productService.getProductById(id);
            if (product == null) {
                request.setAttribute("errorMessage", "Product not found");
                handleListProducts(request, response);
                return;
            }

            if (request.getParameter("name") != null) {
                product.setName(request.getParameter("name"));
            }
            if (request.getParameter("description") != null) {
                product.setDescription(request.getParameter("description"));
            }
            if (request.getParameter("category") != null) {
                product.setCategory(request.getParameter("category"));
            }
            if (request.getParameter("weight") != null) {
                product.setWeight(Double.parseDouble(request.getParameter("weight")));
            }
            if (request.getParameter("weightUnit") != null) {
                product.setWeightUnit(request.getParameter("weightUnit"));
            }
            if (request.getParameter("price") != null) {
                product.setPrice(Double.parseDouble(request.getParameter("price")));
            }
            if (request.getParameter("quantity") != null) {
                product.setQuantity(Integer.parseInt(request.getParameter("quantity")));
            }
            if (request.getParameter("manufacturer") != null) {
                product.setManufacturer(request.getParameter("manufacturer"));
            }
            if (request.getParameter("barcode") != null) {
                product.setBarcode(request.getParameter("barcode"));
            }

            productService.updateProduct(product);
            request.setAttribute("successMessage", "Product updated successfully");
            handleListProducts(request, response);
        } catch (IllegalArgumentException e) {
            request.setAttribute("errorMessage", "Validation error: " + e.getMessage());
            handleListProducts(request, response);
        } catch (Exception e) {
            request.setAttribute("errorMessage", "Error updating product: " + e.getMessage());
            request.getRequestDispatcher("/jsp/error.jsp").forward(request, response);
        }
    }

    private void handleDeleteProduct(String id, HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            Product product = productService.getProductById(id);
            if (product == null) {
                request.setAttribute("errorMessage", "Product not found");
                handleListProducts(request, response);
                return;
            }
            productService.deleteProduct(id);
            request.setAttribute("successMessage", "Product deleted successfully");
            handleListProducts(request, response);
        } catch (Exception e) {
            request.setAttribute("errorMessage", "Error deleting product: " + e.getMessage());
            request.getRequestDispatcher("/jsp/error.jsp").forward(request, response);
        }
    }

    private void handleListProducts(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            String category = request.getParameter("category");
            List<Product> products;

            if (category != null && !category.isEmpty()) {
                products = productService.getProductsByCategory(category);
            } else {
                products = productService.getAllProducts();
            }

            request.setAttribute("products", products);
            request.getRequestDispatcher("/jsp/table.jsp").forward(request, response);
        } catch (Exception e) {
            request.setAttribute("errorMessage", "Error loading products: " + e.getMessage());
            request.getRequestDispatcher("/jsp/error.jsp").forward(request, response);
        }
    }
}
