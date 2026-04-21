
function calculateAge() {
    const birthDateInput = document.getElementById("fecha_nacimiento");
    const ageInput = document.getElementById("edad");

    if (birthDateInput && ageInput && birthDateInput.value) {
        const today = new Date();
        const birthDate = new Date(birthDateInput.value);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        ageInput.value = (age >= 0) ? age : 0;
    }
}

function validateEcuadorianID(id) {
    if (!/^\d{10}$/.test(id)) return false;

    const regionDigit = parseInt(id.substring(0, 2));
    if (regionDigit < 1 || regionDigit > 24) return false;

    const lastDigit = parseInt(id.substring(9, 10));

    const evenSum =
        parseInt(id[1]) +
        parseInt(id[3]) +
        parseInt(id[5]) +
        parseInt(id[7]);

    const calculateOdd = (n) => {
        let value = n * 2;
        return value > 9 ? value - 9 : value;
    };

    const oddSum =
        calculateOdd(parseInt(id[0])) +
        calculateOdd(parseInt(id[2])) +
        calculateOdd(parseInt(id[4])) +
        calculateOdd(parseInt(id[6])) +
        calculateOdd(parseInt(id[8]));

    const totalSum = evenSum + oddSum;
    const nextTen = Math.ceil(totalSum / 10) * 10;
    let validatorDigit = nextTen - totalSum;

    if (validatorDigit === 10) validatorDigit = 0;

    return validatorDigit === lastDigit;
}

function validateAndSubmitForm(event) {
    event.preventDefault();

    const form = event.target;
    const id = form.cedula.value.trim();

    const errorElement = document.getElementById("errorCedula");

    if (!validateEcuadorianID(id)) {
        if (errorElement) {
            errorElement.textContent = "Invalid ID number";
        } else {
            alert("The ID entered is NOT valid.");
        }
        return;
    }

    if (errorElement) errorElement.textContent = "";

    submitUserForm(form);
}


function submitUserForm(form) {
    fetch(form.action, {
        method: "POST",
        body: new FormData(form)
    })
    .then(res => res.text())
    .then(response => {
        if (response.trim() === "success" || response.trim() === "exito") {
            alert("User registered successfully");

            if (typeof cargarTab === "function") {
                cargarTab('paginas/visualizacionUs.php');
            } else {
                window.location.href = 'paginas/visualizacionUs.php';
            }

        } else {
            alert(response);
        }
    })
    .catch(error => {
        console.error(error);
        alert("Connection error");
    });
}