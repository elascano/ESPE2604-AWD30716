export class CellphoneRules {

  static calculateTier(price: number) {

    if (price < 300)
      return "LOW";

    if (price <= 700)
      return "MID";

    return "HIGH";
  }

  static calculateRecommendation(
    releaseDate: Date
  ) {

    const today = new Date();

    const years =
      (today.getTime() -
        releaseDate.getTime()) /
      (1000 * 60 * 60 * 24 * 365);

    return years <= 2
      ? "RECOMMENDED"
      : "NOT_RECOMMENDED";
  }
}