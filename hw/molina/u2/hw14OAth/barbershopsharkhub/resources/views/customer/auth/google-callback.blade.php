<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Procesando inicio de sesión</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body style="font-family: Arial, sans-serif; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh;">
    <main style="text-align: center;">
        <h2>Procesando inicio de sesión con Google...</h2>
        <p>Por favor espera un momento.</p>
    </main>

    <script>
        async function processGoogleLogin() {
            try {
                const configResponse = await fetch('/api/auth/supabase-config', {
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!configResponse.ok) {
                    throw new Error('No se pudo obtener la configuración de Supabase.');
                }

                const config = await configResponse.json();

                const supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true
                    }
                });

                const sessionResponse = await supabaseClient.auth.getSession();

                if (sessionResponse.error || !sessionResponse.data.session) {
                    throw new Error('No se pudo obtener la sesión de Supabase.');
                }

                const accessToken = sessionResponse.data.session.access_token;

                const laravelResponse = await fetch('/api/auth/google/session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_token: accessToken
                    })
                });

                const result = await laravelResponse.json();

                if (!result.success) {
                    throw new Error(result.message || 'No se pudo crear la sesión en Laravel.');
                }

                window.location.href = result.redirect;
            } catch (error) {
                console.error(error);

                document.body.innerHTML = `
                    <main style="font-family: Arial, sans-serif; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center;">
                        <div>
                            <h2>No se pudo completar el inicio de sesión</h2>
                            <p>Regresa al login e inténtalo nuevamente.</p>
                            <a href="/customer/login" style="color: #d4af37;">Volver al login</a>
                        </div>
                    </main>
                `;
            }
        }

        processGoogleLogin();
    </script>
</body>
</html>