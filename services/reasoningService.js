class ReasoningService {
  getReason(car, allCars) {
    if (!allCars.length) return "";

    const avg = (key) =>
      allCars.reduce((a, b) => a + b[key], 0) / allCars.length;

    const advantages = [
      {
        name: "вигідна ціна",
        value: avg("price") - car.price,
      },
      {
        name: "висока надійність",
        value: car.engineReliability - avg("engineReliability"),
      },
      {
        name: "економне паливо",
        value: avg("fuelConsumption") - car.fuelConsumption,
      },
    ];

    const best = advantages
      .filter(a => a.value > 0)
      .map(a => a.name);

    return best.length
      ? `Переваги: ${best.join(", ")}`
      : "Збалансований варіант";
  }
}

module.exports = new ReasoningService();