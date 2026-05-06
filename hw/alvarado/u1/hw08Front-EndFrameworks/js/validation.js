// JavaScript Document

export function calculateAge(birthDateString) {
    if (!birthDateString) return 0;

    const today = new Date();
    const birthDate = new Date(birthDateString);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 0 ? age : 0;
}

export function validateBirthDate(birthDateString) {
    if (!birthDateString) return false;

    const birthDate = new Date(birthDateString);
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120); 

    if (birthDate > today) {
        alert("Birthdate cannot be in the future.");
        return false;
    }

    if (birthDate < minDate) {
        alert("Please enter a valid year (less than 120 years ago).");
        return false;
    }

    return true;
}

export function validateEcuadorianID(id) {
    if (!/^\d{10}$/.test(id)) return false;

    const regionDigit = parseInt(id.substring(0, 2));
    if (regionDigit < 1 || regionDigit > 24) return false;

    const lastDigit = parseInt(id[9]);

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

export function validateForm(form) {
    if (!form.first_name || !form.last_name) {
        alert("First Name and Last Name cannot be empty.");
        return false;
    }

    if (!validateEcuadorianID(form.identification_number)) {
        alert("Invalid Ecuadorian ID.");
        return false;
    }

    if (!validateBirthDate(form.birth_date)) {
        return false;
    }

    form.age = calculateAge(form.birth_date);

    if (!form.email) {
        alert("Email is required.");
        return false;
    }

    return true;
}