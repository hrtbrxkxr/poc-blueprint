export function loadFont(fontUrl: string, fontFamily: string) {
  if (typeof document === "undefined") return;

  const existing = document.getElementById("platform-dynamic-font");
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.id = "platform-dynamic-font";
  link.rel = "stylesheet";
  link.href = fontUrl;
  link.dataset.fontFamily = fontFamily;
  document.head.appendChild(link);
}
