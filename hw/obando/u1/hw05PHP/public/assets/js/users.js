import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('registerMessage');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Delegamos la inserción a la base de datos mediante un Trigger.
                // Solo registramos al usuario en Supabase Auth y le pasamos el nombre como 'metadata'
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            name: name
                        }
                    }
                });

                if (authError) {
                    throw authError;
                }

                messageDiv.style.color = 'green';
                messageDiv.textContent = 'Usuario registrado exitosamente.';
                registerForm.reset();
            } catch (error) {
                console.error('Error insertando usuario:', error);
                messageDiv.style.color = 'red';
                messageDiv.textContent = `Error: ${error.message}`;
            }
        });
    }
});
