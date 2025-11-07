// FlyOn Main JS (v4 - 상세페이지 상단 요약 + 자동 색상 표시)

const continents = ["아시아", "유럽", "북아메리카", "오세아니아"];

const countriesData = {
  아시아: [
    { id: "jp", name: "일본", flag: "🇯🇵", sentiment: 75, rate: 1250.5, change: -1.2, favorite: false, alert: false },
    { id: "th", name: "태국", flag: "🇹🇭", sentiment: 45, rate: 35.8, change: 0.5, favorite: false, alert: false },
    { id: "kr", name: "한국", flag: "🇰🇷", sentiment: 60, rate: 1.0, change: 0.0, favorite: false, alert: false },
  ],
  유럽: [
    { id: "fr", name: "프랑스", flag: "🇫🇷", sentiment: 82, rate: 1450.2, change: 2.1, favorite: false, alert: false },
    { id: "it", name: "이탈리아", flag: "🇮🇹", sentiment: 78, rate: 1448.9, change: 1.8, favorite: false, alert: false },
    { id: "de", name: "독일", flag: "🇩🇪", sentiment: 68, rate: 1452.3, change: 1.5, favorite: false, alert: false },
  ],
  북아메리카: [
    { id: "us", name: "미국", flag: "🇺🇸", sentiment: 85, rate: 1320.5, change: 0.8, favorite: false, alert: false },
    { id: "ca", name: "캐나다", flag: "🇨🇦", sentiment: 72, rate: 980.2, change: -0.3, favorite: false, alert: false },
    { id: "mx", name: "멕시코", flag: "🇲🇽", sentiment: 42, rate: 75.6, change: 1.2, favorite: false, alert: false },
  ],
  오세아니아: [
    { id: "au", name: "호주", flag: "🇦🇺", sentiment: 70, rate: 890.4, change: -0.5, favorite: false, alert: false },
    { id: "nz", name: "뉴질랜드", flag: "🇳🇿", sentiment: 55, rate: 820.1, change: 0.2, favorite: false, alert: false },
  ],
};

let selectedContinent = "아시아";
let selectedCountry = null;

function loadChartJS(callback) {
  if (window.Chart) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/chart.js";
  script.onload = callback;
  document.head.appendChild(script);
}

function getSentimentColor(index) {
  if (index < 50) return "#22C55E";
  if (index < 70) return "#FACC15";
  return "#EF4444";
}
function getSentimentLabel(index) {
  if (index < 50) return "저비용";
  if (index < 70) return "균형";
  return "성수기";
}

function renderContinents() {
  const container = document.getElementById("continent-buttons");
  container.innerHTML = "";
  continents.forEach((c) => {
    const btn = document.createElement("button");
    btn.textContent = c;
    btn.className = "continent-btn" + (c === selectedContinent ? " active" : "");
    btn.onclick = () => {
      selectedContinent = c;
      selectedCountry = null;
      renderContinents();
      renderCountries();
      document.getElementById("country-detail").style.display = "none";
    };
    container.appendChild(btn);
  });
}

function renderCountries() {
  const area = document.getElementById("country-list");
  const list = countriesData[selectedContinent];
  list.sort((a, b) => (a.favorite && !b.favorite ? -1 : !a.favorite && b.favorite ? 1 : 0));
  area.innerHTML = "";

  list.forEach((c) => {
    const card = document.createElement("div");
    card.className = "country-card";
    card.onclick = () => selectCountry(c.id);

    const sentimentColor = getSentimentColor(c.sentiment);
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

function selectCountry(id) {
  const list = countriesData[selectedContinent];
  selectedCountry = list.find((x) => x.id === id);
  renderDetail();
}

function renderDetail() {
  const box = document.getElementById("country-detail");
  const c = selectedCountry;
  if (!c) {
    box.style.display = "none";
    return;
  }

  const sentimentColor = getSentimentColor(c.sentiment);
  const sentimentLabel = getSentimentLabel(c.sentiment);

  box.style.display = "block";
  box.innerHTML = `
    <div class="detail-header">
      <div style="display:flex;align-items:center;gap:0.8rem;">
        <span style="font-size:3rem">${c.flag}</span>
        <h2 style="font-size:1.8rem;font-weight:700">${c.name}</h2>
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

    <div class="summary-section">
      <div class="summary-box sentiment-box">
        <div class="label">여행심리지수</div>
        <div class="score" style="color:${sentimentColor}">${c.sentiment}</div>
        <div class="status">${sentimentLabel}</div>
      </div>

      <div class="summary-box info-box">
        <h4>요약</h4>
        <ul>
          <li>환율: ${c.change >= 0 ? "+" : ""}${c.change}% 변동</li>
          <li>출입국자: +5% 증가</li>
          <li>소비지출: +3% 증가</li>
        </ul>
        <p class="desc">예시 문구: 이 시기는 ${sentimentLabel} 시즌으로, 여행비용 대비 만족도가 ${sentimentLabel === "성수기" ? "높지만 비용이 증가" : sentimentLabel === "균형" ? "안정적" : "저렴"}합니다.</p>
      </div>
    </div>

    <div class="chart-grid">
      <div><canvas id="chart1"></canvas></div>
      <div><canvas id="chart2"></canvas></div>
      <div><canvas id="chart3"></canvas></div>
    </div>

    <div class="close-area">
      <button id="close-detail" onclick="closeDetail()">닫기</button>
    </div>
  `;

  loadChartJS(() => drawCharts());
}

function drawCharts() {
  const ctx1 = document.getElementById("chart1");
  const ctx2 = document.getElementById("chart2");
  const ctx3 = document.getElementById("chart3");

  new Chart(ctx1, {
    type: "line",
    data: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      datasets: [{
        label: "환율 추이",
        data: [1280, 1265, 1245, 1255, 1260, 1450],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.1)",
        fill: true,
        tension: 0.4,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });

  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      datasets: [{
        label: "출입국자 수 (천명)",
        data: [120, 130, 145, 155, 170, 185],
        backgroundColor: "#22C55E",
      }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });

  new Chart(ctx3, {
    type: "line",
    data: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      datasets: [{
        label: "소비지출 지수",
        data: [85, 88, 91, 94, 98, 103],
        borderColor: "#FACC15",
        backgroundColor: "rgba(250,204,21,0.2)",
        fill: true,
        tension: 0.4,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });
}

function toggleFavorite(e, id) {
  e.stopPropagation();
  const list = countriesData[selectedContinent];
  const c = list.find((x) => x.id === id);
  c.favorite = !c.favorite;
  if (selectedCountry && selectedCountry.id === id) {
    selectedCountry.favorite = c.favorite;
    renderDetail();
  }
  renderCountries();
}

function toggleAlert(e, id) {
  e.stopPropagation();
  const list = countriesData[selectedContinent];
  const c = list.find((x) => x.id === id);
  c.alert = !c.alert;
  if (selectedCountry && selectedCountry.id === id) {
    selectedCountry.alert = c.alert;
    renderDetail();
  }
  renderCountries();
}

function closeDetail() {
  document.getElementById("country-detail").style.display = "none";
  selectedCountry = null;
}

document.addEventListener("DOMContentLoaded", () => {
  renderContinents();
  renderCountries();
});
