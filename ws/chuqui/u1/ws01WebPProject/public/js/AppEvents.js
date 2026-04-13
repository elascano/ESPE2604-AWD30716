
// js/controllers/AppEvents.js

const AppEvents = {
    init: function() {
        console.log("Aplicación iniciada...");
        this.bindSearchEvents();
        this.bindLoanEvents();
    },

    // Escuchar eventos de búsqueda (Conectar con la UI de Yostin y logica de Vicky)
    bindSearchEvents: function() {
        const searchBtn = document.getElementById('btn-buscar'); // ID definido por Yostin
        const inputBusqueda = document.getElementById('input-busqueda');

        if(searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = inputBusqueda.value;
                // llamar a la lógica de Vicky para filtrar
                // Y luego a la UI de Yostin para pintar los resultados
                console.log("Buscando:", query);
            });
        }
    },

    // Escuchar eventos de Préstamo/Reserva
    bindLoanEvents: function() {
        // Usamos delegación de eventos porque los botones de "Reservar" se crean dinámicamente
        document.addEventListener('click', (e) => {
            
            // Detectar clic en botón reservar
            if(e.target && e.target.classList.contains('btn-reservar')) {
                const libroId = e.target.dataset.id;
                this.manejarReserva(libroId);
            }
        });
    },

    // Lógica coordinadora de una reserva
    manejarReserva: async function(libroId) {
        // 1. Llamar a lógica de validación (Vicky/Kerly)
        // 2. Si es exitoso:
        NotificationService.mostrarNotificacion("Procesando reserva...", "info");
        
        // Simulación de espera (Async/Await) 
        await new Promise(r => setTimeout(r, 1500)); 

        // 3. Confirmación y Recordatorio 
        NotificationService.mostrarNotificacion("¡Reserva Exitosa!", "success");
        NotificationService.programarRecordatorio("Nombre del Libro", 5); // Recordar en 5 segundos
    }
};

export default AppEvents;