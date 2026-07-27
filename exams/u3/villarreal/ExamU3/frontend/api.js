const CRUD_API_URL = '/api/masks';
const BUSINESS_API_URL = '/api/masks';

const api = {
    async getMasks() {
        try {
            const response = await fetch(CRUD_API_URL);
            if (!response.ok) throw new Error('Failed to fetch masks');
            return await response.json();
        } catch (error) {
            console.error('Error fetching masks:', error);
            throw error;
        }
    },

    async getTotalUnits() {
        try {
            const response = await fetch(`${BUSINESS_API_URL}/total-units`);
            if (!response.ok) throw new Error('Failed to fetch total units');
            const data = await response.json();
            return data.totalUnits;
        } catch (error) {
            console.error('Error fetching total units:', error);
            throw error;
        }
    },

    async createMask(maskData) {
        try {
            const response = await fetch(CRUD_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(maskData)
            });
            if (!response.ok) throw new Error('Failed to create mask');
            return await response.json();
        } catch (error) {
            console.error('Error creating mask:', error);
            throw error;
        }
    },

    async updateMask(id, maskData) {
        try {
            const response = await fetch(`${CRUD_API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(maskData)
            });
            if (!response.ok) throw new Error('Failed to update mask');
            return await response.json();
        } catch (error) {
            console.error('Error updating mask:', error);
            throw error;
        }
    },

    async deleteMask(id) {
        try {
            const response = await fetch(`${CRUD_API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete mask');
            return await response.json();
        } catch (error) {
            console.error('Error deleting mask:', error);
            throw error;
        }
    },

    async computeCartTotal(products) {
        try {
            const response = await fetch(`${BUSINESS_API_URL}/cart-total`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products })
            });
            if (!response.ok) throw new Error('Failed to compute cart total');
            const data = await response.json();
            return data.total;
        } catch (error) {
            console.error('Error computing cart total:', error);
            throw error;
        }
    },

    async computeIVA(product) {
        try {
            const response = await fetch(`${BUSINESS_API_URL}/iva`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product })
            });
            if (!response.ok) throw new Error('Failed to compute IVA');
            const data = await response.json();
            return data.iva;
        } catch (error) {
            console.error('Error computing IVA:', error);
            throw error;
        }
    },

    async computeExpiration(product, day, month, year) {
        try {
            const response = await fetch(`${BUSINESS_API_URL}/expiration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product, expirationDate: { day, month, year } })
            });
            if (!response.ok) throw new Error('Failed to compute expiration days');
            const data = await response.json();
            return data.daysLeft;
        } catch (error) {
            console.error('Error computing expiration days:', error);
            throw error;
        }
    }
};
