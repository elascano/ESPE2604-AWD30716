# Biconoirs Restaurant — Demo: Programación no bloqueante & Programación Funcional

Proyecto pequeño, independiente de tu backend principal, pensado solo para la
exposición. Son dos piezas separadas (frontend y backend) para subir cada una
a su propia instancia EC2 "normal" (sin balanceadores ni contenedores).

## Cómo mapea con los 3 puntos de tus compañeros

| # | Punto de la diapositiva | Dónde está en el código |
|---|---|---|
| 1 | **Non-Blocking Execution** (ver menú) | `backend/server.js`: `/api/menu` usa `Promise` + `setTimeout` en vez de una consulta bloqueante. `frontend/app.js`: `runComparison()` lanza el fetch del menú y 3 "pings" casi al mismo tiempo, para probar en vivo si el servidor sigue libre. |
| 2 | **State Immutability** (agregar al carrito) | `frontend/app.js`: `addToCart()` y `removeFromCart()` — nunca `push`/`splice`, siempre `[...cart, item]` o `.filter()`. |
| 3 | **Deterministic Pure Function** (calcular total) | `frontend/app.js`: `calculateTotal()` — `reduce()` puro, sin efectos secundarios. |

Además añadí un extra que hace el punto 1 mucho más visual en vivo:
`backend/server.js` también expone `/api/menu-blocking`, una versión
**a propósito incorrecta** que congela el hilo de Node con un busy-wait
síncrono. Al comparar los tiempos de los "pings" entre la versión bloqueante
y la no bloqueante, el público ve la diferencia con números reales en pantalla,
no solo en teoría.

## Cómo correr la demo en vivo

1. Click en **"Cargar menú (bloqueante)"** → los 3 pings tardan casi lo mismo
   que el menú (todos quedan atrapados detrás del busy-wait).
2. Click en **"Cargar menú (no bloqueante)"** → los pings responden casi
   instantáneo, aunque el menú siga "cargando" en segundo plano.
3. Agrega platos al carrito (inmutabilidad) y observa el total recalcularse
   con `reduce()` (función pura).

## Despliegue en AWS (2 instancias EC2 normales)

### Instancia 1 — Backend

```bash
# En la instancia EC2 (Ubuntu, por ejemplo)
sudo apt update && sudo apt install -y nodejs npm

# Sube la carpeta backend/ (scp, git clone, etc.) y entra a ella
cd backend
npm install
node server.js
# Corriendo en el puerto 3000
```

- Abre el puerto **3000** en el Security Group de esta instancia (entrada TCP,
  origen 0.0.0.0/0 para la demo, o solo la IP del frontend si prefieres).
- Opcional: usa `pm2` para que quede corriendo en segundo plano:
  `npx pm2 start server.js --name biconoirs-demo`.

### Instancia 2 — Frontend

```bash
# Cualquier servidor estático sirve. Ejemplo rápido sin instalar nada extra:
sudo apt update && sudo apt install -y nodejs npm
cd frontend
npx serve -s . -l 8080
```

- Abre el puerto **8080** en el Security Group de esta instancia.
- **Antes de correrlo**, edita `frontend/app.js` y cambia:
  ```js
  const API_BASE_URL = "http://TU_IP_O_DOMINIO_BACKEND:3000";
  ```
  por la IP pública (o dominio) real de la Instancia 1.

Con eso, entrando a `http://IP_FRONTEND:8080` desde cualquier navegador
ya tienes la demo completa funcionando entre dos instancias reales de AWS.

## Nota de seguridad

El backend deja CORS abierto (`cors()` sin restricciones) para que la demo
funcione sin fricción entre dos IPs distintas. Es intencional para esta
demo puntual — en un proyecto real restringirías `origin` al dominio exacto
del frontend.
