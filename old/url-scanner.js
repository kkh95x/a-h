const form = document.querySelector("#urlForm");
const input = document.querySelector("#urlInput");
const resultSection = document.querySelector("#urlResult");
const riskBadge = document.querySelector("#urlRiskBadge");
const domainSpan = document.querySelector("#urlDomain");
const schemeSpan = document.querySelector("#urlScheme");
const httpsSpan = document.querySelector("#urlHttps");
const categorySpan = document.querySelector("#urlCategory");
const phishingSpan = document.querySelector("#urlPhishing");

function classifyUrl(urlString) {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();
    const scheme = url.protocol.replace(":", "");

    // منطق بسيط تجريبي فقط
    let risk = "low";
    let category = "Safe / Informational";
    let phishing = "منخفضة";

    const suspiciousWords = ["login", "verify", "update", "secure", "bank", "paypal"];
    const tldSuspicious = [".ru", ".cn", ".zip"];

    if (tldSuspicious.some((tld) => hostname.endsWith(tld))) {
      risk = "high";
      category = "Suspicious / Possible Malware";
      phishing = "مرتفعة";
    } else if (suspiciousWords.some((w) => url.pathname.toLowerCase().includes(w))) {
      risk = "medium";
      category = "Potential Phishing";
      phishing = "متوسطة";
    }

    return {
      hostname,
      scheme,
      https: scheme === "https",
      risk,
      category,
      phishing,
    };
  } catch (e) {
    return null;
  }
}

if (form && input && resultSection) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    const data = classifyUrl(value);

    if (!data) {
      alert("الرجاء إدخال رابط صالح (URL) بصيغة صحيحة.");
      return;
    }

    domainSpan.textContent = data.hostname;
    schemeSpan.textContent = data.scheme;
    httpsSpan.textContent = data.https ? "نعم" : "لا";
    categorySpan.textContent = data.category;
    phishingSpan.textContent = data.phishing;

    riskBadge.classList.remove("risk-low", "risk-med", "risk-high");
    if (data.risk === "high") {
      riskBadge.classList.add("risk-high");
      riskBadge.textContent = "HIGH RISK";
    } else if (data.risk === "medium") {
      riskBadge.classList.add("risk-med");
      riskBadge.textContent = "MEDIUM RISK";
    } else {
      riskBadge.classList.add("risk-low");
      riskBadge.textContent = "LOW RISK";
    }

    resultSection.classList.remove("url-result-hidden");
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}