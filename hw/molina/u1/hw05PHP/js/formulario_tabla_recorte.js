document.getElementById('formularioCitas').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let citas = JSON.parse(localStorage.getItem('citas')) || [];
    
    let nombreCorte = document.getElementById('corte').options[document.getElementById('corte').selectedIndex].text;
    let nombreCabello = document.getElementById('cabello').options[document.getElementById('cabello').selectedIndex].text;
    
    let nuevaCita = {
        nombre: document.getElementById('nombre').value,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        corte: nombreCorte,
        cabello: nombreCabello
    };
    
    citas.push(nuevaCita);
    localStorage.setItem('citas', JSON.stringify(citas));
    
    alert('¡Cita agendada exitosamente!');
    document.getElementById('formularioCitas').reset();
    
    setTimeout(function() {
        window.location.href = 'horarios.html';
    }, 1000);
});
