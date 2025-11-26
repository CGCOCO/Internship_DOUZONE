// ===============================
// FlyOn Detail JS (최종 패치본)
// ===============================
const HISTORY_API = "http://localhost:8080/api/exchange/history";
// 로컬 저장된 즐겨찾기/알림 데이터 로드
loadData();


// ===============================
// 여행심리지수 API
// ===============================
async function fetchSentiment(countryCode) {
  try {
    const res = await fetch(`${API_BASE}/index?country=${countryCode.toUpperCase()}`);
    return await res.json();
  } catch (e) {
    console.error("여행심리지수 API 실패:", countryCode, e);
    return null;
  }
}


// ===============================
// 환율 히스토리 API
// ===============================
async function fetchRateHistory(countryCode) {
  try {
    const res = await fetch(`${HISTORY_API}?country=${countryCode.toUpperCase()}`);
    return await res.json();
  } catch (e) {
    console.error("환율 히스토리 로드 실패:", e);
    return null;
  }
}


// ===============================
// 페이지 로드 시 실행
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  const id = getQueryParam("id");
  const continent = getQueryParam("continent");

  if (!id || !continent) {
    document.body.innerHTML += "<p style='text-align:center;color:#6b7280;'>잘못된 접근입니다.</p>";
    return;
  }

  const countryList = countriesData[continent];
  if (!countryList) {
    document.body.innerHTML += "<p style='text-align:center;color:#6b7280;'>대륙 정보를 찾을 수 없습니다.</p>";
    return;
  }

  const country = countryList.find((c) => c.id === id);
  if (!country) {
    document.body.innerHTML += "<p style='text-align:center;color:#6b7280;'>국가 정보를 찾을 수 없습니다.</p>";
    return;
  }

  renderDetail(country);
});


// ===============================
// 상세 페이지 렌더링
// ===============================
async function renderDetail(c) {
  const box = document.getElementById("country-detail");
  if (!box) return;

  // ------------------------------------
  // 심리지수 API 호출
  // ------------------------------------
  const sentimentData = await fetchSentiment(c.id);
  const sentimentIndex = sentimentData ? sentimentData.sentimentIndex : c.sentiment;

  const sentimentColor = getSentimentColor(sentimentIndex);
  const sentimentLabel = getSentimentLabel(sentimentIndex);

  // ------------------------------------
  // 상세 UI 렌더링
  // ------------------------------------
  box.innerHTML = `
  <div class="detail-header">
    <div style="display:flex;align-items:center;gap:0.8rem;">
      <span style="font-size:3rem">${c.flag}</span>
      <h2 style="font-size:1.8rem;font-weight:700">${c.name}</h2>
    </div>

    <div class="icon-group">
      <button class="icon-btn" id="fav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="${c.favorite ? "#FACC15" : "none"}"
          stroke="${c.favorite ? "#FACC15" : "#D1D5DB"}" stroke-width="1.5"
          viewBox="0 0 24 24" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24
            l-7.19-.61L12 2 9.19 8.63 2 9.24
            l5.46 4.73L5.82 21z"/>
        </svg>
      </button>

      <button class="icon-btn" id="alert-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="${c.alert ? "#3B82F6" : "none"}"
          stroke="${c.alert ? "#3B82F6" : "#D1D5DB"}" stroke-width="1.5"
          viewBox="0 0 24 24" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 22c1.1 0 2-.9 2-2H10
            c0 1.1.9 2 2 2zm6-6v-5
            c0-3.07-1.63-5.64-4.5-6.32V4
            c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68
            C7.63 5.36 6 7.92 6 11v5l-1.3 1.3
            c-.2.2-.3.45-.3.7 0 .55.45 1 1 1h13.2
            c.55 0 1-.45 1-1 0-.25-.1-.5-.3-.7L18 16z"/>
        </svg>
      </button>
    </div>
  </div>

  <div class="summary-section">
    <div class="summary-box sentiment-box">
      <div class="label">여행심리지수</div>
      <div class="score" style="color:${sentimentColor}">${sentimentIndex}</div>
      <div class="status">${sentimentLabel}</div>
    </div>

    <div class="summary-box info-box">
      <h4>요약</h4>
      <ul>
        <li>환율 변동: ${c.change >= 0 ? "+" : ""}${c.change}%</li>
        <li>출입국자 증가율: +5%</li>
        <li>소비지출: +3%</li>
      </ul>
      <p class="desc">이 시기는 ${sentimentLabel} 시즌입니다.</p>
    </div>
  </div>

  <div class="chart-grid">
    <div><canvas id="chart1"></canvas></div>
    <div><canvas id="chart2"></canvas></div>
    <div><canvas id="chart3"></canvas></div>
  </div>

  <div class="close-area">
    <button id="close-detail" onclick="window.location.href='index.html'">닫기</button>
  </div>
`;

  // 즐겨찾기 토글
  const favBtn = document.getElementById("fav-btn");
  if (favBtn) {
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      c.favorite = !c.favorite;
      saveData();
      renderDetail(c);
    });
  }

  // 알림 토글
  const alertBtn = document.getElementById("alert-btn");
  if (alertBtn) {
    alertBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      c.alert = !c.alert;
      saveData();
      renderDetail(c);
    });
  }

  // 차트 로드
  loadChartJS(() => drawCharts(c));
}
// ===============================
// 차트 생성 함수
// ===============================
async function drawCharts(c) {

  const ctx1 = document.getElementById("chart1");
  const ctx2 = document.getElementById("chart2");
  const ctx3 = document.getElementById("chart3");

  if (!ctx1 || !ctx2 || !ctx3) {
    console.error("차트 캔버스를 찾을 수 없음");
    return;
  }


  // ------------------------------------------------
  // chart1 : 환율 히스토리
  // ------------------------------------------------
  const historyData = await fetchRateHistory(c.id);

  const dummyLabels = ["1일", "2일", "3일", "4일", "5일", "6일", "7일"];
  const dummyRates  = [1235, 1242, 1228, 1237, 1250, 1245, 1262];

  let rateLabels = [];
  let rateValues = [];

  if (historyData && historyData.history && historyData.history.length > 0) {
    rateLabels = historyData.history.map(h => h.date);
    rateValues = historyData.history.map(h => h.rate);
  } else {
    rateLabels = dummyLabels;
    rateValues = dummyRates;
  }

  new Chart(ctx1, {
    type: "line",
    data: {
      labels: rateLabels,
      datasets: [
        {
          label: "환율 추이",
          data: rateValues,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59,130,246,0.1)",
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });



  // ------------------------------------------------
  // chart2 : 출입국자 그래프 (더미 유지)
  // ------------------------------------------------
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      datasets: [
        {
          label: "출입국자 수",
          data: [120, 130, 145, 155, 170, 185],
          backgroundColor: "#22C55E",
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });



  // ------------------------------------------------
  // chart3 : 소비지출 (더미 유지)
  // ------------------------------------------------
  new Chart(ctx3, {
    type: "line",
    data: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      datasets: [
        {
          label: "소비지출 지수",
          data: [85, 88, 91, 94, 98, 103],
          borderColor: "#FACC15",
          backgroundColor: "rgba(250,204,21,0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });
}



/*// ===============================
// FlyOn Detail JS (최종 안정화 버전)
// ===============================
loadData();

console.log("✅ detail.js 로드됨");
console.log("✅ countriesData 존재 여부:", typeof countriesData !== "undefined" ? "OK" : "없음");
console.log("✅ countriesData:", countriesData);

// ===============================
// URL 파라미터 디코딩 함수
// ===============================
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(param);
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// ===============================
// 페이지 로드 후 실행
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  console.log("🧭 URL 확인:", window.location.search);

  const id = getQueryParam("id");
  const continent = getQueryParam("continent");

  console.log("🌍 continent =", continent);
  console.log("🧭 id =", id);

  if (!id || !continent) {
    document.body.innerHTML += "<p style='text-align:center;color:#6b7280;'>파라미터 오류</p>";
    return;
  }

  // country 데이터 확인
  const countryList = countriesData[continent];
  if (!countryList) {
    document.body.innerHTML += "<p style='text-align:center;color:#6b7280;'>대륙 정보를 찾을 수 없습니다.</p>";
    return;
  }

  const country = countryList.find((c) => c.id === id);
  console.log("✅ country:", country);

  if (!country) {
    document.body.innerHTML += "<p style='text-align:center;color:#6b7280;'>국가 정보를 불러올 수 없습니다.</p>";
    return;
  }

  // DOM 로드 완료 후 약간의 지연을 줘서 요소 확실히 인식
  setTimeout(() => renderDetail(country), 100);
});

// ===============================
// 상세 페이지 렌더링 함수
// ===============================
function renderDetail(c) {
  const box = document.getElementById("country-detail");
  if (!box) {
    console.error("❌ country-detail 요소를 찾을 수 없습니다.");
    return;
  }

  const sentimentColor = getSentimentColor(c.sentiment);
  const sentimentLabel = getSentimentLabel(c.sentiment);

  box.innerHTML = `
  <div class="detail-header">
    <div style="display:flex;align-items:center;gap:0.8rem;">
      <span style="font-size:3rem">${c.flag}</span>
      <h2 style="font-size:1.8rem;font-weight:700">${c.name}</h2>
    </div>

    <div class="icon-group">
      <button class="icon-btn" id="fav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="${c.favorite ? "#FACC15" : "none"}"
          stroke="${c.favorite ? "#FACC15" : "#D1D5DB"}" stroke-width="1.5"
          viewBox="0 0 24 24" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24
            l-7.19-.61L12 2 9.19 8.63 2 9.24
            l5.46 4.73L5.82 21z"/>
        </svg>
      </button>

      <button class="icon-btn" id="alert-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="${c.alert ? "#3B82F6" : "none"}"
          stroke="${c.alert ? "#3B82F6" : "#D1D5DB"}" stroke-width="1.5"
          viewBox="0 0 24 24" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 22c1.1 0 2-.9 2-2H10
            c0 1.1.9 2 2 2zm6-6v-5
            c0-3.07-1.63-5.64-4.5-6.32V4
            c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68
            C7.63 5.36 6 7.92 6 11v5l-1.3 1.3
            c-.2.2-.3.45-.3.7 0 .55.45 1 1 1h13.2
            c.55 0 1-.45 1-1 0-.25-.1-.5-.3-.7L18 16z"/>
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
      <p class="desc">이 시기는 ${sentimentLabel} 시즌으로, 여행비용 대비 만족도가 ${
  sentimentLabel === "성수기"
    ? "높지만 비용이 증가"
    : sentimentLabel === "균형"
    ? "안정적"
    : "저렴"
}합니다.</p>
    </div>
  </div>

  <div class="chart-grid">
    <div><canvas id="chart1"></canvas></div>
    <div><canvas id="chart2"></canvas></div>
    <div><canvas id="chart3"></canvas></div>
  </div>

  <div class="close-area">
    <button id="close-detail" onclick="window.location.href='index.html'">닫기</button>
  </div>
`;

  console.log("✅ renderDetail 실행 완료, box =", box);
  console.log("✅ box.innerHTML 길이 =", box.innerHTML.length);

  async function renderDetail(code) {
    const res = await fetch(`http://localhost:8080/api/travel/index?country=${code}`);
    const sentiment = await res.json();

    // 화면에 표시
    document.getElementById("sentiment-score").innerText = sentiment.sentimentIndex;
}

  // 새로 생성된 버튼에 이벤트 다시 연결
  const favBtn = document.getElementById("fav-btn");
  const alertBtn = document.getElementById("alert-btn");

  if (favBtn) {
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      c.favorite = !c.favorite;
      saveData();
      renderDetail(c); // 즉시 반영
    });
  }

  if (alertBtn) {
    alertBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      c.alert = !c.alert;
      saveData();
      renderDetail(c); // 즉시 반영
    });
  }

  loadChartJS(() => drawCharts());
}
// ===============================
// 샘플 차트 표시 (임시 데이터)
// ===============================
function drawCharts() {
  const ctx1 = document.getElementById("chart1");
  const ctx2 = document.getElementById("chart2");
  const ctx3 = document.getElementById("chart3");

  if (!ctx1 || !ctx2 || !ctx3) {
    console.error("❌ 차트 캔버스 요소를 찾을 수 없습니다.");
    return;
  }

  new Chart(ctx1, {
    type: "line",
    data: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      datasets: [
        {
          label: "환율 추이",
          data: [1280, 1265, 1245, 1255, 1260, 1450],
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59,130,246,0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });

  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      datasets: [
        {
          label: "출입국자 수 (천명)",
          data: [120, 130, 145, 155, 170, 185],
          backgroundColor: "#22C55E",
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });

  new Chart(ctx3, {
    type: "line",
    data: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      datasets: [
        {
          label: "소비지출 지수",
          data: [85, 88, 91, 94, 98, 103],
          borderColor: "#FACC15",
          backgroundColor: "rgba(250,204,21,0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  });
}

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
*/
