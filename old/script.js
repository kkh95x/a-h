// تأثير ضغط بسيط على الأزرار
document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("mousedown", () => (btn.style.transform = "scale(0.97)"));
  ["mouseup", "mouseleave"].forEach((ev) =>
    btn.addEventListener(ev, () => (btn.style.transform = ""))
  );
});

// تمرير ناعم للأقسام من أزرار الهيرو
document.querySelectorAll("[data-scroll]").forEach((el) => {
  el.addEventListener("click", () => {
    const target = el.getAttribute("data-scroll");
    const section = document.querySelector(target);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});