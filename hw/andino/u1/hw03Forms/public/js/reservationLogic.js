// Configuración de Supabase (Usa tus mismas credenciales)
const SUPABASE_URL = 'https://mibitvmvognqfzzhobqg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jOAdRf4yNBzsL2KC-8RsKQ_QtKRXFLo';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
        table_number: formData.get('table_number') ? parseInt(formData.get('table_number')) : null,
        comments: formData.get('comments')
    };

    try {
        const { data, error } = await _supabase
            .from('reservations')
            .insert([reservationData]);

        if (error) throw error;

        alert("Reservation successfully saved");
        form.reset();

    } catch (error) {
        console.error("Error in Supabase:", error.message);
        alert("There was an error: " + error.message);
    }
}