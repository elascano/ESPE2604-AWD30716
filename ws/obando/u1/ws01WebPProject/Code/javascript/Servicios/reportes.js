function inicializarScriptReportes() {
    cargarAnios();
    consultarReporte();
    cargarGrafico();

    document.getElementById("ingresoGastoTipo").style.display = "none";
    document.getElementById("ingresoVSgasto").style.display = "none";

}

function cargarAnios() {
    let selectAnios = document.getElementById("aniosSelect");
    selectAnios.innerHTML = "";

    fetch("Reporte/obtenerAnios.php")
        .then(response => response.json())
        .then(anios => {

            console.log("años recibidos: " + anios);
            selectAnios.innerHTML = '<option value="">Seleccione una opción</option>';

            anios.forEach(anio => {
                let option = document.createElement("option");
                option.value = anio;
                option.textContent = anio;
                selectAnios.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando los años:", error));
}

function consultarReporte() {
    let anio = document.getElementById("aniosSelect").value;
    let mes = document.getElementById("mesesSelect").value;

    console.log(1);

    anio = anio === "Seleccione una opcion" ? 0 : anio;
    mes = mes === "" ? 0 : mes;

    fetch(`Reporte/obtenerReporte.php?anio=${anio}&mes=${mes}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            console.log("reporte: ");
            console.log(data);

            let variacion = Number(data.variacion_porcentaje);
            let comparacion = "";

            if (variacion >= 0) {
                comparacion = "<h5 class='text-success'>" + variacion + " % <i class='bi bi-caret-up-fill'></i></h5>";
            } else {
                comparacion = "<h5 class='text-danger'>" + variacion + " % <i class='bi bi-caret-down-fill'></i></h5>";
            }



            document.getElementById("ingreso_mensual").textContent = `$ ${data.ingreso_total}`;
            document.getElementById("gasto_mensual").textContent = `$ ${data.gasto_total}`;
            document.getElementById("balance_mensual").textContent = `$ ${data.balance_neto}`;
            document.getElementById("categoriaMayorIngreso").textContent = data.categoria_mayor_ingreso;
            document.getElementById("categoriaMayorGasto").textContent = data.categoria_mayor_gasto;
            document.getElementById("comparacion").innerHTML = comparacion;
            document.getElementById("cantidadIngresos").textContent = data.cantidad_ingresos;
            document.getElementById("cantidadGastos").textContent = data.cantidad_gastos;
            document.getElementById("cantidadTransacciones").textContent = Number(data.cantidad_gastos) + Number(data.cantidad_ingresos);
            document.getElementById("ingreso_anual").textContent = `$ ${data.ingreso_anual}`;
            document.getElementById("gasto_anual").textContent = `$ ${data.gasto_anual}`;
            let resultado = Number(data.ingreso_anual) - Number(data.gasto_anual);
            document.getElementById("balance_anual").textContent = "$ " + resultado.toFixed(2);
            destruirTodosLosGraficos();
            cargarGrafico();
        })
        .catch(error => console.error("Error:", error));
}

function abrirGrafico() {
    let opcion = Number(document.getElementById("graficoSelect").value);

    switch (opcion) {
        case 0:
            document.getElementById("ingresoGastoTipo").style.display = "none";
            document.getElementById("ingresoVSgasto").style.display = "none";
            break;
        case 1:
            document.getElementById("ingresoGastoTipo").style.display = "flex";
            document.getElementById("ingresoVSgasto").style.display = "none";
            break;
        case 2:
            document.getElementById("ingresoVSgasto").style.display = "flex";
            document.getElementById("ingresoGastoTipo").style.display = "none";
            break;
    }
}

let graficos = {};

function destruirTodosLosGraficos() {
    Object.values(graficos).forEach(grafico => {
        if (grafico) grafico.destroy();
    });
    graficos = {};
}

function cargarGrafico() {
    let anio = document.getElementById("aniosSelect").value;
    let mes = document.getElementById("mesesSelect").value;

    anio = anio === "Seleccione una opcion" ? 0 : anio;
    mes = mes === "" ? 0 : mes;

    fetch(`Reporte/datosGraficos.php?anio=${anio}&mes=${mes}`)
        .then(response => response.json())
        .then(data => {
            destruirTodosLosGraficos();

            const ctxIngresos = document.getElementById("graficoIngresos").getContext("2d");
            const ctxGastos = document.getElementById("graficoGastos").getContext("2d");
            const ctxPastel = document.getElementById("graficoPastel").getContext("2d");
            const ctxLineas = document.getElementById("graficoLineas").getContext("2d");

            graficos.graficoIngresos = new Chart(ctxIngresos, {
                type: "doughnut",
                data: {
                    labels: Object.keys(data.ingresos_por_tipo),
                    datasets: [{
                        data: Object.values(data.ingresos_por_tipo),
                        backgroundColor: ["#28a745", "#17a2b8", "#ffc107"]
                    }]
                }
            });

            graficos.graficoGastos = new Chart(ctxGastos, {
                type: "doughnut",
                data: {
                    labels: Object.keys(data.gastos_por_tipo),
                    datasets: [{
                        data: Object.values(data.gastos_por_tipo),
                        backgroundColor: ["#dc3545", "#fd7e14", "#6f42c1", "#20c997"]
                    }]
                }
            });

            graficos.graficoPastel = new Chart(ctxPastel, {
                type: "pie",
                data: {
                    labels: ["Ingresos", "Gastos"],
                    datasets: [{
                        data: [data.ingreso_total, data.gasto_total],
                        backgroundColor: ["rgba(75, 192, 192, 0.5)", "rgba(255, 99, 132, 0.5)"],
                        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"]
                    }]
                }
            });

            const fechas = [];
            let ingresosMonto = [];
            let egresosMonto = [];

            const allDates = [
                ...data.ingresos_por_fecha.map(item => item.fecha),
                ...data.gastos_por_fecha.map(item => item.fecha)
            ];
            const uniqueDates = [...new Set(allDates)].sort();

            uniqueDates.forEach(fecha => {
                const ingreso = data.ingresos_por_fecha.find(item => item.fecha === fecha);
                const egreso = data.gastos_por_fecha.find(item => item.fecha === fecha);

                fechas.push(fecha);
                ingresosMonto.push(ingreso ? parseFloat(ingreso.monto) : null);  
                egresosMonto.push(egreso ? parseFloat(egreso.monto) : null); 
            });

            graficos.graficoLineas = new Chart(ctxLineas, {
                type: "line",
                data: {
                    labels: fechas,
                    datasets: [
                        {
                            label: "Ingresos",
                            data: ingresosMonto,
                            borderColor: "rgba(75, 192, 192, 1)",
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            fill: true,
                            spanGaps: true  
                        },
                        {
                            label: "Egresos",
                            data: egresosMonto,
                            borderColor: "rgba(255, 99, 132, 1)",
                            backgroundColor: "rgba(255, 99, 132, 0.2)",
                            fill: true,
                            spanGaps: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: 'Fecha' } },
                        y: { title: { display: true, text: 'Monto' } }
                    }
                }
            });
            

        })
        .catch(error => console.error("Error al cargar los datos:", error));
}



function guardarComoPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logo = '../imagenes/logo.png';
    doc.addImage(logo, 'PNG', 10, 10, 30, 30);

    doc.setFontSize(18);
    doc.text("Reporte de Finanzas", 50, 20);

    doc.setFontSize(12);
    doc.text("A continuación, los detalles del reporte:", 50, 30);

    const startY = 50;
    const columnWidth = 60;
    const rowHeight = 10;

    doc.text("Ingreso Mensual", 20, startY);
    doc.text("Gasto Mensual", 80, startY);
    doc.text("Balance Neto Mensual", 140, startY);
    
    doc.text(document.getElementById("ingreso_mensual").innerText, 20, startY + rowHeight);
    doc.text(document.getElementById("gasto_mensual").innerText, 80, startY + rowHeight);
    doc.text(document.getElementById("balance_mensual").innerText, 140, startY + rowHeight);

    doc.text("Ingreso más alto del mes", 20, startY + 2 * rowHeight);
    doc.text("Gasto más alto del mes", 80, startY + 2 * rowHeight);
    doc.text("Cantidad de ingresos", 140, startY + 2 * rowHeight);

    doc.text(document.getElementById("categoriaMayorIngreso").innerText, 20, startY + 3 * rowHeight);
    doc.text(document.getElementById("categoriaMayorGasto").innerText, 80, startY + 3 * rowHeight);
    doc.text(document.getElementById("cantidadIngresos").innerText, 140, startY + 3 * rowHeight);

    doc.text("Cantidad de gastos", 20, startY + 4 * rowHeight);
    doc.text("Cantidad de transacciones", 80, startY + 4 * rowHeight);
    
    doc.text(document.getElementById("cantidadGastos").innerText, 20, startY + 5 * rowHeight);
    doc.text(document.getElementById("cantidadTransacciones").innerText, 80, startY + 5 * rowHeight);

    doc.save('reporte_finanzas.pdf');
}
