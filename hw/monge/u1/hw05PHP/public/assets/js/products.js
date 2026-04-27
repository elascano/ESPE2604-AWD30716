import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const messageDiv = document.getElementById('productMessage');

    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            const priceVal = document.getElementById('price').value;
            const price = priceVal ? parseFloat(priceVal) : null;
            const image_url = document.getElementById('image_url').value || null;
            const barbershop_id = document.getElementById('barbershop_id').value.trim();

            // Validar que sea un UUID para evitar error de Supabase
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(barbershop_id)) {
                messageDiv.style.color = 'red';
                messageDiv.textContent = 'Error: El ID de la barbería debe tener formato UUID (ej: 123e4567-e89b-12d3-a456-426614174000). No puedes poner números simples como "1233".';
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('products')
                    .insert([
                        { 
                            name: name, 
                            description: description, 
                            price: price,
                            image_url: image_url,
                            barbershop_id: barbershop_id,
                            created_at: new Date().toISOString() // Valor por defecto desde JS
                        }
                    ]);

                if (error) {
                    throw error;
                }

                messageDiv.style.color = 'green';
                messageDiv.textContent = 'Producto añadido exitosamente al catálogo.';
                productForm.reset();
            } catch (error) {
                console.error('Error insertando producto:', error);
                messageDiv.style.color = 'red';
                messageDiv.textContent = `Error: ${error.message}`;
            }
        });
    }
});
