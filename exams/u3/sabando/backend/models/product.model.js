class Product {
  constructor(name, price, expirationDate) {
    this.name = name;
    this.price = parseFloat(price);
    this.expirationDate = {
      day: parseInt(expirationDate.day, 10),
      month: parseInt(expirationDate.month, 10),
      year: parseInt(expirationDate.year, 10)
    };
  }

  // Maps database row format to the frontend JSON structure
  static fromSupabase(dbRow) {
    if (!dbRow) return null;
    return {
      name: dbRow.name,
      price: parseFloat(dbRow.price),
      expirationDate: {
        day: dbRow.expiration_day,
        month: dbRow.expiration_month,
        year: dbRow.expiration_year
      }
    };
  }

  // Utility to calculate expiration date
  static getExpirationDateObject(expirationDate) {
    return new Date(expirationDate.year, expirationDate.month - 1, expirationDate.day);
  }
}

module.exports = Product;
