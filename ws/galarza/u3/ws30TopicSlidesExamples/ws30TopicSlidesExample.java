import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    // Simulates an in-memory database
    private final List<Product> database = List.of(
            new Product("1", "Laptop", 1200.0),
            new Product("2", "Mechanical Keyboard", 150.0),
            new Product("3", "4K Monitor", 400.0)
    );

    /**
     * Mono<T>: Returns 0 or 1 element.
     * Ideal for lookups by ID. The thread does not block while waiting.
     */
    @GetMapping("/{id}")
    public Mono<Product> getProduct(@PathVariable String id) {
        return Mono.justOrEmpty(
                database.stream()
                        .filter(p -> p.getId().equals(id))
                        .findFirst()
        );
    }

    /**
     * Flux<T>: Returns 0 to N elements.
     * In this example, we simulate a 1-second delay for each element.
     * Instead of waiting 3 seconds to send a complete list,
     * WebFlux will send the elements to the client one by one (Streaming).
     */
    @GetMapping(value = "/streaming", produces = "text/event-stream")
    public Flux<Product> getProductsStreaming() {
        return Flux.fromIterable(database)
                   .delayElements(Duration.ofSeconds(1)); // Simulates latency
    }
}

// Example model class
class Product {
    private String id;
    private String name;
    private Double price;

    public Product(String id, String name, Double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    
    // Getters and Setters omitted for brevity
    public String getId() { return id; }
    public String getName() { return name; }
    public Double getPrice() { return price; }
}