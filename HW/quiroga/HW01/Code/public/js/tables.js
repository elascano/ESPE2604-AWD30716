$(document).ready(function () {
    const $tabla = $('#tablaPrestamos');
    if (!$tabla.length) return;

    const isInit = (function () {
        if ($.fn.DataTable && $.fn.DataTable.isDataTable) return $.fn.DataTable.isDataTable('#tablaPrestamos');
        if ($.fn.dataTable && $.fn.dataTable.isDataTable) return $.fn.dataTable.isDataTable('#tablaPrestamos');
        return false;
    })();

    if (isInit) {
        $tabla.DataTable().destroy();
    }

    $tabla.DataTable({
        pageLength: 5,
        lengthChange: false,
        paging: true,
        searching: true,
        ordering: true,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.8/i18n/es-ES.json'
        },
        columnDefs: [
            { orderable: false, targets: 4 }
        ]
    });
});