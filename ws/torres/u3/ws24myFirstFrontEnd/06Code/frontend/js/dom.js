class Dom {
  static setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  static setValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.value = value;
  }

  static showMessage(id, text) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = text;
    window.setTimeout(() => {
      element.textContent = "";
    }, 7000);
  }

  static escape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  static statusClass(status) {
    return `status-dot status-${String(status || "pending").toLowerCase()}`;
  }

  static initials(name) {
    const parts = String(name || "ALC")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    return (parts.map((part) => part[0]).join("") || "AL").toUpperCase();
  }
}
