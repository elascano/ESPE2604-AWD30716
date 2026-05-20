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

@WebServlet("/saveProduct")
public class SaveProductServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        int id = Integer.parseInt(request.getParameter("id"));
        String name = request.getParameter("name");
        int quantity = Integer.parseInt(request.getParameter("quantity"));

        StoreProduct product = new StoreProduct(id, name, quantity);

        ProductDAO dao = new ProductDAO();
        dao.saveProduct(product);

        response.sendRedirect("index.jsp");
    }
}