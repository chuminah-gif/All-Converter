// 올컨버터 - 공통 단위/사이즈 변환 엔진
// 모든 물리 단위 상수는 국제적으로 정의된 고정값(SI 정의 기준)을 사용합니다.

function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatNumber(n, maxDecimals) {
  if (n === null || n === undefined || isNaN(n)) return "-";
  var d = maxDecimals === undefined ? 6 : maxDecimals;
  var rounded = Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
  return rounded.toLocaleString("ko-KR", { maximumFractionDigits: d });
}

/* ---------------- 길이 (기준 단위: m) ---------------- */
var LENGTH_UNITS = {
  mm: { label: "밀리미터(mm)", labelEn: "Millimeter (mm)", toBase: 0.001 },
  cm: { label: "센티미터(cm)", labelEn: "Centimeter (cm)", toBase: 0.01 },
  m: { label: "미터(m)", labelEn: "Meter (m)", toBase: 1 },
  km: { label: "킬로미터(km)", labelEn: "Kilometer (km)", toBase: 1000 },
  inch: { label: "인치(in)", labelEn: "Inch (in)", toBase: 0.0254 },
  ft: { label: "피트(ft)", labelEn: "Foot (ft)", toBase: 0.3048 },
  yard: { label: "야드(yd)", labelEn: "Yard (yd)", toBase: 0.9144 },
  mile: { label: "마일(mi)", labelEn: "Mile (mi)", toBase: 1609.344 }
};

/* ---------------- 무게 (기준 단위: kg) ---------------- */
var WEIGHT_UNITS = {
  mg: { label: "밀리그램(mg)", labelEn: "Milligram (mg)", toBase: 0.000001 },
  g: { label: "그램(g)", labelEn: "Gram (g)", toBase: 0.001 },
  kg: { label: "킬로그램(kg)", labelEn: "Kilogram (kg)", toBase: 1 },
  ton: { label: "톤(t)", labelEn: "Metric ton (t)", toBase: 1000 },
  oz: { label: "온스(oz)", labelEn: "Ounce (oz)", toBase: 0.028349523125 },
  lb: { label: "파운드(lb)", labelEn: "Pound (lb)", toBase: 0.45359237 }
};

/* ---------------- 속도 (기준 단위: m/s) ---------------- */
var SPEED_UNITS = {
  ms: { label: "미터/초(m/s)", labelEn: "Meters/second (m/s)", toBase: 1 },
  kmh: { label: "킬로미터/시(km/h)", labelEn: "Kilometers/hour (km/h)", toBase: 1 / 3.6 },
  mph: { label: "마일/시(mph)", labelEn: "Miles/hour (mph)", toBase: 0.44704 },
  knot: { label: "노트(kn)", labelEn: "Knot (kn)", toBase: 0.5144444444 }
};

/* ---------------- 부피 (기준 단위: L) ---------------- */
var VOLUME_UNITS = {
  ml: { label: "밀리리터(mL)", labelEn: "Milliliter (mL)", toBase: 0.001 },
  l: { label: "리터(L)", labelEn: "Liter (L)", toBase: 1 },
  galUS: { label: "갤런(US gal)", labelEn: "US Gallon (gal)", toBase: 3.785411784 },
  qtUS: { label: "쿼트(US qt)", labelEn: "US Quart (qt)", toBase: 0.946352946 },
  cupUS: { label: "컵(US cup)", labelEn: "US Cup", toBase: 0.2365882365 },
  flozUS: { label: "액량온스(US fl oz)", labelEn: "US Fluid Ounce (fl oz)", toBase: 0.0295735295625 }
};

/* ---------------- 넓이 (기준 단위: m^2) ---------------- */
var AREA_UNITS = {
  m2: { label: "제곱미터(m²)", labelEn: "Square meter (m²)", toBase: 1 },
  km2: { label: "제곱킬로미터(km²)", labelEn: "Square kilometer (km²)", toBase: 1000000 },
  cm2: { label: "제곱센티미터(cm²)", labelEn: "Square centimeter (cm²)", toBase: 0.0001 },
  pyeong: { label: "평", labelEn: "Pyeong (Korean unit)", toBase: 3.305785 },
  ft2: { label: "제곱피트(ft²)", labelEn: "Square foot (ft²)", toBase: 0.09290304 },
  acre: { label: "에이커(acre)", labelEn: "Acre", toBase: 4046.8564224 },
  hectare: { label: "헥타르(ha)", labelEn: "Hectare (ha)", toBase: 10000 }
};

function convertLinear(units, value, fromKey, toKey) {
  if (isNaN(value)) return null;
  var base = value * units[fromKey].toBase;
  return base / units[toKey].toBase;
}

/* ---------------- 온도 (선형 배율이 아닌 별도 변환식) ---------------- */
function celsiusTo(value, toUnit) {
  if (toUnit === "c") return value;
  if (toUnit === "f") return value * 9 / 5 + 32;
  if (toUnit === "k") return value + 273.15;
  return null;
}

function toCelsius(value, fromUnit) {
  if (fromUnit === "c") return value;
  if (fromUnit === "f") return (value - 32) * 5 / 9;
  if (fromUnit === "k") return value - 273.15;
  return null;
}

function convertTemperature(value, fromUnit, toUnit) {
  if (isNaN(value)) return null;
  var c = toCelsius(value, fromUnit);
  return celsiusTo(c, toUnit);
}

var TEMP_UNITS = {
  c: { label: "섭씨(°C)", labelEn: "Celsius (°C)" },
  f: { label: "화씨(°F)", labelEn: "Fahrenheit (°F)" },
  k: { label: "켈빈(K)", labelEn: "Kelvin (K)" }
};

/* ---------------- 통화 (Frankfurter API, 무료/키 불필요, ECB 기준 매일 갱신) ---------------- */
var CURRENCY_LIST = ["KRW", "USD", "EUR", "JPY", "CNY", "GBP", "AUD", "CAD", "CHF", "HKD", "SGD", "THB", "VND"];

function fetchExchangeRates(baseCurrency) {
  return fetch("https://api.frankfurter.dev/v1/latest?base=" + baseCurrency)
    .then(function (res) {
      if (!res.ok) throw new Error("rate fetch failed");
      return res.json();
    });
}

/* ---------------- 신발 사이즈 (기준: 발길이 mm, KR 사이즈 = 발길이 mm) ---------------- */
// 출처: 국제 신발 사이즈 환산표(발길이 기준) 교차검증. KR=EU 계열과 달리 발길이(mm) 자체를 사이즈로 사용.
var SHOE_SIZE_TABLE = {
  men: [
    { krMm: 220, us: 4, uk: 3, eu: 35 },
    { krMm: 225, us: 4.5, uk: 3.5, eu: 35.5 },
    { krMm: 230, us: 5, uk: 4, eu: 36 },
    { krMm: 235, us: 5.5, uk: 4.5, eu: 36.5 },
    { krMm: 240, us: 6, uk: 5, eu: 37 },
    { krMm: 245, us: 6.5, uk: 5.5, eu: 38 },
    { krMm: 250, us: 7, uk: 6, eu: 39 },
    { krMm: 255, us: 7.5, uk: 6.5, eu: 39.5 },
    { krMm: 260, us: 8, uk: 7, eu: 40 },
    { krMm: 265, us: 8.5, uk: 7.5, eu: 41 },
    { krMm: 270, us: 9, uk: 8, eu: 42 },
    { krMm: 275, us: 9.5, uk: 8.5, eu: 42.5 },
    { krMm: 280, us: 10, uk: 9, eu: 43 },
    { krMm: 285, us: 10.5, uk: 9.5, eu: 44 },
    { krMm: 290, us: 11, uk: 10, eu: 44.5 },
    { krMm: 295, us: 11.5, uk: 10.5, eu: 45 },
    { krMm: 300, us: 12, uk: 11, eu: 46 }
  ],
  women: [
    { krMm: 210, us: 5, uk: 3, eu: 35 },
    { krMm: 220, us: 6, uk: 4, eu: 36 },
    { krMm: 225, us: 6.5, uk: 4.5, eu: 37 },
    { krMm: 235, us: 7.5, uk: 5.5, eu: 38 },
    { krMm: 245, us: 8.5, uk: 6.5, eu: 39 },
    { krMm: 250, us: 9, uk: 7, eu: 40 },
    { krMm: 255, us: 9.5, uk: 7.5, eu: 41 },
    { krMm: 260, us: 10, uk: 8, eu: 42 },
    { krMm: 270, us: 10.5, uk: 8.5, eu: 43 }
  ]
};

function interpolateShoeSize(table, footMm) {
  var rows = table.slice().sort(function (a, b) { return a.krMm - b.krMm; });
  if (footMm <= rows[0].krMm) return rows[0];
  if (footMm >= rows[rows.length - 1].krMm) return rows[rows.length - 1];
  for (var i = 0; i < rows.length - 1; i++) {
    var a = rows[i], b = rows[i + 1];
    if (footMm >= a.krMm && footMm <= b.krMm) {
      var t = (footMm - a.krMm) / (b.krMm - a.krMm);
      return {
        krMm: Math.round(footMm),
        us: Math.round((a.us + t * (b.us - a.us)) * 2) / 2,
        uk: Math.round((a.uk + t * (b.uk - a.uk)) * 2) / 2,
        eu: Math.round((a.eu + t * (b.eu - a.eu)) * 2) / 2
      };
    }
  }
  return rows[0];
}

/* ---------------- 여성 의류 사이즈 (기준: KR 표기) ---------------- */
var WOMEN_CLOTHING_TABLE = [
  { kr: 44, us: "0-2", uk: 4, eu: "32" },
  { kr: 55, us: "4-6", uk: 8, eu: "36" },
  { kr: 66, us: "8-10", uk: 12, eu: "40" },
  { kr: 77, us: "12-14", uk: 16, eu: "44" },
  { kr: 88, us: "16-18", uk: 20, eu: "48" }
];

/* ---------------- 남성 셔츠 사이즈 (기준: KR 표기, cm) ---------------- */
var MEN_SHIRT_TABLE = [
  { kr: 90, intl: "XS", eu: 36 },
  { kr: 95, intl: "S", eu: 38 },
  { kr: 100, intl: "M", eu: 40 },
  { kr: 105, intl: "L", eu: 42 },
  { kr: 110, intl: "XL", eu: 44 },
  { kr: 115, intl: "XXL", eu: 46 }
];

/* ---------------- 속옷(브라) 사이즈 (기준: 밑가슴 둘레 cm) ---------------- */
// KR/EU/CN 밴드는 cm(5 단위), US/UK 밴드는 inch(2 단위) 표기 체계 — 국가별 사이즈 표기 관례 차이이며 검증된 대응표 기준.
var BRA_BAND_TABLE = [65, 70, 75, 80, 85, 90, 95, 100, 105, 110];
function braUsBand(krBand) {
  return Math.round(krBand * 0.4 + 4);
}
var BRA_CUPS = ["AA", "A", "B", "C", "D", "E", "F"];

/* ---------------- 데이터 용량 (기준 단위: byte) ---------------- */
var DATA_UNITS = {
  bit: { label: "비트(bit)", labelEn: "Bit", toBase: 0.125 },
  byte: { label: "바이트(Byte)", labelEn: "Byte", toBase: 1 },
  kb: { label: "킬로바이트(KB)", labelEn: "Kilobyte (KB)", toBase: 1024 },
  mb: { label: "메가바이트(MB)", labelEn: "Megabyte (MB)", toBase: 1048576 },
  gb: { label: "기가바이트(GB)", labelEn: "Gigabyte (GB)", toBase: 1073741824 },
  tb: { label: "테라바이트(TB)", labelEn: "Terabyte (TB)", toBase: 1099511627776 },
  pb: { label: "페타바이트(PB)", labelEn: "Petabyte (PB)", toBase: 1125899906842624 },
  kbit: { label: "킬로비트(Kb)", labelEn: "Kilobit (Kb)", toBase: 128 },
  mbit: { label: "메가비트(Mb)", labelEn: "Megabit (Mb)", toBase: 131072 },
  gbit: { label: "기가비트(Gb)", labelEn: "Gigabit (Gb)", toBase: 134217728 }
};
// 1KB=1024Byte(2진 접두어) 기준입니다. 인터넷 속도(Mbps=메가비트/초)를 MB/s로 바꾸려면 8로 나누면 됩니다.

/* ---------------- 요리 계량 (기준 단위: mL) ---------------- */
var COOKING_UNITS = {
  ml: { label: "밀리리터(mL)", labelEn: "Milliliter (mL)", toBase: 1 },
  l: { label: "리터(L)", labelEn: "Liter (L)", toBase: 1000 },
  krCup: { label: "계량컵/종이컵 1컵(200mL)", labelEn: "Korean measuring cup (200mL)", toBase: 200 },
  tbsp: { label: "큰술/1T(15mL)", labelEn: "Tablespoon/1T (15mL)", toBase: 15 },
  tsp: { label: "작은술/1t(5mL)", labelEn: "Teaspoon/1t (5mL)", toBase: 5 },
  usCup: { label: "미국 계량컵(US cup, 236.59mL)", labelEn: "US measuring cup (236.59mL)", toBase: 236.5882365 },
  usTbsp: { label: "미국 테이블스푼(US Tbsp, 14.79mL)", labelEn: "US Tablespoon (14.79mL)", toBase: 14.7867648 },
  usTsp: { label: "미국 티스푼(US tsp, 4.93mL)", labelEn: "US Teaspoon (4.93mL)", toBase: 4.92892159 }
};

// 출처: 한국 계량컵(200mL)/큰술(15mL)/작은술(5mL) 표준 및 재료별 부피-무게 환산은 국내 베이킹 계량 안내 자료 교차검증(WebSearch). 다지는 정도에 따라 오차가 있어 정밀 계량은 저울 권장.
var INGREDIENT_TABLE = {
  flour: { label: "밀가루", labelEn: "Flour", gPerCup: 120, gPerTbsp: 8, gPerTsp: 3 },
  sugarWhite: { label: "백설탕", labelEn: "White sugar", gPerCup: 200, gPerTbsp: 12, gPerTsp: 4 },
  sugarBrown: { label: "흑설탕", labelEn: "Brown sugar", gPerCup: 220, gPerTbsp: 13, gPerTsp: 4 },
  water: { label: "물", labelEn: "Water", gPerCup: 200, gPerTbsp: 15, gPerTsp: 5 }
};

/* ---------------- 반지 사이즈 ---------------- */
// 한국 반지 호수: 내주(둘레) = 호수 + 43mm (검증된 3개 기준점: 1호=44mm, 10호=53mm, 29호=72mm, 모두 +1mm/호 일치)
// 국제(US/UK/EU/JP) 대응표는 반지 사이즈 변환 참고자료 교차검증(WebSearch) 기준 내경(mm) 대응표.
var RING_INTL_TABLE = [
  { diameterMm: 14.0, us: 3, uk: "F", eu: 44, jp: 4 },
  { diameterMm: 14.4, us: 3.5, uk: "G", eu: 45.25, jp: 5.5 },
  { diameterMm: 14.8, us: 4, uk: "H.5", eu: 46.5, jp: 7 },
  { diameterMm: 15.2, us: 4.5, uk: "I.5", eu: 47.75, jp: 8 },
  { diameterMm: 15.6, us: 5, uk: "J.5", eu: 49, jp: 9 },
  { diameterMm: 16.0, us: 5.5, uk: "L", eu: 50.75, jp: 10.5 },
  { diameterMm: 16.5, us: 6, uk: "M", eu: 51.5, jp: 12 },
  { diameterMm: 16.9, us: 6.5, uk: "N", eu: 52.75, jp: 13 },
  { diameterMm: 17.3, us: 7, uk: "O", eu: 54, jp: 14 },
  { diameterMm: 17.7, us: 7.5, uk: "P", eu: 55.25, jp: 15 },
  { diameterMm: 18.2, us: 8, uk: "Q", eu: 56.75, jp: 16 },
  { diameterMm: 18.6, us: 8.5, uk: "Q.5", eu: 58, jp: 17 },
  { diameterMm: 19.0, us: 9, uk: "R.5", eu: 59.25, jp: 18 },
  { diameterMm: 19.4, us: 9.5, uk: "S.5", eu: 60.75, jp: 19 },
  { diameterMm: 19.8, us: 10, uk: "T.5", eu: 61.75, jp: 20 },
  { diameterMm: 20.2, us: 10.5, uk: "U.5", eu: 62.75, jp: 22 },
  { diameterMm: 20.6, us: 11, uk: "V.5", eu: 64.25, jp: 23 },
  { diameterMm: 21.0, us: 11.5, uk: "W.5", eu: 66, jp: 24 },
  { diameterMm: 21.4, us: 12, uk: "Y", eu: 67.25, jp: 25 },
  { diameterMm: 21.8, us: 12.5, uk: "Z", eu: 68, jp: 26 },
  { diameterMm: 22.2, us: 13, uk: "Z+1", eu: 69, jp: 27 },
  { diameterMm: 22.6, us: 13.5, uk: "Z+1.5", eu: 71, jp: 28 }
];

var KR_RING_SIZES = [];
for (var krSize = 3; krSize <= 27; krSize++) {
  var circumferenceMm = krSize + 43;
  KR_RING_SIZES.push({ kr: krSize, circumferenceMm: circumferenceMm, diameterMm: circumferenceMm / Math.PI });
}

function interpolateRingSize(diameterMm) {
  var rows = RING_INTL_TABLE;
  if (diameterMm <= rows[0].diameterMm) return rows[0];
  if (diameterMm >= rows[rows.length - 1].diameterMm) return rows[rows.length - 1];
  for (var i = 0; i < rows.length - 1; i++) {
    var a = rows[i], b = rows[i + 1];
    if (diameterMm >= a.diameterMm && diameterMm <= b.diameterMm) {
      var t = (diameterMm - a.diameterMm) / (b.diameterMm - a.diameterMm);
      return {
        us: Math.round((a.us + t * (b.us - a.us)) * 2) / 2,
        uk: t < 0.5 ? a.uk : b.uk,
        eu: Math.round(a.eu + t * (b.eu - a.eu)),
        jp: Math.round(a.jp + t * (b.jp - a.jp))
      };
    }
  }
  return rows[0];
}

/* ---------------- 시간대 변환 ---------------- */
var TIMEZONE_LIST = [
  { key: "Asia/Seoul", label: "서울 (KST, UTC+9)", labelEn: "Seoul (KST, UTC+9)" },
  { key: "America/New_York", label: "뉴욕 (EST/EDT)", labelEn: "New York (EST/EDT)" },
  { key: "America/Los_Angeles", label: "로스앤젤레스 (PST/PDT)", labelEn: "Los Angeles (PST/PDT)" },
  { key: "Europe/London", label: "런던 (GMT/BST)", labelEn: "London (GMT/BST)" },
  { key: "Europe/Paris", label: "파리 (CET/CEST)", labelEn: "Paris (CET/CEST)" },
  { key: "Asia/Tokyo", label: "도쿄 (JST, UTC+9)", labelEn: "Tokyo (JST, UTC+9)" },
  { key: "Asia/Shanghai", label: "상하이 (CST, UTC+8)", labelEn: "Shanghai (CST, UTC+8)" },
  { key: "Asia/Singapore", label: "싱가포르 (SGT, UTC+8)", labelEn: "Singapore (SGT, UTC+8)" },
  { key: "Australia/Sydney", label: "시드니 (AEST/AEDT)", labelEn: "Sydney (AEST/AEDT)" },
  { key: "Asia/Dubai", label: "두바이 (GST, UTC+4)", labelEn: "Dubai (GST, UTC+4)" },
  { key: "UTC", label: "협정세계시(UTC)", labelEn: "Coordinated Universal Time (UTC)" }
];

function getTimeInZone(date, timeZone) {
  var formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false
  });
  var parts = formatter.formatToParts(date).reduce(function (acc, p) {
    acc[p.type] = p.value;
    return acc;
  }, {});
  return parts;
}

/* ---------------- 단위 변환기 공통 UI 초기화 (길이/무게/속도/부피/넓이/온도) ---------------- */
// opts: { units, inputId, fromId, toId, resultId, swapId, defaultFrom, defaultTo, lang, isTemperature }
function initUnitConverter(opts) {
  var units = opts.units;
  var input = document.getElementById(opts.inputId);
  var fromSel = document.getElementById(opts.fromId);
  var toSel = document.getElementById(opts.toId);
  var resultEl = document.getElementById(opts.resultId);
  var swapBtn = document.getElementById(opts.swapId);
  var lang = opts.lang || "ko";

  Object.keys(units).forEach(function (key) {
    var label = lang === "en" ? units[key].labelEn : units[key].label;
    var opt1 = document.createElement("option");
    opt1.value = key;
    opt1.textContent = label;
    fromSel.appendChild(opt1);
    var opt2 = document.createElement("option");
    opt2.value = key;
    opt2.textContent = label;
    toSel.appendChild(opt2);
  });
  fromSel.value = opts.defaultFrom;
  toSel.value = opts.defaultTo;

  function recalc() {
    var value = parseFloat(input.value);
    if (isNaN(value)) {
      resultEl.textContent = "-";
      return;
    }
    var result = opts.isTemperature
      ? convertTemperature(value, fromSel.value, toSel.value)
      : convertLinear(units, value, fromSel.value, toSel.value);
    resultEl.textContent = formatNumber(result, 6) + " " + (lang === "en" ? units[toSel.value].labelEn : units[toSel.value].label);
  }

  input.addEventListener("input", recalc);
  fromSel.addEventListener("change", recalc);
  toSel.addEventListener("change", recalc);
  if (swapBtn) {
    swapBtn.addEventListener("click", function () {
      var tmp = fromSel.value;
      fromSel.value = toSel.value;
      toSel.value = tmp;
      recalc();
    });
  }
  recalc();
}
