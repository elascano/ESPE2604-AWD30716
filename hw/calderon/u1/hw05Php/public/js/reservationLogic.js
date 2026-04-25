
async function handleReservation(event) {
    event.preventDefault(); 

    const form = event.target;
    const formData = new FormData(form);

    const reservationData = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        reservation_date: formData.get('reservation_date'),
        reservation_time: formData.get('reservation_time'),
        guests: parseInt(formData.get('guests')),
        table_number: formData.get('table_number') 
            ? parseInt(formData.get('table_number')) 
            : null,
        comments: formData.get('comments')
    };

    try {
        const response = await fetch('../backend/reservation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        });

        const result = await response.json();

        if (result.success) {
            alert("Reservation successfully saved");
            form.reset();
        } else {
            alert("Error: " + result.error);
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Connection error");
    }
}