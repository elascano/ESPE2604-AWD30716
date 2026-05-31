<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Acceso no autorizado | SharkHub</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="{{ $seconds }};url={{ $redirectUrl }}">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --gold: #d4af37;
            --dark: #050505;
            --panel: #111111;
            --text: #f5f5f5;
            --muted: #9b9b9b;
        }

        * {
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at center, #161616 0%, var(--dark) 60%);
            color: var(--text);
            font-family: Arial, Helvetica, sans-serif;
        }

        .access-card {
            width: min(560px, calc(100% - 32px));
            padding: 42px 34px;
            border: 1px solid rgba(212, 175, 55, 0.35);
            border-radius: 18px;
            background: rgba(17, 17, 17, 0.96);
            text-align: center;
            box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
        }

        .access-icon {
            width: 82px;
            height: 82px;
            margin: 0 auto 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 2px solid var(--gold);
            color: var(--gold);
            font-size: 34px;
        }

        h1 {
            margin: 0 0 14px;
            color: var(--gold);
            font-size: 32px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        p {
            margin: 0 auto 18px;
            max-width: 440px;
            color: var(--muted);
            font-size: 16px;
            line-height: 1.6;
        }

        .countdown {
            margin-top: 24px;
            color: var(--text);
            font-weight: 700;
        }

        .login-link {
            display: inline-block;
            margin-top: 26px;
            padding: 12px 22px;
            border-radius: 8px;
            background: var(--gold);
            color: #000;
            text-decoration: none;
            font-weight: 700;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <main class="access-card">
        <div class="access-icon">
            <i class="fa-solid fa-lock"></i>
        </div>
        <h1>Acceso restringido</h1>
        <p>{{ $message }}</p>
        <p>Por seguridad, volverás al inicio de sesión automáticamente.</p>
        <div class="countdown">
            Redirección en <span id="seconds">{{ $seconds }}</span> segundos.
        </div>
        <a class="login-link" href="{{ $redirectUrl }}">Volver al login</a>
    </main>

    <script>
        let remainingSeconds = {{ $seconds }};
        const secondsElement = document.getElementById('seconds');
        const redirectUrl = @json($redirectUrl);

        const timer = setInterval(function () {
            remainingSeconds -= 1;

            if (secondsElement) {
                secondsElement.textContent = remainingSeconds;
            }

            if (remainingSeconds <= 0) {
                clearInterval(timer);
                window.location.replace(redirectUrl);
            }
        }, 1000);
    </script>
</body>
</html>
