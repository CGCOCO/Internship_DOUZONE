// ===============================
// 🌍 FlyOn 공통 데이터 및 유틸 함수
// ===============================

// 대륙 목록
const continents = ["아시아", "유럽", "북아메리카", "오세아니아"];

// 국가별 데이터 (임시 데이터)
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

// ===============================
// 🎨 유틸 함수
// ===============================
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

// ===============================
// 📈 Chart.js 로드
// ===============================
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

// ===============================
// 🔍 URL 파라미터 가져오기 (상세페이지용)
// ===============================
// ===============================
// 🧭 URL 파라미터 디코딩 함수 (한글 안전 버전)
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

// ✅ 공통 저장 및 로드 함수
function saveData() {
  localStorage.setItem("countriesData", JSON.stringify(countriesData));
}

function loadData() {
  const stored = localStorage.getItem("countriesData");
  if (stored) Object.assign(countriesData, JSON.parse(stored));
}

if (localStorage.getItem("countriesData")) {
  countriesData = JSON.parse(localStorage.getItem("countriesData"));
}

