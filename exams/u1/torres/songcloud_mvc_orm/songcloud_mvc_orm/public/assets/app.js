function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function calculatePopularity(streams, likes, rating) {
    const streamScore = Math.min(45, Math.log10(streams + 1) * 8);
    const likeRatio = streams > 0 ? Math.min(25, (likes / streams) * 200) : 0;
    const ratingScore = clamp(rating, 0, 5) * 6;
    return Math.min(100, streamScore + likeRatio + ratingScore);
}

function formatDuration(seconds) {
    seconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${String(remaining).padStart(2, '0')}`;
}

function updateCalculationPreview(form) {
    const streams = Number(form.streams?.value || 0);
    const likes = Number(form.likes?.value || 0);
    const rating = Number(form.rating?.value || 0);
    const royalty = Number(form.royalty_per_stream?.value || 0);
    const duration = Number(form.duration_seconds?.value || 0);

    const revenue = streams * royalty;
    const score = calculatePopularity(streams, likes, rating);

    document.querySelector('[data-revenue]').textContent = `$${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.querySelector('[data-score]').textContent = `${score.toFixed(1)}/100`;
    document.querySelector('[data-duration]').textContent = formatDuration(duration);
}

const songForm = document.querySelector('[data-song-form]');
if (songForm) {
    updateCalculationPreview(songForm);
    songForm.addEventListener('input', () => updateCalculationPreview(songForm));
}
