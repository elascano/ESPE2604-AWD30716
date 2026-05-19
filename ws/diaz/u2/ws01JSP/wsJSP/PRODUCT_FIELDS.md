PRODUCT FIELDS SPECIFICATION
=============================

Product Input Fields (9 total)

1. PRODUCT NAME
   Type: Text input
   Required: Yes
   Validation: Non-empty string
   Max Length: 255 characters
   Example: "Laptop Pro 15"
   Description: Commercial name of the product

2. BARCODE
   Type: Text input
   Required: Yes
   Validation: Alphanumeric
   Max Length: 50 characters
   Example: "LAP-001"
   Description: Unique product identifier

3. DESCRIPTION
   Type: Textarea
   Required: No
   Validation: String (optional)
   Max Length: 1000 characters
   Example: "High performance laptop with 16GB RAM and 512GB SSD"
   Description: Detailed product information

4. CATEGORY
   Type: Select dropdown
   Required: Yes
   Options:
   - Electronics
   - Food
   - Clothing
   - Books
   - Chemicals
   - Others
   Default: Empty (must select)
   Description: Product classification

5. MANUFACTURER
   Type: Text input
   Required: Yes
   Validation: Non-empty string
   Max Length: 100 characters
   Example: "TechBrand"
   Description: Brand or company that produces the product

6. WEIGHT
   Type: Number input
   Required: Yes
   Validation: Positive decimal number
   Range: 0.01 to 99999.99
   Step: 0.01
   Example: 2.5
   Description: Numeric weight value

7. WEIGHT UNIT
   Type: Select dropdown
   Required: Yes
   Options:
   - kg (Kilogram)
   - lb (Pound)
   - gr (Gram)
   Default: Empty (must select)
   Description: Unit of measurement for weight

8. PRICE
   Type: Number input
   Required: Yes
   Validation: Positive decimal number (USD)
   Range: 0.01 to 99999.99
   Step: 0.01
   Currency: USD ($)
   Example: 1299.99
   Description: Product selling price

9. QUANTITY
   Type: Number input
   Required: Yes
   Validation: Positive integer
   Range: 1 to 999999
   Step: 1
   Example: 25
   Description: Number of units in stock


WEIGHT CONVERSION SUPPORT
==========================

Real-time Conversion:
- When weight and unit are selected, conversions appear automatically
- Shows equivalents in kg, lb, and gr
- Rounded to 2 decimal places
- No additional user action required

Conversion Formulas:
- 1 kg = 2.20462 lb
- 1 lb = 0.453592 kg
- 1 kg = 1000 gr
- 1 lb = 453.592 gr


FORM VALIDATION
===============

Client-Side (Vue.js):
- Required field checks
- Type validation
- Range validation
- Real-time feedback

Server-Side (Java Service):
- Null checks
- Type conversion
- Business rule validation
- Exception handling

Validation Rules:
1. Name: Cannot be empty
2. Barcode: Must be unique (enforced by application)
3. Weight: Must be positive number
4. Price: Must be positive number
5. Quantity: Must be positive integer
6. Category: Must be selected
7. Manufacturer: Cannot be empty


DATABASE STORAGE
================

MongoDB Document Structure:
{
  "_id": ObjectId(),
  "name": "Laptop Pro 15",
  "barcode": "LAP-001",
  "description": "High performance laptop...",
  "category": "Electronics",
  "manufacturer": "TechBrand",
  "weight": 2.1,
  "weightUnit": "kg",
  "price": 1299.99,
  "quantity": 25,
  "createdAt": 1684756800000,
  "updatedAt": 1684756800000
}

Calculated Fields (in Product class):
- weightInKilogram: Auto-calculated from weight + unit
- weightInPounds: Auto-calculated from weight + unit


TABLE DISPLAY COLUMNS
====================

Product Table shows:
1. Name - Product name
2. Barcode - Product identifier
3. Category - Category badge
4. Manufacturer - Brand name
5. Weight - Original weight with unit + conversions
6. Price - USD price with $ symbol
7. Quantity - Stock quantity
8. Actions - View/Delete buttons

Weight Display Format:
"2.5 kg" (original)
"2.50 kg / 5.51 lb" (conversions)


FILTERING AND SEARCH
====================

Filter by Category:
- Dropdown with 6 categories
- Shows count of products in category
- Real-time update

Search by:
- Product name
- Barcode
- Manufacturer name
- Case-insensitive search


CALCULATED METRICS
==================

Statistics displayed:
1. Total Products - Count of all displayed products
2. Total Value - Sum of (price × quantity) for all products
3. Total Quantity - Sum of all stock quantities

Example:
Total Products: 15
Total Value: $12,450.99
Total Qty: 450


PRODUCT OPERATIONS
==================

Create:
- Fill all required fields
- Submit form
- Receives success/error message

Read:
- View in table
- Click "View" button for full details
- Displays all fields in modal

Update:
- Backend supports partial updates
- Can be extended to frontend

Delete:
- Click "Delete" button in table
- Confirmation dialog
- Removes from database


FORM STATES
===========

Initial State:
- Empty fields
- All required fields highlighted
- Submit button enabled
- No conversions shown

Filled State:
- Required fields populated
- Conversion display visible
- Submit button ready
- Form valid

Loading State:
- Submit button shows spinner
- Submit button disabled
- Cannot modify form
- Wait for response

Success State:
- Success message appears
- Form clears
- All fields reset
- Conversion cleared

Error State:
- Error message with details
- Form data preserved
- User can correct errors
- Form remains editable


ACCESSIBILITY FEATURES
======================

Form Accessibility:
- Proper label associations
- Placeholder text guides
- Input hints under fields
- Error messages clear
- Tab navigation supported

Table Accessibility:
- Proper header markup
- Row/column relationships
- Action buttons labeled
- Search field labeled
- Category filters labeled

Color Usage:
- Category badges with distinct colors
- Alert messages color-coded
- Buttons clearly distinguished
- Not color-only information


RESPONSIVE DESIGN
=================

Mobile (< 768px):
- Single column form layout
- Full-width inputs
- Stacked buttons
- Scrollable table
- Touch-friendly buttons

Tablet (768px - 1024px):
- Two column form layout
- Responsive table
- Touch-optimized spacing

Desktop (> 1024px):
- Two column form layout
- Full-size table
- Optimal spacing
- All columns visible


PRODUCT CATEGORIES DETAILS
===========================

1. Electronics
   Examples: Laptops, phones, tablets, chargers
   Typical Weight: 100g - 5kg
   Typical Price: $10 - $2000

2. Food
   Examples: Coffee, snacks, beverages, ingredients
   Typical Weight: 100g - 5kg
   Typical Price: $5 - $50

3. Clothing
   Examples: Shirts, pants, jackets, accessories
   Typical Weight: 50g - 2kg
   Typical Price: $10 - $200

4. Books
   Examples: Textbooks, novels, reference books
   Typical Weight: 200g - 2kg
   Typical Price: $5 - $100

5. Chemicals
   Examples: Lubricants, cleaners, solvents
   Typical Weight: 500g - 20kg
   Typical Price: $10 - $200

6. Others
   Examples: Miscellaneous items not fitting other categories
   Typical Weight: Variable
   Typical Price: Variable


BULK OPERATIONS
===============

Add Multiple Products:
1. Fill form
2. Click "Add Product"
3. Form clears
4. Repeat steps 1-3

View All Added:
1. Click "View All Products"
2. Navigate to table
3. See all products in inventory

Export Options (Future Enhancement):
- CSV export
- PDF report
- Excel spreadsheet


ERROR MESSAGES
==============

Validation Errors:
- "Product name is required"
- "Product weight must be a positive number"
- "Product price must be a positive number"
- "Product quantity must be a positive number"

Connection Errors:
- "Error connecting to database"
- "Error loading products"
- "Error adding product"
- "Error deleting product"

User-Friendly Messages:
- Clear and concise
- Suggest corrective action
- Don't leak system details
- Auto-dismiss after 3 seconds
