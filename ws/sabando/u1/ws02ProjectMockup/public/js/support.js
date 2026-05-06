const { createClient } = supabase;

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('supportForm');
const alertSuccess = document.getElementById('alert-success');
const alertError = document.getElementById('alert-error');
const submitBtn = document.getElementById('submitSupportForm');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    alertSuccess.style.display = 'none';
    alertError.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const { error } = await client.from('support_tickets').insert({
        full_name: document.getElementById('fullName').value.trim(),
        ruc: document.getElementById('ruc').value.trim(),
        email: document.getElementById('email').value.trim(),
        category: document.getElementById('category').value,
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim(),
        priority: document.getElementById('priority').value
    });

    if (error) {
        alertError.style.display = 'block';
        alertError.textContent = 'Error: ' + error.message;
    } else {
        alertSuccess.style.display = 'block';
        form.reset();
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
});
