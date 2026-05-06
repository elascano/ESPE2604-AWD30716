document.addEventListener('DOMContentLoaded', () => {
	const birthDate = document.getElementById('birth_date');
	const age = document.getElementById('age');

	const calculateAge = () => {
		const value = birthDate.value;

		if (!value) {
			age.value = '';
			return;
		}

		const birthDateValue = new Date(`${value}T00:00:00`);
		const today = new Date();

		let years = today.getFullYear() - birthDateValue.getFullYear();
		const monthToday = today.getMonth();
		const monthBirth = birthDateValue.getMonth();
		const dayToday = today.getDate();
		const dayBirth = birthDateValue.getDate();

		if (monthToday < monthBirth || (monthToday === monthBirth && dayToday < dayBirth)) {
			years -= 1;
		}

		age.value = years >= 0 ? String(years) : '';
	};

	birthDate.addEventListener('change', calculateAge);
	birthDate.addEventListener('input', calculateAge);

	calculateAge();
});