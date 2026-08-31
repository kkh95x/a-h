const passInput = document.querySelector("#passInput");
const passResult = document.querySelector("#passResult");
const strengthLabel = document.querySelector("#passStrengthLabel");
const meterFill = document.querySelector("#passMeterFill");
const lengthSpan = document.querySelector("#passLength");
const charsetSpan = document.querySelector("#passCharset");
const timeSpan = document.querySelector("#passTime");
const suggestionsList = document.querySelector("#passSuggestions");
const togglePassBtn = document.querySelector(".toggle-password");

function estimatePasswordStrength(password) {
  const length = password.length;

  let hasLower = /[a-z]/.test(password);
  let hasUpper = /[A-Z]/.test(password);
  let hasDigit = /[0-9]/.test(password);
  let hasSymbol = /[^A-Za-z0-9]/.test(password);

  let charsetSize = 0;
  if (hasLower) charsetSize += 26;
  if (hasUpper) charsetSize += 26;
  if (hasDigit) charsetSize += 10;
  if (hasSymbol) charsetSize += 32; // تقريب لعدد الرموز

  // لو ما في أي نوع معروف، اعتبرها 10 حروف فقط
  if (charsetSize === 0 && length > 0) charsetSize = 10;

  // تعقيد الباسورد (تقريب بسيط): charset^length
  // لا يمكن حسابه فعلياً للأطوال الكبيرة، لذلك نستخدم log2 للتقريب
  const entropy = length > 0 ? Math.log2(Math.pow(charsetSize, length)) : 0;

  // زمن الكسر التقريبي (بالثواني) بناء على 10^9 تخمين/ث
  const guessesPerSecond = 1e9;
  const seconds = entropy > 0 ? Math.pow(2, entropy) / guessesPerSecond : 0;

  // تحديد مستوى القوة
  let strength = "weak";
  if (entropy >= 60 && length >= 10 && hasLower && hasUpper && hasDigit && hasSymbol) {
    strength = "strong";
  } else if (entropy >= 40 && length >= 8 && ((hasLower && hasUpper) || hasDigit || hasSymbol)) {
    strength = "medium";
  }

  // توصيف تنوع الأحرف
  let charsetDesc = [];
  if (hasLower) charsetDesc.push("حروف صغيرة");
  if (hasUpper) charsetDesc.push("حروف كبيرة");
  if (hasDigit) charsetDesc.push("أرقام");
  if (hasSymbol) charsetDesc.push("رموز خاصة");
  if (!charsetDesc.length) charsetDesc.push("نوع واحد فقط من الأحرف");

  return {
    length,
    charsetDesc: charsetDesc.join(" + "),
    entropy,
    seconds,
    strength,
  };
}

function formatTime(seconds) {
  if (seconds <= 0) return "لحظات";

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const year = 365 * day;
  const century = 100 * year;

  if (seconds < minute) return "ثوانٍ معدودة";
  if (seconds < hour) return `${Math.round(seconds / minute)} دقيقة تقريباً`;
  if (seconds < day) return `${Math.round(seconds / hour)} ساعة تقريباً`;
  if (seconds < year) return `${Math.round(seconds / day)} يوم تقريباً`;
  if (seconds < century) return `${Math.round(seconds / year)} سنة تقريباً`;
  return "أكثر من قرن (نظرياً)";
}

function buildSuggestions(pwInfo) {
  const suggestions = [];

  if (pwInfo.length < 12) {
    suggestions.push("استخدم طول لا يقل عن 12 حرفاً لزيادة صعوبة الكسر.");
  }
  if (!/[a-z]/.test(passInput.value)) {
    suggestions.push("أضف حروفاً صغيرة (a-z).");
  }
  if (!/[A-Z]/.test(passInput.value)) {
    suggestions.push("أضف حروفاً كبيرة (A-Z).");
  }
  if (!/[0-9]/.test(passInput.value)) {
    suggestions.push("أضف أرقاماً (0-9).");
  }
  if (!/[^A-Za-z0-9]/.test(passInput.value)) {
    suggestions.push("أضف رموزاً خاصة مثل ! @ # $ % ^ & *.");
  }
  if (!suggestions.length && pwInfo.length > 0) {
    suggestions.push("كلمة المرور قوية. تأكد من عدم إعادة استخدامها في أكثر من حساب.");
  }

  return suggestions;
}

function updateUI() {
  const pw = passInput.value;
  if (!pw) {
    passResult.classList.add("pass-result-hidden");
    return;
  }

  const info = estimatePasswordStrength(pw);

  // تفعيل النتيجة
  passResult.classList.remove("pass-result-hidden");

  // الطول
  lengthSpan.textContent = `${info.length} حروف`;

  // تنوع الأحرف
  charsetSpan.textContent = info.charsetDesc;

  // الزمن التقريبي
  timeSpan.textContent = formatTime(info.seconds);

  // شريط القوة
  let widthPct = 0;
  meterFill.classList.remove("strength-weak", "strength-medium", "strength-strong");

  if (info.strength === "weak") {
    widthPct = 33;
    strengthLabel.textContent = "ضعيفة";
    strengthLabel.className = "pass-strength-label strength-weak";
  } else if (info.strength === "medium") {
    widthPct = 66;
    strengthLabel.textContent = "متوسطة";
    strengthLabel.className = "pass-strength-label strength-medium";
  } else {
    widthPct = 100;
    strengthLabel.textContent = "قوية";
    strengthLabel.className = "pass-strength-label strength-strong";
  }

  meterFill.style.width = widthPct + "%";

  // النصائح
  suggestionsList.innerHTML = "";
  const suggestions = buildSuggestions(info);
  suggestions.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    suggestionsList.appendChild(li);
  });
}

// تحديث في كل كتابة
if (passInput && passResult) {
  passInput.addEventListener("input", updateUI);
}

// إظهار / إخفاء كلمة المرور (نفس أسلوب login)
if (togglePassBtn && passInput) {
  togglePassBtn.addEventListener("click", () => {
    const isPassword = passInput.type === "password";
    passInput.type = isPassword ? "text" : "password";
    const icon = togglePassBtn.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    }
  });
}