const { CRITERIA } = require("../config/constants");

class ReasoningService {
  getReason(car, allCars) {
    if (!allCars.length) return "";

    const rawCars = allCars.map((c) => (c.toObject ? c.toObject() : c));

    // 1. знаходимо min/max для нормалізації
    const limits = {};
    for (const key in CRITERIA) {
      const values = rawCars.map((c) => Number(c[key]) || 0);
      limits[key] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    }

    // 2. рахуємо внески критеріїв
    const contributions = [];

    for (const key in CRITERIA) {
      const { weight, type } = CRITERIA[key];
      const { min, max } = limits[key];
      const val = Number(car[key]) || 0;

      let normalized = 1;

      if (max !== min) {
        normalized =
          type === "max"
            ? (val - min) / (max - min)
            : (max - val) / (max - min);
      }

      const contribution = normalized * weight;

      contributions.push({
        key,
        contribution,
      });
    }

    // 3. беремо топ-3 критерії
    const top = contributions
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 3);

    const namesMap = {
      price: "Вигідна ціна",
      engineReliability: "Надійність двигуна",
      fuelConsumption: "Витрата палива",
      maintenanceCost: "Сервіс",
      insuranceCost: "Страхування",
    };

    const reasons = top.map((t) => {
      const label = namesMap[t.key] || t.key;
      const value = car[t.key];

      return `${label}: ${value}`;
    });

    return reasons.length
      ? `Топ характеристики: ${reasons.join(", ")}`
      : "Збалансований варіант";
  }
}

module.exports = new ReasoningService();
