/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package controller;

import dao.ProductDAO;
import model.StoreProduct;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import java.io.IOException;
import java.util.List;

@WebServlet("/listProducts")
public class ProductListServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        ProductDAO dao = new ProductDAO();

        List<StoreProduct> products = dao.getAllProducts();

        int totalQuantity = dao.getTotalQuantity();

        request.setAttribute("products", products);
        request.setAttribute("totalQuantity", totalQuantity);

        request.getRequestDispatcher("products.jsp")
                .forward(request, response);
    }
}