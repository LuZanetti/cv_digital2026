/* ============================================================
   1) PEGÁ ACÁ el enlace público de tu CV cuando lo publiques.
      Si lo dejás vacío, el QR usa la dirección de la página abierta.
   ============================================================ */
const PUBLIC_URL = "";

/* ---------- Modo claro / oscuro ---------- */
const root = document.documentElement;
const themeBtn = document.getElementById("btn-theme");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

function currentTheme() {
  return root.dataset.theme || (systemDark.matches ? "dark" : "light");
}
function paintThemeButton() {
  themeBtn.textContent = currentTheme() === "dark" ? "Modo claro" : "Modo oscuro";
}
try {
  const saved = localStorage.getItem("cv-theme");
  if (saved) root.dataset.theme = saved;
} catch (e) { /* sin almacenamiento: no pasa nada */ }
paintThemeButton();

themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("cv-theme", next); } catch (e) {}
  paintThemeButton();
});

/* ---------- Guardar como PDF ---------- */
document.getElementById("btn-print").addEventListener("click", () => {
  // Abre todas las experiencias para que salgan completas en el PDF
  document.querySelectorAll("details").forEach(d => d.open = true);
  window.print();
});

/* ---------- QR ---------- */
const dialog = document.getElementById("qr-dialog");
const qrBox = document.getElementById("qr-box");
const qrUrl = document.getElementById("qr-url");
let qrBuilt = false;

document.getElementById("btn-qr").addEventListener("click", () => {
  const url = PUBLIC_URL || window.location.href.split("#")[0];
  if (!qrBuilt) {
    new QRCode(qrBox, { text: url, width: 220, height: 220, correctLevel: QRCode.CorrectLevel.M });
    qrUrl.textContent = url;
    qrBuilt = true;
  }
  dialog.showModal();
});
document.getElementById("qr-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

document.getElementById("qr-download").addEventListener("click", () => {
  const canvas = qrBox.querySelector("canvas");
  const img = qrBox.querySelector("img");
  const href = canvas ? canvas.toDataURL("image/png") : img && img.src;
  if (!href) return;
  const a = document.createElement("a");
  a.href = href;
  a.download = "qr-cv-lucia-zanetti.png";
  a.click();
});
