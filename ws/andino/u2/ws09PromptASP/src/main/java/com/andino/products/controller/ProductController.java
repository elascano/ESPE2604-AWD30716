package com.andino.products.controller;

import com.andino.products.model.Product;
import com.andino.products.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

import java.util.Arrays;
import java.util.List;

@Controller
public class ProductController {

    private final ProductRepository productRepository;

    @Autowired
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/")
    public String showProducts(Model model) {
        List<Product> products = productRepository.findAll();
        
        double totalPrice = products.stream()
                                    .mapToDouble(p -> p.getPrice() != null ? p.getPrice() : 0.0)
                                    .sum();
                                    
        List<String> categories = Arrays.asList("Beverages", "Snacks", "Dairy", "Candies", "Bakery");
        
        model.addAttribute("products", products);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("categories", categories);
        
        model.addAttribute("product", new Product());
        
        return "products"; 
    }

    @PostMapping("/add")
    public String addProduct(@Valid @ModelAttribute Product product, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            List<Product> products = productRepository.findAll();
            double totalPrice = products.stream()
                                        .mapToDouble(p -> p.getPrice() != null ? p.getPrice() : 0.0)
                                        .sum();
            List<String> categories = Arrays.asList("Beverages", "Snacks", "Dairy", "Candies", "Bakery");
            
            model.addAttribute("products", products);
            model.addAttribute("totalPrice", totalPrice);
            model.addAttribute("categories", categories);
            
            return "products";
        }

        productRepository.save(product);

        return "redirect:/";
    }
}
