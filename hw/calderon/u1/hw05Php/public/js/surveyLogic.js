
async function handleSurvey(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const surveyData = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        visit_date: formData.get('visit_date'),
        food_quality: parseInt(formData.get('food_quality')),
        service_quality: parseInt(formData.get('service_quality')),
        cleanliness: parseInt(formData.get('cleanliness')),
        recommendation: formData.get('recommendation'),
        comments: formData.get('comments')
    };

    try {
        const response = await fetch('../backend/survey.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(surveyData)
        });

        const result = await response.json();

        if (result.success) {
            alert("Thank you for your feedback! Survey submitted");
            form.reset();
        } else {
            alert("Error: " + result.error);
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Connection error");
    }
}