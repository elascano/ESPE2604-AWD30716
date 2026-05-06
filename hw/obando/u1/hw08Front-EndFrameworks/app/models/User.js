// Placeholder para el modelo User
// Aquí se implementará la conexión con la base de datos (ej. Supabase)
// para gestionar los usuarios (Clientes y Managers).

class User {
    static async findById(id) {
        // Simulación de búsqueda en base de datos
        return { id, name: "John Doe", role: "client" };
    }
}

module.exports = User;
