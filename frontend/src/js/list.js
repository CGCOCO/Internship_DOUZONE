// ===============================
// 📋 FlyOn List JS
// (대륙 선택 + 국가 카드 목록 + 즐겨찾기/알림 + 상세 이동)
// — 백엔드 연동 버전 —
// ===============================

// 로컬 데이터 로드
loadData();

// 현재 선택된 대륙
let selectedContinent = "아시아";

// ===============================
// 🧭 대륙 버튼 렌더링
// ===============================
function renderContinents() {
  const container = document.getElementById("continent-buttons");
  if (!container) return;

  container.innerHTML = "";

  continents.forEach((continent) => {
    const btn = document.createElement("button");
    btn.textContent = continent;
    btn.className = "continent-btn" + (continent === selectedContinent ? " active" : "");

    btn.addEventListener("click", () => {
      selectedContinent = continent;
      renderContinents();
      renderCountries();
    });

    container.appendChild(btn);
  });
}

// ===============================
// 🌍 국가 카드 목록 렌더링
// (여기서 백엔드 실시간 데이터 호출함)
// ===============================
async function renderCountries() {
  const area = document.getElementById("country-list");
  if (!area) return;

  const list = countriesData[selectedContinent];
  if (!list) return;

  // 즐겨찾기 상단 정렬
  list.sort((a, b) => (a.favorite && !b.favorite ? -1 : !a.favorite && b.favorite ? 1 : 0));

  area.innerHTML = "";

  // ===============================
  // 🔥 각 국가별 실시간 여행심리지수 받아오기
  // ===============================
  for (const c of list) {
    let realSentiment = c.sentiment; // 기본 더미값

    try {
      const res = await fetch(
        `http://localhost:8080/api/travel/index?country=${c.id.toUpperCase()}`
      );
      const data = await res.json();

      if (data && typeof data.sentimentIndex !== "undefined") {
        realSentiment = data.sentimentIndex;
      }
    } catch (e) {
      console.warn(`⚠ ${c.id} 실시간 조회 실패 — 더미 사용`);
    }

    const sentimentColor = getSentimentColor(realSentiment);

    // ===============================
    // 국가 카드 UI (원본 그대로 유지)
    // ===============================
    const card = document.createElement("div");
    card.className = "country-card";

    card.addEventListener("click", () => {
      window.location.href =
        `detail.html?id=${encodeURIComponent(c.id)}&continent=${encodeURIComponent(selectedContinent)}`;
    });

    card.innerHTML = `
      <div class="country-header">
        <div style="display:flex;align-items:center;gap:0.6rem;">
          <span style="font-size:2rem">${c.flag}</span>
          <h3 style="font-size:1.2rem;font-weight:700">${c.name}</h3>
        </div>
        <div class="icon-group">
          <button class="icon-btn" onclick="toggleFavorite(event, '${c.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="${c.favorite ? "#FACC15" : "none"}"
              stroke="${c.favorite ? "#FACC15" : "#D1D5DB"}" stroke-width="1.5" viewBox="0 0 24 24" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63
                2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </button>
          <button class="icon-btn" onclick="toggleAlert(event, '${c.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="${c.alert ? "#3B82F6" : "none"}"
              stroke="${c.alert ? "#3B82F6" : "#D1D5DB"}" stroke-width="1.5" viewBox="0 0 24 24" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4
                c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-1.3
                1.3c-.2.2-.3.45-.3.7 0 .55.45 1 1 1h13.2c.55 0 1-.45 1-1 0-.25-.1-.5-.3-.7L18 16z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="country-body">
        <div class="label">여행심리지수</div>
        <div class="sentiment" style="color:${sentimentColor}">${realSentiment}</div>
      </div>

      <div class="country-footer">
        <div class="rate">₩${c.rate.toFixed(2)}</div>
        <div class="change" style="color:${c.change >= 0 ? "#EF4444" : "#22C55E"}">
          ${c.change >= 0 ? "+" : ""}${c.change}%
        </div>
      </div>
    `;

    area.appendChild(card);
  }
}
// ===============================
// ⭐ 즐겨찾기 & 🔔 알림 토글
// ===============================
function toggleFavorite(e, id) {
  e.stopPropagation();
  for (const continent in countriesData) {
    const c = countriesData[continent].find((x) => x.id === id);
    if (c) {
      c.favorite = !c.favorite;
      saveData();
      break;
    }
  }
  renderCountries(); // 즉시 재렌더링
}

function toggleAlert(e, id) {
  e.stopPropagation();
  for (const continent in countriesData) {
    const c = countriesData[continent].find((x) => x.id === id);
    if (c) {
      c.alert = !c.alert;
      saveData();
      break;
    }
  }
  renderCountries(); // 즉시 반영
}

// ===============================
// 🚀 초기 실행
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderContinents();
  renderCountries();
});

/*// ===============================
// 📋 FlyOn List JS
// (대륙 선택 + 국가 카드 목록 + 즐겨찾기/알림 + 상세 이동)
// ===============================
loadData();
// 현재 선택된 대륙
let selectedContinent = "아시아";

// ===============================
// 🧭 대륙 버튼 렌더링
// ===============================
function renderContinents() {
  const container = document.getElementById("continent-buttons");
  if (!container) return;

  container.innerHTML = "";

  continents.forEach((continent) => {
    const btn = document.createElement("button");
    btn.textContent = continent;
    btn.className = "continent-btn" + (continent === selectedContinent ? " active" : "");

    btn.addEventListener("click", () => {
      selectedContinent = continent;
      renderContinents();
      renderCountries();
    });

    container.appendChild(btn);
  });
}

// ===============================
// 🌍 국가 카드 목록 렌더링
// ===============================
function renderCountries() {
  const area = document.getElementById("country-list");
  if (!area) return;

  const list = countriesData[selectedContinent];
  if (!list) return;

  // 즐겨찾기된 국가를 상단으로 정렬
  list.sort((a, b) => (a.favorite && !b.favorite ? -1 : !a.favorite && b.favorite ? 1 : 0));

  area.innerHTML = "";

  list.forEach((c) => {
    const sentimentColor = getSentimentColor(c.sentiment);

    const card = document.createElement("div");
    card.className = "country-card";

    // 상세페이지로 이동 (id, continent 전달)
    card.addEventListener("click", () => {
      window.location.href = `detail.html?id=${encodeURIComponent(c.id)}&continent=${encodeURIComponent(selectedContinent)}`;
    });


    card.innerHTML = `
      <div class="country-header">
        <div style="display:flex;align-items:center;gap:0.6rem;">
          <span style="font-size:2rem">${c.flag}</span>
          <h3 style="font-size:1.2rem;font-weight:700">${c.name}</h3>
        </div>
        <div class="icon-group">
          <button class="icon-btn" onclick="toggleFavorite(event, '${c.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="${c.favorite ? "#FACC15" : "none"}"
              stroke="${c.favorite ? "#FACC15" : "#D1D5DB"}" stroke-width="1.5" viewBox="0 0 24 24" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63
                2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </button>
          <button class="icon-btn" onclick="toggleAlert(event, '${c.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" fill="${c.alert ? "#3B82F6" : "none"}"
              stroke="${c.alert ? "#3B82F6" : "#D1D5DB"}" stroke-width="1.5" viewBox="0 0 24 24" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4
                c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-1.3
                1.3c-.2.2-.3.45-.3.7 0 .55.45 1 1 1h13.2c.55 0 1-.45 1-1 0-.25-.1-.5-.3-.7L18 16z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="country-body">
        <div class="label">여행심리지수</div>
        <div class="sentiment" style="color:${sentimentColor}">${c.sentiment}</div>
      </div>

      <div class="country-footer">
        <div class="rate">₩${c.rate.toFixed(2)}</div>
        <div class="change" style="color:${c.change >= 0 ? "#EF4444" : "#22C55E"}">
          ${c.change >= 0 ? "+" : ""}${c.change}%
        </div>
      </div>
    `;

    area.appendChild(card);
  });
}

// ===============================
// ⭐ 즐겨찾기 & 🔔 알림 토글
// ===============================
function toggleFavorite(e, id) {
  e.stopPropagation();
  for (const continent in countriesData) {
    const c = countriesData[continent].find((x) => x.id === id);
    if (c) {
      c.favorite = !c.favorite;
      saveData();
      break;
    }
  }
  renderCountries(); // ✅ 즉시 반영
}

function toggleAlert(e, id) {
  e.stopPropagation();
  for (const continent in countriesData) {
    const c = countriesData[continent].find((x) => x.id === id);
    if (c) {
      c.alert = !c.alert;
      saveData();
      break;
    }
  }
  renderCountries(); // ✅ 즉시 반영
}



// ===============================
// 🚀 초기 실행
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderContinents();
  renderCountries();
});
*/