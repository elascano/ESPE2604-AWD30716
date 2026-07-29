# Exam Frontend

Interfaz React + TypeScript + Vite.

## Funciones

- Crea productos con nombre, precio, stock y fecha de expiración.
- Busca por coincidencia parcial del nombre.
- La búsqueda funciona al presionar Enter o al pulsar Buscar.
- Al buscar se ejecutan dos GET en paralelo:

```text
/api/v1/items/iva
/api/v1/items/dias-restantes
```

## Configuración

```env
VITE_API_URL=http://IP_PUBLICA_BUSINESS:3001
```

Después:

```bash
docker compose up -d --build
```

Vite inserta `VITE_API_URL` durante la compilación, por lo que debes reconstruir si cambias esa URL.
