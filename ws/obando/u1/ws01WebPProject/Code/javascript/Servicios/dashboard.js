let ctx;
let meses;
let ingresos;

function inicializarScriptDashboard() {
    fetch("Ingreso/ingresosTotalesMensuales.php")
    .then(response => response.json())
    .then(data => {
        console.log("Datos recibidos:", data);
        if (data.error) {
            console.error("Error en la respuesta del servidor:", data.error);
        } else {
            const ingresoTotal = parseFloat(data.IngresoTotal);
            const ingresoEsteMes = parseFloat(data.IngresoEsteMes);
            const egresoTotal = parseFloat(data.EgresoTotal);
            const egresoEsteMes = parseFloat(data.EgresoEsteMes);

            console.log("Ingreso total:", ingresoTotal, "Ingreso este mes:", ingresoEsteMes);
            console.log("Egreso total:", egresoTotal, "Egreso este mes:", egresoEsteMes);

            if (!isNaN(ingresoTotal) && !isNaN(ingresoEsteMes) && !isNaN(egresoTotal) && !isNaN(egresoEsteMes)) {
                animarNumero('ingresoTotal', ingresoTotal);
                animarNumero('ingresoMensual', ingresoEsteMes);
                animarNumero('gastoTotal', egresoTotal);
                animarNumero('gastoMensual', egresoEsteMes);
                dibujarGrafica();
            } else {
                console.error("Los datos de ingresos/egresos no son números válidos.");
            }
        }
    })
    .catch(error => console.error("Error en la solicitud fetch:", error));
}

function animarNumero(id, numeroFinal) {
    let numero = 0;
    const intervalo = setInterval(() => {
        const element = document.getElementById(id);
        if (!element) {
            clearInterval(intervalo);
            return;
        }
        element.innerText = numero.toFixed(2);

        if (numero >= numeroFinal) {
            clearInterval(intervalo);
            element.innerText = numeroFinal.toFixed(2);
        } else {
            numero += (numeroFinal - numero) / 5;  
        }
    }, 10);  
}




function dibujarGrafica() {
    fetch('Ingreso/ingresosMensuales.php') 
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
            return;
        }

        // Mapeamos los meses y los datos de ingresos y egresos
        const meses = data.map(item => {
            const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                                  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            return nombresMeses[item.mes - 1];
        });

        const ingresos = data.map(item => item.total_ingresos);
        const egresos = data.map(item => item.total_egresos);

        console.log("Meses:", meses);
        console.log("Ingresos:", ingresos);
        console.log("Egresos:", egresos);

        const ctx = document.getElementById("grafica").getContext("2d");

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: meses, // Los meses
                datasets: [
                    {
                        label: 'Ingresos',
                        data: ingresos,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Egresos',
                        data: egresos,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error("Error en la petición:", error));
}
