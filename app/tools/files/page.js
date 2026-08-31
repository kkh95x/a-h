"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { logScan } from "@/lib/scanClient";

function formatSize(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + units[i];
}

function getExtension(filename) {
  const idx = filename.lastIndexOf(".");
  if (idx === -1) return "بدون امتداد";
  return filename.slice(idx + 1).toLowerCase();
}

function classifyFile(ext, size) {
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
  if (size > 100 * 1024 * 1024) {
    risk = "high";
    label = "ملف كبير الحجم – يتطلب فحصاً عميقاً في Sandbox";
  }
  return { risk, label };
}

export default function FileScannerPage() {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) {
      alert("الرجاء اختيار ملف للفحص.");
      return;
    }
    const ext = getExtension(file.name);
    const classification = classifyFile(ext, file.size);
    const result = {
      name: file.name,
      size: formatSize(file.size),
      ext,
      mime: file.type || "غير معروف من المتصفح",
      ...classification,
    };
    setInfo(result);
    await logScan({
      type: "file",
      target: file.name,
      result: classification.label,
      risk: classification.risk,
    });
  }

  return (
    <div className="file-body" style={{ minHeight: "100vh" }}>
      <Header />
      <main className="file-wrapper">
        <section className="file-card">
          <div className="file-header">
            <div className="file-icon">
              <i className="fas fa-file-code"></i>
            </div>
            <div>
              <h1>فحص الملفات (نسخة تجريبية)</h1>
              <p>قم برفع ملف لتحليل نوعه وحجمه بشكل مبدئي. التحليل يتم محلياً في المتصفح.</p>
            </div>
          </div>
          <form className="file-form" onSubmit={onSubmit}>
            <label htmlFor="fileInput">اختر ملفاً للفحص</label>
            <div className="file-dropzone">
              <input
                type="file"
                id="fileInput"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="file-dropzone-inner">
                <i className="fas fa-upload"></i>
                <p>{file ? file.name : "اسحب الملف إلى هنا أو اضغط لاختياره"}</p>
                <span className="file-types">الصيغ: exe, apk, zip, pdf, docx, jpg, png</span>
              </div>
            </div>
            <p className="file-hint">في هذه النسخة لا يتم رفع محتوى الملف إلى الخادم.</p>
            <button type="submit" className="btn-file-scan">
              <i className="fas fa-shield-virus"></i> تحليل الملف
            </button>
          </form>
          {info ? (
            <section className="file-result">
              <h2>معلومات الملف</h2>
              <ul className="file-result-list">
                <li>
                  <span>اسم الملف:</span> <strong>{info.name}</strong>
                </li>
                <li>
                  <span>الحجم:</span> <strong>{info.size}</strong>
                </li>
                <li>
                  <span>الامتداد:</span> <strong>{info.ext}</strong>
                </li>
                <li>
                  <span>نوع MIME:</span> <strong>{info.mime}</strong>
                </li>
              </ul>
              <div className="file-risk-row">
                <span>تقييم مبدئي للمخاطر:</span>
                <span className={`file-risk-badge file-risk-${info.risk}`}>{info.label}</span>
              </div>
              <p className="file-note">هذه النتيجة لا تعني أن الملف آمن أو خبيث بشكل حاسم.</p>
            </section>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
