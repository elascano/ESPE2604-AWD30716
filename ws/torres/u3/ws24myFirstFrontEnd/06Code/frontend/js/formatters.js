class Formatters {
  static currency(value) {
    return `$${Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }

  static percent(value) {
    return `${Math.round(Number(value || 0))}%`;
  }

  static digitsOnly(value) {
    return String(value || "").replace(/\D+/g, "");
  }

  static dateTime(value) {
    if (!value) return "Manual";
    return new Date(value).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }
}
