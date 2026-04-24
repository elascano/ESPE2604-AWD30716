const SUPABASE_URL = 'https://mibitvmvognqfzzhobqg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jOAdRf4yNBzsL2KC-8RsKQ_QtKRXFLo';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
        const { error } = await _supabase
            .from('satisfaction_surveys')
            .insert([surveyData]);

        if (error) throw error;

        alert("Thank you for your feedback! Survey submitted");
        form.reset();

    } catch (error) {
        console.error("Error:", error.message);
        alert("The survey could not be sent:" + error.message);
    }
}