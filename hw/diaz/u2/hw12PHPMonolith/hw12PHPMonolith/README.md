# Product Inventory Management System

A lightweight PHP MVC application for managing product inventory with MongoDB integration.

## Features

- Product form with real-time weight conversion (kg, lb, g)
- MongoDB database integration with Atlas
- MVC architecture
- No API - form-based submission
- Responsive modern UI
- CRUD operations for products
- Deployment ready for Render

## Requirements

- PHP 7.4 or higher
- Composer
- MongoDB Atlas account
- Render account (for deployment)

## Installation

1. Clone or download the project

2. Install PHP dependencies:
```bash
composer install
```

3. Create `.env` file from `.env.example` and update MongoDB URI:
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://cvdiaz3_db_user:admin123@cluster0.vigvruj.mongodb.net/product_db?retryWrites=true&w=majority
```

## Running Locally

Using PHP built-in server:
```bash
cd public
php server.php
```

Or:
```bash
php -S localhost:8000 -t public
```

Then open `http://localhost:8000` in your browser.

## Project Structure

```
hw12PHPMonolith/
├── app/
│   ├── controllers/
│   │   └── ProductController.php
│   ├── models/
│   │   └── Product.php
│   └── views/
│       └── index.php
├── config/
│   ├── Database.php
│   └── Routes.php
├── public/
│   ├── index.php
│   ├── server.php
│   ├── bootstrap.php
│   └── .htaccess
├── composer.json
├── Procfile
└── .env.example
```

## Database Setup (MongoDB Atlas)

1. Create account at mongodb.com
2. Create a cluster
3. Create a database user
4. Get your connection URI
5. Add whitelist IP (or 0.0.0.0/0 for dev)
6. Use URI in .env file

## Form Fields

All fields marked with * are required:

- **Product Name** * - Name of the product
- **Barcode** * - Product barcode/SKU
- **Description** - Additional product information
- **Category** * - Select from predefined categories
- **Manufacturer** * - Manufacturer name
- **Weight** * - Numeric weight value
- **Weight Unit** * - kg, grams, or pounds
- **Price (USD)** * - Product price in US dollars
- **Quantity in Stock** * - Number of items in stock

### Real-time Weight Conversion

The form automatically converts the entered weight to:
- Kilograms (kg)
- Pounds (lb)
- Grams (g)

## Deployment to Render

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

Quick steps:
1. Push code to GitHub
2. Create Web Service on Render
3. Set MongoDB URI in environment variables
4. Deploy

Your application will be available at: `https://[service-name].onrender.com`

## API Endpoints

The application uses form submissions, not traditional API endpoints:

- `GET /` - Display product list and form
- `POST /?action=store` - Add new product
- `POST /?action=delete` - Delete product

## Form Submission

Products are submitted via POST form with fields:
- productName, barcode, description, category, manufacturer
- weight, weightUnit, price, quantity

## Security Notes

- Input validation on server side
- MongoDB connection uses authenticated URI
- Environment variables for sensitive data
- HTTPS recommended for production

## Troubleshooting

### Port 8000 already in use
```bash
php -S localhost:8001 -t public
```

### MongoDB connection fails
- Check .env file exists and has correct URI
- Verify MongoDB Atlas IP whitelist
- Check database user credentials

### 404 errors
- Ensure .htaccess is properly configured
- Check Apache mod_rewrite is enabled

## License

Open source project for educational purposes.

