// -------- تبويبات الداشبورد --------
const navItems = document.querySelectorAll(".dash-nav-item[data-section]");
const sections = document.querySelectorAll(".dash-section[data-section]");

navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const target = item.getAttribute("data-section");

    // تفعيل عنصر الناف الحالي
    navItems.forEach((n) => n.classList.remove("active"));
    item.classList.add("active");

    // إظهار القسم المطلوب
    sections.forEach((sec) => {
      if (sec.getAttribute("data-section") === target) {
        sec.classList.remove("dash-section-hidden");
      } else {
        sec.classList.add("dash-section-hidden");
      }
    });
  });
});

// -------- تاريخ اليوم في الهيدر --------
const dateSpan = document.querySelector("#dashDate");
if (dateSpan) {
  const now = new Date();
  const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  dateSpan.textContent = now.toLocaleDateString("ar-SY", options);
}

// -------- أحدث الفحوصات (قائمة قصيرة) --------
const recentScans = [
  {
    type: "فحص رابط",
    target: "https://login-secure-paypal.com",
    status: "مشبوه",
    risk: "danger",
    time: "قبل 5 دقائق",
  },
  {
    type: "فحص إيميل",
    target: "user@example-leak.com",
    status: "تسريبات معروفة",
    risk: "warn",
    time: "قبل 15 دقيقة",
  },
  {
    type: "فحص كلمة مرور",
    target: "**********",
    status: "قوة متوسطة",
    risk: "warn",
    time: "قبل 40 دقيقة",
  },
  {
    type: "فحص رابط",
    target: "https://cyberscan.io",
    status: "آمن",
    risk: "safe",
    time: "قبل ساعة",
  },
];

const recentList = document.querySelector("#recentList");
if (recentList) {
  recentScans.forEach((scan) => {
    const li = document.createElement("li");
    li.className = "dash-recent-item";
    li.innerHTML = `
      <div class="dash-recent-left">
        <span class="dash-recent-type">${scan.type}</span>
        <span class="dash-recent-target">${scan.target}</span>
      </div>
      <div class="dash-recent-right">
        <span class="dash-badge ${scan.risk}">${scan.status}</span>
        <span>${scan.time}</span>
      </div>
    `;
    recentList.appendChild(li);
  });
}

// -------- جدول مختصر في قسم overview --------
const tableData = [
  {
    type: "رابط",
    target: "http://update-security-check.com",
    result: "تصيد محتمل",
    risk: "خطر",
    date: "اليوم - 14:32",
  },
  {
    type: "إيميل",
    target: "admin@company.com",
    result: "موجود في 2 قواعد بيانات تسريب",
    risk: "متوسط",
    date: "اليوم - 13:10",
  },
  {
    type: "كلمة مرور",
    target: "********",
    result: "قوة ضعيفة",
    risk: "متوسط",
    date: "اليوم - 12:05",
  },
  {
    type: "ملف",
    target: "invoice_2024.exe",
    result: "تنفيذي – يتطلب فحص عميق",
    risk: "خطر",
    date: "أمس - 22:17",
  },
  {
    type: "رابط",
    target: "https://docs.google.com/...",
    result: "آمن",
    risk: "منخفض",
    date: "أمس - 20:45",
  },
];

const tableBody = document.querySelector("#scanTableBody");
if (tableBody) {
  tableData.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.type}</td>
      <td dir="ltr" style="text-align:left">${row.target}</td>
      <td>${row.result}</td>
      <td>${row.risk}</td>
      <td>${row.date}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// -------- سجل الفحوصات الكامل مع فلاتر --------
const fullHistoryData = [
  { type: "url", target: "http://update-security-check.com", result: "تصيد محتمل", risk: "high", date: "2024-09-01 14:32" },
  { type: "email", target: "admin@company.com", result: "تسريبين معروفين", risk: "medium", date: "2024-09-01 13:10" },
  { type: "pass", target: "********", result: "قوة ضعيفة", risk: "medium", date: "2024-09-01 12:05" },
  { type: "file", target: "invoice_2024.exe", result: "ملف تنفيذي مريب", risk: "high", date: "2024-08-31 22:17" },
  { type: "url", target: "https://docs.google.com/...", result: "آمن", risk: "low", date: "2024-08-31 20:45" },
  { type: "email", target: "user@proton.me", result: "لا توجد تسريبات معروفة", risk: "low", date: "2024-08-31 19:10" },
  { type: "url", target: "https://cyberscan.io", result: "آمن", risk: "low", date: "2024-08-31 18:01" },
];

const historyBody = document.querySelector("#historyTableBody");
const typeFilter = document.querySelector("#historyTypeFilter");
const riskFilter = document.querySelector("#historyRiskFilter");

function renderHistory() {
  if (!historyBody) return;
  historyBody.innerHTML = "";

  const typeVal = typeFilter ? typeFilter.value : "all";
  const riskVal = riskFilter ? riskFilter.value : "all";

  fullHistoryData
    .filter((item) => (typeVal === "all" ? true : item.type === typeVal))
    .filter((item) => {
      if (riskVal === "all") return true;
      if (riskVal === "low") return item.risk === "low";
      if (riskVal === "medium") return item.risk === "medium";
      if (riskVal === "high") return item.risk === "high";
      return true;
    })
    .forEach((row) => {
      const tr = document.createElement("tr");
      const typeLabel =
        row.type === "url"
          ? "رابط"
          : row.type === "email"
          ? "إيميل"
          : row.type === "pass"
          ? "كلمة مرور"
          : "ملف";

      const riskLabel =
        row.risk === "high" ? "عالٍ" : row.risk === "medium" ? "متوسط" : "منخفض";

      tr.innerHTML = `
        <td>${typeLabel}</td>
        <td dir="ltr" style="text-align:left">${row.target}</td>
        <td>${row.result}</td>
        <td>${riskLabel}</td>
        <td>${row.date}</td>
      `;
      historyBody.appendChild(tr);
    });
}

if (historyBody) {
  renderHistory();
  if (typeFilter) typeFilter.addEventListener("change", renderHistory);
  if (riskFilter) riskFilter.addEventListener("change", renderHistory);
}

// -------- مقالات داخل الداشبورد --------
const dashArticles = [
  {
    title: "ما هو التصيد الإلكتروني وكيف تحمي نفسك منه؟",
    category: "Phishing",
    time: "7 دقائق",
    badge: "Phishing Basics",
  },
  {
    title: "أفضل طرق حماية حساباتك الشخصية من الاختراق",
    category: "Account Security",
    time: "8 دقائق",
    badge: "Account Security",
  },
  {
    title: "تعرف على ثغرة XSS وكيف يتم استغلالها في الهجمات",
    category: "Web Security",
    time: "10 دقائق",
    badge: "Web Security",
  },
  {
    title: "أوامر Linux أساسية لكل مختبر اختراق",
    category: "Linux",
    time: "12 دقائق",
    badge: "Linux",
  },
];

const dashArticlesGrid = document.querySelector("#dashArticlesGrid");
if (dashArticlesGrid) {
  dashArticles.forEach((art) => {
    const div = document.createElement("div");
    div.className = "dash-article-card";
    div.innerHTML = `
      <span class="dash-article-badge">${art.badge}</span>
      <h3>${art.title}</h3>
      <p class="dash-article-meta">
        <span><i class="fas fa-folder"></i> ${art.category}</span>
        <span><i class="fas fa-clock"></i> ${art.time} قراءة</span>
      </p>
      <button type="button" class="dash-article-btn">فتح المقال (قريباً)</button>
    `;
    dashArticlesGrid.appendChild(div);
  });
}

// -------- الأكاديمية داخل الداشبورد --------
const academyLevels = [
  {
    level: "Level 1",
    title: "Cybersecurity Basics",
    progress: 60,
  },
  {
    level: "Level 2",
    title: "Networking & Linux",
    progress: 40,
  },
  {
    level: "Level 3",
    title: "Web Security & OWASP",
    progress: 20,
  },
  {
    level: "Level 4",
    title: "Penetration Testing & Red Team",
    progress: 0,
  },
];

const academyGrid = document.querySelector("#academyGrid");
if (academyGrid) {
  academyLevels.forEach((lvl) => {
    const card = document.createElement("div");
    card.className = "dash-academy-card";
    card.innerHTML = `
      <div class="lvl-header">
        <span class="lvl-badge">${lvl.level}</span>
        <span class="lvl-progress-label">${lvl.progress}% مكتمل</span>
      </div>
      <h3>${lvl.title}</h3>
      <div class="lvl-progress-bar">
        <div class="lvl-progress-fill" style="width:${lvl.progress}%;"></div>
      </div>
      <button type="button" class="lvl-btn">
        ${lvl.progress > 0 ? "تابع من حيث توقفت" : "ابدأ المستوى"}
      </button>
    `;
    academyGrid.appendChild(card);
  });
}

// -------- الملف الشخصي: آخر تسجيل دخول (تجريبي) --------
const lastLoginSpan = document.querySelector("#lastLoginValue");
if (lastLoginSpan) {
  const now = new Date();
  const time = now.toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit" });
  lastLoginSpan.textContent = `اليوم - ${time}`;
}