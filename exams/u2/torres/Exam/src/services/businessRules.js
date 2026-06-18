const config = require('../config/appConfig');

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function getBrandTier(brand) {
  const normalizedBrand = normalize(brand);
  const premiumBrands = config.premiumBrands.map(normalize);

  return premiumBrands.includes(normalizedBrand) ? 'premium' : 'standard';
}

function getSizeRange(size) {
  const normalizedSize = normalize(size);
  const numericSize = Number(normalizedSize);

  if (Number.isFinite(numericSize)) {
    if (numericSize <= 6) return 'junior';
    if (numericSize <= 8) return 'intermediate';
    return 'senior';
  }

  if (['xs', 's', 'small'].includes(normalizedSize)) return 'junior';
  if (['m', 'medium'].includes(normalizedSize)) return 'intermediate';
  if (['l', 'xl', 'large', 'extra large'].includes(normalizedSize)) return 'senior';

  return 'unknown';
}

function classifyGloveRange(brand, size) {
  const brandTier = getBrandTier(brand);
  const sizeRange = getSizeRange(size);

  if (brandTier === 'premium' && sizeRange === 'senior') {
    return {
      brandTier,
      sizeRange,
      assignedRange: 'professional',
      rangeReason: 'Premium brand with senior size.'
    };
  }

  if (brandTier === 'premium' && sizeRange === 'intermediate') {
    return {
      brandTier,
      sizeRange,
      assignedRange: 'advanced',
      rangeReason: 'Premium brand with intermediate size.'
    };
  }

  if (sizeRange === 'junior') {
    return {
      brandTier,
      sizeRange,
      assignedRange: 'junior',
      rangeReason: 'Junior size range.'
    };
  }

  if (sizeRange === 'unknown') {
    return {
      brandTier,
      sizeRange,
      assignedRange: 'review',
      rangeReason: 'Size could not be classified automatically.'
    };
  }

  return {
    brandTier,
    sizeRange,
    assignedRange: 'training',
    rangeReason: 'Standard brand or non-professional size combination.'
  };
}

function applyBusinessRules(payload) {
  const {
    brandTier,
    sizeRange,
    assignedRange,
    rangeReason,
    ...safePayload
  } = payload;

  const nextPayload = {
    ...safePayload,
    objectType: safePayload.objectType || config.objectName
  };

  if (config.businessRule === 'brand_size_range' && nextPayload.brand && nextPayload.size) {
    Object.assign(nextPayload, classifyGloveRange(nextPayload.brand, nextPayload.size));
  }

  return nextPayload;
}

module.exports = {
  classifyGloveRange,
  applyBusinessRules
};
