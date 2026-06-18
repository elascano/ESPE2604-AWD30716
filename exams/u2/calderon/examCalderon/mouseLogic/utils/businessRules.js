const calculateRangeCategory = (price) => {
    if (price >= 80) return 'High-End';
    if (price >= 40) return 'Mid-Range';
    return 'Budget';
};

const calculateRecommendation = (releaseDateString) => {
    const releaseDate = new Date(releaseDateString);
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    return releaseDate >= twoYearsAgo ? 'Highly Recommended' : 'Outdated Model';
};

module.exports = {
    calculateRangeCategory,
    calculateRecommendation
};