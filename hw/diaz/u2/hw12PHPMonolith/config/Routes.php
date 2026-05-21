<?php

class Router {
    private $routes = [];
    
    public function add($method, $path, $controller, $action) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'controller' => $controller,
            'action' => $action
        ];
    }
    
    public function dispatch($method, $path) {
        foreach ($this->routes as $route) {
            if ($route['method'] === $method && $route['path'] === $path) {
                $controllerClass = 'App\\Controllers\\' . $route['controller'];
                $action = $route['action'];
                
                $controller = new $controllerClass();
                return $controller->$action();
            }
        }
        
        http_response_code(404);
        echo '404 Not Found';
    }
}
