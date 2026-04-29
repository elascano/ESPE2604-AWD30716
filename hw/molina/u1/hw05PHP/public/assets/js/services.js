import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    const serviceForm = document.getElementById('serviceForm');
    const messageDiv = document.getElementById('serviceMessage');

    if (serviceForm) {
        serviceForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            const price = parseFloat(document.getElementById('price').value);
            const duration_minutes = parseInt(document.getElementById('duration').value, 10);
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
                    .from('services')
                    .insert([
                        { 
                            name: name, 
                            description: description, 
                            price: price,
                            duration_minutes: duration_minutes,
                            barbershop_id: barbershop_id,
                            created_at: new Date().toISOString() // Valor por defecto desde JS
                        }
                    ]);

                if (error) {
                    throw error;
                }

                messageDiv.style.color = 'green';
                messageDiv.textContent = 'Servicio creado exitosamente.';
                serviceForm.reset();
            } catch (error) {
                console.error('Error insertando servicio:', error);
                messageDiv.style.color = 'red';
                messageDiv.textContent = `Error: ${error.message}`;
            }
        });
    }
});
