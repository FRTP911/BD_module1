const { CRITERIA } = require('../config/constants');

class AnalysisService {
  calculate(cars) {
    if (!cars?.length) return [];

    const rawCars = cars.map(c => c.toObject ? c.toObject() : c);

    const limits = {};

    for (const key in CRITERIA) {
      const values = rawCars.map(c => Number(c[key]) || 0);

      limits[key] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    }

    return rawCars.map(car => {
      let finalScore = 0;

      for (const key in CRITERIA) {
        const { weight, type } = CRITERIA[key];
        const { min, max } = limits[key];
        const val = Number(car[key]) || 0;

        let normalized = 1;

        if (max !== min) {
          normalized = type === "max"
            ? (val - min) / (max - min)
            : (max - val) / (max - min);
        }

        finalScore += normalized * weight;
      }

      return {
        ...car,
        finalScore: +finalScore.toFixed(4),
      };
    }).sort((a, b) => b.finalScore - a.finalScore);
  }
}

module.exports = new AnalysisService();