const emailForm = document.querySelector("#emailForm");
const emailInput = document.querySelector("#emailInput");
const resultBox = document.querySelector("#emailResult");
const emailRiskBadge = document.querySelector("#emailRiskBadge");
const emailChecked = document.querySelector("#emailChecked");
const breachCountSpan = document.querySelector("#breachCount");
const breachSourcesSpan = document.querySelector("#breachSources");
const securityAdviceSpan = document.querySelector("#securityAdvice");

// منطق تجريبي بسيط: لا يستخدم أي API حقيقي
function mockCheckEmailBreach(email) {
  const lower = email.toLowerCase();

  // كلمات أو دومينات "شائعة في التسريبات" بشكل افتراضي
  const riskyDomains = ["yahoo.com", "hotmail.com", "example-leak.com"];
  const safeDomains = ["proton.me", "tutanota.com"];

  const domain = lower.split("@")[1] || "";

  let breached = false;
  let count = 0;
  let sources = [];

  if (riskyDomains.some((d) => domain.endsWith(d))) {
    breached = true;
    count = 3;
    sources = ["Combo List 2019", "Credential Stuffing Set", "Public Leak Archive"];
  } else if (!safeDomains.some((d) => domain.endsWith(d))) {
    // حالة متوسطة: احتمال تسريب واحد
    breached = true;
    count = 1;
    sources = ["Generic Breach Database"];
  }

  let advice =
    "قم بتغيير كلمة المرور فوراً، واستخدم كلمة مرور قوية وفريدة لهذا الحساب، وفعل المصادقة الثنائية إن أمكن.";

  if (!breached) {
    advice =
      "لا توجد تسريبات معروفة لهذا البريد في قواعد البيانات التجريبية، مع ذلك استخدم كلمات مرور قوية ومختلفة لكل حساب.";
  }

  return {
    breached,
    count,
    sources,
    advice,
  };
}

if (emailForm && emailInput && resultBox) {
  emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      alert("الرجاء إدخال بريد إلكتروني صالح.");
      return;
    }

    const res = mockCheckEmailBreach(email);

    emailChecked.textContent = email;
    breachCountSpan.textContent = res.count.toString();
    breachSourcesSpan.textContent = res.sources.length ? res.sources.join(", ") : "—";
    securityAdviceSpan.textContent = res.advice;

    emailRiskBadge.classList.remove("breach-none", "breach-found");

    if (res.breached) {
      emailRiskBadge.classList.add("breach-found");
      emailRiskBadge.textContent = "تم العثور على تسريبات محتملة";
    } else {
      emailRiskBadge.classList.add("breach-none");
      emailRiskBadge.textContent = "لا توجد تسريبات معروفة";
    }

    resultBox.classList.remove("email-result-hidden");
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}