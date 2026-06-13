// utils/calculations.js

const calculateRangeCategory = (price) => {
    if (price >= 800) return 'High';
    if (price >= 400) return 'Medium';
    return 'Low';
};

const calculateRecommendation = (releaseDate) => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    return releaseDate >= twoYearsAgo ? 'Highly Recommended' : 'Previous Model';
};

module.exports = {
    calculateRangeCategory,
    calculateRecommendation
};