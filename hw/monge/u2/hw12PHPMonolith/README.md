# PHP Monolith Product Management - ESPE Web Avanzado (U2 HW12)

A clean, modern, containerized PHP Web Monolith application developed to manage technological products subject to the **15% Ecuadorian VAT (IVA)**. The application connects to a **Supabase PostgreSQL** database, implements **MVC architecture**, applies **Single Responsibility Principles**, and displays a premium **glassmorphism user interface** powered by Bootstrap 5 and custom styles.

---

## 🛠️ Technology Stack
- **Backend / Core**: PHP 8.2 (Apache base)
- **Database**: Supabase (PostgreSQL)
- **Frontend / Presentation**: HTML5, Vanilla CSS3 (custom dark/glassmorphic themes), and JavaScript (dynamic calculators)
- **UI Framework**: Bootstrap 5 (Responsive Layout)
- **Containerization / Deployment**: Docker & Docker Compose (serves on port 80, ready for AWS EC2)

---

## 📂 Directory Layout
The project follows standard Model-View-Controller (MVC) design for separation of concerns:
```
hw12PHPMonolith/
├── .env                  # Local database environment configuration (git ignored)
├── .env.example          # Reference template for database connection settings
├── .gitignore            # Excludes sensitive environment files and IDE metadata
├── Dockerfile            # Container build configurations for Apache & PHP PostgreSQL drivers
├── docker-compose.yml    # Development server orchestrator mapping local volume
├── index.php             # Front Controller (Application Router & Entry Point)
├── config/
│   └── database.php      # Connects using PDO (Singleton pattern + custom .env parser)
├── models/
│   └── Product.php       # Product data model (handles queries and calculations)
├── controllers/
│   └── ProductController.php # Coordinates HTTP requests, runs inputs validation, triggers model saves
├── views/
│   ├── layout.php        # Core HTML skeleton (includes styling, header, navbar, notifications, footer)
│   ├── list.php          # Table view listing all products in the database
│   └── register.php      # Form views for registering a new product or updating an existing one
└── public/
    ├── css/
    │   └── style.css     # Dark mode, glassmorphic layout, glowing animated backgrounds
    └── js/
        └── app.js        # Dynamic 15% VAT calculator & frontend validations
```

---

## 🗄️ Database Setup
Before launching the application, run the following SQL command in your Supabase SQL Editor to create the `products` table:

```sql
CREATE TABLE public.products (
    id bigserial NOT NULL,
    name character varying(150) NOT NULL,
    quantity integer NOT NULL,
    price numeric(10, 2) NOT NULL,
    subtotal numeric(10, 2) NOT NULL,
    iva numeric(10, 2) NOT NULL,
    total numeric(10, 2) NOT NULL,
    created_at timestamp without time zone NULL DEFAULT now(),
    CONSTRAINT products_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;
```

---

## ⚙️ Configuration
1. In the project root, copy `.env.example` and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your Supabase database host, user, and password details:
   ```env
   DB_HOST=your-supabase-host.pooler.supabase.com
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres.your_project_id
   DB_PASSWORD=your_super_secure_db_password
   DB_SSLMODE=require
   ```

---

## 🚀 Running Locally with Docker
You can easily spin up the application on port `80` using Docker:

### Method 1: Using Docker Compose (Recommended for development)
1. Build and start the container:
   ```powershell
   docker-compose up -d --build
   ```
2. Access the application in your browser at `http://localhost`.
3. To stop the container:
   ```powershell
   docker-compose down
   ```

### Method 2: Standard Docker CLI
1. Build the Docker image:
   ```powershell
   docker build -t php-monolith-app .
   ```
2. Run the container, binding it to port 80 and feeding variables from your `.env` file:
   ```powershell
   docker run -d -p 80:80 --env-file .env --name tech_monolith php-monolith-app
   ```
3. Open `http://localhost` in your browser.

---

## 🌐 Deploying to AWS EC2
Since the project is containerized, deployment on an AWS EC2 instance is simple:

1. **Launch EC2 Instance**: Create a micro-instance (Amazon Linux 2 or Ubuntu) and open HTTP **port 80** and HTTPS **port 443** in the security group.
2. **Install Docker**:
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   ```
3. **Clone Repo / Transfer Files**: Clone your GitHub repository (excluding `.env` as defined in `.gitignore`).
4. **Configure Production Env**: Create the `.env` file directly on the EC2 server with production credentials.
5. **Run App**:
   ```bash
   docker-compose up -d --build
   ```
   *Your monolith is now live on the EC2 instance's public IP address!*
