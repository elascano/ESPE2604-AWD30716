class ExcelReportService {
  createStudentsWorkbook(title, rows) {
    const headers = [
      "Puesto",
      "ID",
      "Nombre",
      "Carrera",
      "Fecha nacimiento",
      "Edad",
      "Quintil",
      "Promedio",
      "Beca %",
      "Pago por quintil %",
      "Costo semestre",
      "Valor a pagar",
    ];

    const body = rows
      .map((row) => [
        row.puesto || "",
        row.id,
        row.name,
        row.descripcion,
        row.fechaNacimiento,
        row.edad,
        row.quintilSocioeconomico,
        row.promedio,
        row.porcentajeBeca,
        row.porcentajePagoPorQuintil,
        row.costoSemestre,
        row.valorPagarSemestre,
      ])
      .map((cells) => `<tr>${cells.map((cell) => `<td>${this.escape(cell)}</td>`).join("")}</tr>`)
      .join("");

    return this.wrapWorkbook(title, headers, body);
  }

  createSummaryWorkbook(summary) {
    const headers = ["Indicador", "Valor"];
    const rows = [
      ["Total estudiantes", summary.totalEstudiantes],
      ["Promedio general", summary.promedioGeneral],
      ["Recaudacion esperada", summary.recaudacionEsperada],
      ["Mejor promedio", summary.mejorPromedio ? summary.mejorPromedio.name : ""],
    ];
    const body = rows
      .map((row) => `<tr>${row.map((cell) => `<td>${this.escape(cell)}</td>`).join("")}</tr>`)
      .join("");

    return this.wrapWorkbook("Reporte general", headers, body);
  }

  wrapWorkbook(title, headers, body) {
    return `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; font-family: Arial, sans-serif; }
            th { background: #0f766e; color: #ffffff; font-weight: bold; }
            th, td { border: 1px solid #9ca3af; padding: 8px; }
          </style>
        </head>
        <body>
          <h1>${this.escape(title)}</h1>
          <table>
            <thead>
              <tr>${headers.map((header) => `<th>${this.escape(header)}</th>`).join("")}</tr>
            </thead>
            <tbody>${body}</tbody>
          </table>
        </body>
      </html>
    `;
  }

  escape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

module.exports = ExcelReportService;
