export class Product {
    static get apiBase() {
        if (window.location.pathname.includes('/frontend')) {
            return '../backend/public/index.php';
        }
        return '/api/products';
    }

    static async getAll() {
        const response = await fetch(this.apiBase);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    }

    static async create(data) {
        const response = await fetch(this.apiBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        return await response.json();
    }
}
