// Vicky sweertalert.js

/**
 * Muestra una alerta básica con SweetAlert2

 */
function mostrarAlertaBasica(title, text, icon = 'info') {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false
  });
}

/**
 * Muestra una alerta genérica compatible con la función mostrarAlerta de utils.js
 * Convierte los tipos de Bootstrap a iconos de SweetAlert2

 */
function mostrarAlerta(mensaje, tipo = 'info') {
  // Mapear tipos de Bootstrap a iconos de SweetAlert2
  const iconMap = {
    'success': 'success',
    'danger': 'error',
    'error': 'error',
    'warning': 'warning',
    'info': 'info'
  };

  const icon = iconMap[tipo] || 'info';
  
  // Determinar título según el tipo
  const titleMap = {
    'success': '¡Éxito!',
    'danger': 'Error',
    'error': 'Error',
    'warning': 'Atención',
    'info': 'Información'
  };

  const title = titleMap[tipo] || 'Notificación';

  return Swal.fire({
    title: title,
    text: mensaje,
    icon: icon,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false
  });
}

/**
 * Muestra una confirmación simple con SweetAlert2
 
 */
function mostrarConfirmacion(title, text, icon = 'question', confirmButtonText = 'Aceptar') {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonText: confirmButtonText,
    timer: 3000,
    timerProgressBar: true
  });
}

/**
 * Muestra una confirmación doble (confirmar/cancelar) con SweetAlert2
 * Compatible con confirm() nativo pero con mejores respuestas visuales

 */
function dobleConfirmacion(
  title = "¿Estás seguro?",
  text = "¡No podrás revertir esto!",
  confirmButtonText = "Sí, eliminar",
  cancelButtonText = "No, cancelar"
) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  return swalWithBootstrapButtons.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire({
        title: "¡Eliminado!",
        text: "El registro ha sido eliminado.",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return true;
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "Cancelado",
        text: "El registro está a salvo :)",
        icon: "error",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return false;
    }
    return false;
  });
}

/**
 * Reemplazo de confirm() nativo con SweetAlert2
 * Muestra solo la confirmación sin alertas adicionales
 
 */
function confirmarAccion(mensaje) {
  return Swal.fire({
    title: '¿Estás seguro?',
    text: mensaje,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  }).then((result) => {
    return result.isConfirmed;
  });
}