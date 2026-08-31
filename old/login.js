// إظهار / إخفاء كلمة المرور
const toggleBtn = document.querySelector(".toggle-password");
const passwordInput = document.querySelector("#password");

if (toggleBtn && passwordInput) {
  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    const icon = toggleBtn.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    }
  });
}

// معالجة نموذج تسجيل الدخول
const loginForm = document.querySelector("#loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const pass = document.querySelector("#password").value.trim();

    if (!email || !pass) {
      alert("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    // بيانات دخول تجريبية حالياً
    const demoEmail = "admin@cyberscan.com";
    const demoPass = "Test123!";

    // تحقق بسيط
    if (email !== demoEmail || pass !== demoPass) {
      alert("بيانات الدخول غير صحيحة.\n(تجريبياً استخدم: admin@cyberscan.com / Test123!)");
      return;
    }

    // نجاح تسجيل الدخول → تحويل إلى لوحة التحكم
    window.location.href = "dashboard.html";
  });
}