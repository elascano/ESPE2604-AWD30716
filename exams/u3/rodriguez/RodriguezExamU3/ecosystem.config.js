module.exports = {
  apps: [
    {
      name: "database-service",
      script: "index.js",
      cwd: "./DatabaseService",
      env: {
        PORT: 3016,
        NODE_ENV: "production"
      },
      watch: false,
      max_memory_restart: "256M"
    },
    {
      name: "business-rules-service",
      script: "index.js",
      cwd: "./BusinessRulesService",
      env: {
        PORT: 3014,
        NODE_ENV: "production"
      },
      watch: false,
      max_memory_restart: "256M"
    },
    {
      name: "frontend-app",
      script: "dist/server.js",
      cwd: "./FrontendApp",
      env: {
        PORT: 3010,
        BUSINESS_API_URL: "http://localhost:3014",
        BUSINESS_API_PREFIX: "/products-api",
        DEFAULT_ROUTE_PATH: "/product",
        NODE_ENV: "production"
      },
      watch: false,
      max_memory_restart: "256M"
    }
  ]
};
