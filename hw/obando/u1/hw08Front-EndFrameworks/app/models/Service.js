// Placeholder para el modelo Service
// Aquí se gestionarán los servicios de barbería que se ofrecen.

class Service {
    static async getAll() {
        // Simulación de obtención de datos
        return [
            { id: 1, name: "Corte Clásico", price: 15 },
            { id: 2, name: "Arreglo de Barba", price: 10 }
        ];
    }
}

module.exports = Service;
