import { ErrorController } from "./ErrorController.js";
import { AppConfig } from '../utils/config.js';

export class FetchController {

    // GET GENÉRICO (Sirve para 'todos' o con 'filtros')
    // Uso: getData('libros') o getData('libros', { id: '123' })
    static async getData(endpoint, params = null) {
        try {
            const url = new URL(`${AppConfig.API_URL}/${endpoint}`);

            if (params) {
                Object.keys(params).forEach(key =>
                    url.searchParams.append(key, params[key])
                );
            }

            const response = await fetch(url);

            if (!response.ok) {
                const error = new Error("No se pudo obtener la información");
                error.status = response.status;
                ErrorController.redirect(error.status, error.message);
                return null;
            }

            return await response.json();

        } catch (error) {
            console.error(`Error en GET ${endpoint}:`, error);
            ErrorController.redirect(500, "Error de conexión");
            return null;
        }
    }

    // GET BY ID (El método que te faltaba conceptualmente)
    // Uso: getById('libros', '978-xx') -> http://.../libros/978-xx
    static async getById(endpoint, id) {
        try {
            const response = await fetch(`${AppConfig.API_URL}/${endpoint}/${id}`);
            if (!response.ok) {
                let mensaje = "Error al obtener el recurso";

                if (response.status === 404) {
                    mensaje = "Recurso no encontrado";
                }

                ErrorController.redirect(response.status, mensaje);
                return null;
            }
            return await response.json();
        } catch (error) {
            ErrorController.redirect(500, "Error de conexión");
            console.error(`Error buscando ID ${id}:`, error);
            return null;
        }
    }

    // POST (Crear)
    static async postData(endpoint, data) {
        try {
            const response = await fetch(`${AppConfig.API_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                //throw new Error(`Error: ${response.status}`);
                let mensaje = "Error al crear el recurso";

                if (response.status === 400) {
                    mensaje = "Datos enviados no válidos";
                } else if (response.status === 401) {
                    mensaje = "No tienes permisos para esta acción";
                }

                ErrorController.redirect(response.status, mensaje);
                return null;
            }
            return await response.json();
        } catch (error) {
            ErrorController.redirect(500, "Error de conexión");
            console.error('Error en POST:', error);
            return null;
        }
    }

    // PUT (Reemplazar) - OJO: Se pide el ID explícitamente en la URL
    static async putData(endpoint, id, data) {
        try {
            const response = await fetch(`${AppConfig.API_URL}/${endpoint}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                //throw new Error(`Error: ${response.status}`);
                let mensaje = "Error al actualizar el recurso";

                if (response.status === 400) {
                    mensaje = "Datos enviados no válidos";
                } else if (response.status === 404) {
                    mensaje = "Recurso no encontrado";
                } else if (response.status === 401) {
                    mensaje = "No tienes permisos para esta acción";
                }

                ErrorController.redirect(response.status, mensaje);
                return null;
            }
            return await response.json();
        } catch (error) {
            ErrorController.redirect(500, "Error de conexión");
            console.error(`Error en PUT ${id}:`, error);
            return null;
        }
    }

    // PATCH (Actualizar parcial) - OJO: También requiere ID en la URL
    static async patchData(endpoint, id, data) {
        try {
            const response = await fetch(`${AppConfig.API_URL}/${endpoint}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                //throw new Error(`Error: ${response.status}`);
                let mensaje = "Error al actualizar parcialmente el recurso";

                if (response.status === 400) {
                    mensaje = "Datos enviados no válidos";
                } else if (response.status === 404) {
                    mensaje = "Recurso no encontrado";
                } else if (response.status === 401) {
                    mensaje = "No tienes permisos para esta acción";
                }

                ErrorController.redirect(response.status, mensaje);
                return null;
            }
            return await response.json();
        } catch (error) {
            ErrorController.redirect(500, "Error de conexión");
            console.error(`Error en PATCH ${id}:`, error);
            return null;
        }
    }

    // DELETE (Borrar) - OJO: Requiere ID en la URL
    static async deleteData(endpoint, id) {
        try {
            const response = await fetch(`${AppConfig.API_URL}/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                //throw new Error(`Error: ${response.status}`);
                let mensaje = "Error al eliminar el recurso";

                if (response.status === 404) {
                    mensaje = "Recurso no encontrado";
                } else if (response.status === 401) {
                    mensaje = "No tienes permisos para esta acción";
                }

                ErrorController.redirect(response.status, mensaje);
                return null;
            }

            return response.status === 204 ? true : await response.json();

            //return await response.json();
        } catch (error) {
            ErrorController.redirect(500, "Error de conexión");
            console.error(`Error en DELETE ${id}:`, error);
            return null;
        }
    }
}