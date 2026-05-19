package com.almacen.controller;

import com.almacen.dao.ProductDAO;
import com.almacen.model.Product;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/products")
public class ProductController extends HttpServlet {
    private ProductDAO productDAO;

    @Override
    public void init() throws ServletException {
        productDAO = new ProductDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String action = request.getParameter("action");
        
        if ("save".equals(action)) {
            String name = request.getParameter("name");
            int quantity = Integer.parseInt(request.getParameter("quantity"));
            double price = Double.parseDouble(request.getParameter("price"));
            
            Product p = new Product(name, quantity, price);
            productDAO.insertProduct(p);
            
            response.sendRedirect("products?action=list");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        
        if ("list".equals(action)) {
            List<Product> products = productDAO.getAll();
            
            double totalWarehouseValue = 0;
            int totalQuantity = 0;
            
            for (Product p : products) {
                totalWarehouseValue += p.getTotal();
                totalQuantity += p.getQuantity();
            }
            
            double weightedAveragePrice = 0;
            if (totalQuantity > 0) {
                weightedAveragePrice = totalWarehouseValue / totalQuantity;
            }
            
            request.setAttribute("products", products);
            request.setAttribute("totalWarehouseValue", totalWarehouseValue);
            request.setAttribute("totalQuantity", totalQuantity);
            request.setAttribute("weightedAveragePrice", weightedAveragePrice);
            
            request.getRequestDispatcher("/WEB-INF/results.jsp").forward(request, response);
        } else {
            // Default to insert page
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }
}
