const SUPABASE_URL = 'https://qyrznlnkpkzddmilahma.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cnpubG5rcGt6ZGRtaWxhaG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MTYzOTUsImV4cCI6MjA5MjI5MjM5NX0.lOh4PPuDzS8pWZK1sbhKzzgUITkChAM9FzRo7J2Fl5A';
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function submitPatient(event) {
    event.preventDefault();
    const dni = document.getElementById('dni').value;
    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    await client.from('patients').insert([{ dni, full_name, email }]);
    window.location.href = 'patient_table.html';
}

async function loadPatients() {
    const { data } = await client.from('patients').select('*');
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    data.forEach(p => {
        tbody.innerHTML += `<tr><td>${p.dni}</td><td>${p.full_name}</td><td>${p.email}</td></tr>`;
    });
}

async function submitAppointment(event) {
    event.preventDefault();
    const patient_dni = document.getElementById('patient_dni').value;
    const therapy = document.getElementById('therapy').value;
    const app_date = document.getElementById('app_date').value;
    await client.from('appointments').insert([{ patient_dni, therapy, app_date }]);
    window.location.href = 'appointment_table.html';
}

async function loadAppointments() {
    const { data } = await client.from('appointments').select('*');
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    data.forEach(a => {
        tbody.innerHTML += `<tr><td>${a.patient_dni}</td><td>${a.therapy}</td><td>${a.app_date}</td></tr>`;
    });
}

async function submitSpecialist(event) {
    event.preventDefault();
    const full_name = document.getElementById('full_name').value;
    const specialty = document.getElementById('specialty').value;
    await client.from('specialists').insert([{ full_name, specialty }]);
    window.location.href = 'specialist_table.html';
}

async function loadSpecialists() {
    const { data } = await client.from('specialists').select('*');
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    data.forEach(s => {
        tbody.innerHTML += `<tr><td>${s.full_name}</td><td>${s.specialty}</td></tr>`;
    });
}

function filterTable() {
    const input = document.getElementById('searchInput').value.toUpperCase();
    const trs = document.getElementById('tableBody').getElementsByTagName('tr');
    for (let i = 0; i < trs.length; i++) {
        trs[i].style.display = trs[i].innerText.toUpperCase().indexOf(input) > -1 ? "" : "none";
    }
}