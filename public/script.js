let carData = [];

// ЗАВАНТАЖЕННЯ І АНАЛІЗ
async function fetchAndRank() {
  try {
    const res = await fetch("/api/cars/analyze");
    carData = await res.json();
  } catch (err) {
    console.error("Помилка завантаження:", err);
  }
}

// АНАЛІЗ 

async function analyze() {
  await fetchAndRank();

  const resultsDiv = document.getElementById("results");

  if (!carData || carData.length === 0) {
    return alert("База порожня!");
  }

  const best = carData[0];

  resultsDiv.innerHTML = `
    <div class="best-card">
      <h2>🏆 Найкращий вибір: ${best.brand} ${best.model}</h2>
      <p><strong>Рейтинг:</strong> ${best.finalScore}</p>
      <p><strong>Вердикт СППР:</strong> ${best.reason}</p>
      <hr>
      <p>Клас: ${best.carClass} | Рік: ${best.year}</p>
      <button onclick="showAlts()">🔄 Альтернативи</button>
    </div>
  `;
}

// АЛЬТЕРНАТИВИ

function showAlts() {
  if (carData.length < 2) return alert("Немає альтернатив");

  const resultsDiv = document.getElementById("results");
  const alts = carData.slice(1, 4);

  let html = `<h3>Альтернативи:</h3>`;

  alts.forEach((c, i) => {
    html += `
      <div class="alt-card">
        <strong>#${i + 2} ${c.brand} ${c.model}</strong>
        <p>Бал: ${c.finalScore}</p>
        <p>${c.reason}</p>
      </div>
    `;
  });

  resultsDiv.innerHTML += html;
}

// МАТРИЦЯ

async function showMatrix() {
  await fetchAndRank();

  const resultsDiv = document.getElementById("results");

  if (!carData || carData.length === 0) {
    return alert("Немає даних!");
  }

  let html = `
    <h3 style="text-align:center;">Аналітична матриця характеристик</h3>
    <div style="overflow-x: auto; margin-top: 15px;">
      <table>
        <thead>
          <tr>
            <th>Авто</th>
            <th>Клас</th>
            <th>Ціна</th>
            <th>Надійність</th>
            <th>Паливо (л/100км)</th>
            <th>Сервіс</th>
            <th>Рейтинг</th>
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
        <td style="font-weight: bold; text-align: center;">
          ${c.finalScore}
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  resultsDiv.innerHTML = html;
}
