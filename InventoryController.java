package com.encora.esteban.inventory.manager.be.controller;
import com.encora.esteban.inventory.manager.be.model.Product;

import com.encora.esteban.inventory.manager.be.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PutMapping;


import java.util.Map;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final ProductService productService;

    public InventoryController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public Map<String, Object> getProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy, // ✅ Accept sortBy
            @RequestParam(defaultValue = "asc") String sortOrder // ✅ Accept sortOrder
    ) {
        return productService.getProducts(name, category, inStock, page, size, sortBy, sortOrder);
    }



    // ✅ ADD THIS DELETE MAPPING
    @DeleteMapping("/products/{id}")

    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProductById(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build(); // 404 if product doesn't exist
        }
    }

    // ✅ ADD THIS EDIT MAPPING
    @PutMapping("/products/{id}")
    public ResponseEntity<Void> updateProduct(
            @PathVariable Long id,
            @RequestBody Product updatedProduct) {
        boolean updated = productService.updateProduct(id, updatedProduct);

        if (updated) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build(); // 404 if product doesn't exist
        }
    }



    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        System.out.println("Received Product: " + product); // Log received product

        if (product.getName().length() > 120) {
            return ResponseEntity.badRequest().body(null); // Name too long
        }
        if (product.getUnitPrice() <= 0) {
            return ResponseEntity.badRequest().body(null); // Price must be positive
        }

        if (product.getQuantityInStock() < 0) {
            return ResponseEntity.badRequest().body(null); // Stock cannot be negative
        }
        if ("Food".equalsIgnoreCase(product.getCategory()) && product.getExpirationDate() == null) {
            return ResponseEntity.badRequest().build(); // Return error if food product doesn't have an expiration date
        }

        Product savedProduct = productService.addProduct(product);
        System.out.println("Saved Product: " + savedProduct);
        return ResponseEntity.ok(savedProduct);
    }



    @PostMapping("/products/{id}/outofstock")
    public ResponseEntity<Void> markOutOfStock(@PathVariable Long id) {
        boolean updated = productService.markProductOutOfStock(id);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/products/{id}/instock")
    public ResponseEntity<Void> restoreStock(@PathVariable Long id) {
        boolean updated = productService.restoreProductStock(id);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

}
