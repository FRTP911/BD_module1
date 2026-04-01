// 1. КОНФІГУРАЦІЯ ТА ГЛОБАЛЬНІ ЗМІННІ
let carData = [];

const WEIGHTS = {
  price: 0.35,
  engineReliability: 0.25,
  fuelConsumption: 0.15,
  maintenanceCost: 0.15,
  insuranceCost: 0.1,
};

// 2. ДОДАВАННЯ НОВОГО АВТО (ФОРМА)
document.getElementById("carForm").onsubmit = async (e) => {
  e.preventDefault();

  const fields = {
    brand: document.getElementById("brand").value.trim(),
    model: document.getElementById("model").value.trim(),
    year: Number(document.getElementById("year").value),
    price: Number(document.getElementById("price").value),
    reliability: Number(document.getElementById("reliability").value),
    fuel: Number(document.getElementById("fuel").value),
    carClass: document.getElementById("carClass").value,
    maint: Number(document.getElementById("maint").value),
    ins: Number(document.getElementById("ins").value),
  };

  // Сувора валідація
  const nameRegex = /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ\s-]+$/;
  if (!nameRegex.test(fields.brand)) return alert("❌ Марка має містити лише літери!");
  if (fields.year < 1990 || fields.year > 2026) return alert("❌ Рік має бути від 1990 до 2026!");
  if (fields.price <= 0 || fields.fuel <= 0) return alert("❌ Ціна та витрати мають бути > 0!");

  const carBody = {
    brand: fields.brand,
    model: fields.model,
    year: fields.year,
    price: fields.price,
    engineReliability: fields.reliability,
    fuelConsumption: fields.fuel,
    carClass: fields.carClass,
    maintenanceCost: fields.maint,
    insuranceCost: fields.ins,
  };

  try {
    const res = await fetch("/api/cars/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(carBody),
    });

    if (res.ok) {
      alert("✅ Авто успішно додано до бази!");
      e.target.reset();
    } else {
      const err = await res.text();
      alert(`❌ Сервер повернув помилку: ${err}`);
    }
  } catch (err) {
    alert("❌ Помилка з'єднання з сервером!");
  }
};

// 3. ЗАВАНТАЖЕННЯ ДАНИХ
async function fetchAndRank() {
  try {
    const res = await fetch("/api/cars/analyze");
    carData = await res.json();
  } catch (err) {
    console.error("Помилка завантаження:", err);
  }
}

// 4. ГЕНЕРАЦІЯ РОЗУМНОГО ВЕРДИКТУ
function getSmartReasoning(car, allCars) {
  if (!allCars || allCars.length === 0) return "";

  const averages = {
    price: allCars.reduce((a, b) => a + b.price, 0) / allCars.length,
    reliability: allCars.reduce((a, b) => a + b.engineReliability, 0) / allCars.length,
    fuel: allCars.reduce((a, b) => a + b.fuelConsumption, 0) / allCars.length,
    maint: allCars.reduce((a, b) => a + b.maintenanceCost, 0) / allCars.length,
  };

  const advantages = [
    { name: `вигідною ціною (${car.price.toLocaleString()} грн)`, power: ((averages.price - car.price) / (averages.price || 1)) * WEIGHTS.price },
    { name: `високою надійністю двигуна (${car.engineReliability.toLocaleString()} км)`, power: ((car.engineReliability - averages.reliability) / (averages.reliability || 1)) * WEIGHTS.engineReliability },
    { name: `низькими витратами палива (${car.fuelConsumption} л/100км)`, power: ((averages.fuel - car.fuelConsumption) / (averages.fuel || 1)) * WEIGHTS.fuelConsumption },
    { name: `дешевим обслуговуванням (${car.maintenanceCost.toLocaleString()} грн)`, power: ((averages.maint - car.maintenanceCost) / (averages.maint || 1)) * WEIGHTS.maintenanceCost },
  ];

  const top3 = advantages.filter(a => a.power > 0).sort((a, b) => b.power - a.power).slice(0, 3);

  return top3.length === 0
    ? "Це авто має найбільш збалансовані характеристики серед усіх конкурентів."
    : `Авто є оптимальним вибором завдяки: ${top3.map(a => a.name).join(", ")}.`;
}

// 5. АНАЛІЗ (ПЕРЕМОЖЕЦЬ)
async function analyze() {
  await fetchAndRank();
  const resultsDiv = document.getElementById("results");
  if (!carData || carData.length === 0) return alert("База порожня!");

  const best = carData[0];
  const reasoning = getSmartReasoning(best, carData);

  resultsDiv.innerHTML = `
    <div class="best-card">
        <h2 style="color: #1e293b;">🏆 Найкращий вибір: ${best.brand} ${best.model}</h2>
        <p style="font-size: 1.1em; line-height: 1.6;"><strong>Вердикт СППР:</strong> ${reasoning}</p>
        <hr style="border:0; border-top: 1px solid #e2e8f0; margin:15px 0;">
        <p><strong>Деталі:</strong> Рейтинг ${best.finalScore} | Клас: ${best.carClass} | Рік: ${best.year}</p>
        <button onclick="showAlts()" class="btn-alt">🔄 Показати альтернативи</button>
    </div>
  `;
}

// 6. АЛЬТЕРНАТИВИ
function showAlts() {
  if (carData.length < 2) return alert("Немає інших варіантів для порівняння.");

  const alts = carData.slice(1, 4);
  const resultsDiv = document.getElementById("results");

  let html = '<h3 style="margin-top:25px; color: #334155; text-align:center;">Варті уваги альтернативи:</h3>';

  alts.forEach((c, i) => {
    const altReasoning = getSmartReasoning(c, carData);
    html += `
      <div class="alt-card" style="border-left: 5px solid #64748b; background: #f8fafc; padding: 15px; margin-bottom: 12px; border-radius: 0 8px 8px 0;">
          <div style="display: flex; justify-content: space-between;">
              <strong style="font-size: 1.05em;">#${i + 2} ${c.brand} ${c.model}</strong>
              <span style="color: #64748b; font-weight: bold;">Бал: ${c.finalScore}</span>
          </div>
          <p style="margin: 8px 0 0 0; color: #475569; font-size: 0.95em;">
              <span style="color: #3b82f6;">●</span> ${altReasoning}
          </p>
      </div>`;
  });

  if (!resultsDiv.querySelector("h3")) resultsDiv.innerHTML += html;
}

// 7. МАТРИЦЯ (Таблиця всіх авто)
async function showMatrix() {
  await fetchAndRank();
  const resultsDiv = document.getElementById("results");
  if (!carData || carData.length === 0) return alert("Немає даних!");

  let html = `
    <h3 style="text-align:center;">Аналітична матриця характеристик</h3>
    <div style="overflow-x: auto; margin-top: 15px;">
        <table>
            <thead>
                <tr>
                    <th>Авто</th><th>Клас</th><th>Ціна</th><th>Надійність</th><th>Паливо</th><th>Сервіс</th><th>Рейтинг</th>
                </tr>
            </thead>
            <tbody>
  `;

  carData.forEach(c => {
    html += `
      <tr>
          <td><b>${c.brand} ${c.model}</b></td>
          <td>${c.carClass}</td>
          <td>${c.price.toLocaleString()}</td>
          <td>${c.engineReliability.toLocaleString()}</td>
          <td>${c.fuelConsumption}</td>
          <td>${c.maintenanceCost.toLocaleString()}</td>
          <td style="background: #f0f9ff; font-weight: bold; text-align: center; color: #0369a1;">${c.finalScore}</td>
      </tr>`;
  });

  html += "</tbody></table></div>";
  resultsDiv.innerHTML = html;
}