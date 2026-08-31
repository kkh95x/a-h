const fileForm = document.querySelector("#fileForm");
const fileInput = document.querySelector("#fileInput");
const dropzone = document.querySelector("#fileDropzone");

const fileResult = document.querySelector("#fileResult");
const fileNameSpan = document.querySelector("#fileName");
const fileSizeSpan = document.querySelector("#fileSize");
const fileExtSpan = document.querySelector("#fileExt");
const fileMimeSpan = document.querySelector("#fileMime");
const fileRiskBadge = document.querySelector("#fileRiskBadge");

// حساب حجم مقروء
function formatSize(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return size.toFixed(2) + " " + units[i];
}

// تحديد امتداد الملف
function getExtension(filename) {
  const idx = filename.lastIndexOf(".");
  if (idx === -1) return "بدون امتداد";
  return filename.slice(idx + 1).toLowerCase();
}

// منطق تقييم مبدئي بسيط جداً
function classifyFile(ext, mime, size) {
  const riskyExt = ["exe", "apk", "js", "vbs", "ps1", "scr", "bat"];
  const archiveExt = ["zip", "rar", "7z"];
  const docExt = ["doc", "docx", "xls", "xlsx", "pdf"];
  const imageExt = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

  let risk = "medium";
  let label = "Unknown / Needs Deep Scan";

  if (riskyExt.includes(ext)) {
    risk = "high";
    label = "Executable / Potential Malware Carrier";
  } else if (archiveExt.includes(ext)) {
    risk = "medium";
    label = "Archive File – قد يحتوي ملفات تنفيذية أو سكربتات";
  } else if (docExt.includes(ext)) {
    risk = "medium";
    label = "Document – قد يحتوي Macro أو محتوى ضار";
  } else if (imageExt.includes(ext)) {
    risk = "low";
    label = "Image File – المخاطر أقل لكن ليست معدومة";
  }

  // حجم كبير جداً قد يكون مريب في بعض الحالات
  if (size > 100 * 1024 * 1024) {
    risk = "high";
    label = "ملف كبير الحجم – يتطلب فحصاً عميقاً في Sandbox";
  }

  return { risk, label };
}

// تفعيل/تعطيل ستايل الـ Dropzone عند السحب
if (dropzone) {
  ["dragenter", "dragover"].forEach((ev) => {
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add("file-dropzone-hover");
    });
  });
  ["dragleave", "drop"].forEach((ev) => {
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("file-dropzone-hover");
    });
  });
}

// سحب الملف وإسقاطه
if (dropzone && fileInput) {
  dropzone.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      fileInput.files = files;
    }
  });
}

// عند إرسال النموذج
if (fileForm && fileInput && fileResult) {
  fileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      alert("الرجاء اختيار ملف للفحص.");
      return;
    }

    const ext = getExtension(file.name);
    const mime = file.type || "غير معروف من المتصفح";
    const sizeStr = formatSize(file.size);

    fileNameSpan.textContent = file.name;
    fileSizeSpan.textContent = sizeStr;
    fileExtSpan.textContent = ext;
    fileMimeSpan.textContent = mime;

    const classification = classifyFile(ext, mime, file.size);

    fileRiskBadge.textContent = classification.label;
    fileRiskBadge.classList.remove("file-risk-low", "file-risk-medium", "file-risk-high");

    // نضيف كلاس حسب الخطورة لو أردت توسيع الستايل لاحقاً
    if (classification.risk === "high") {
      fileRiskBadge.classList.add("file-risk-high");
    } else if (classification.risk === "low") {
      fileRiskBadge.classList.add("file-risk-low");
    } else {
      fileRiskBadge.classList.add("file-risk-medium");
    }

    fileResult.classList.remove("file-result-hidden");
    fileResult.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}