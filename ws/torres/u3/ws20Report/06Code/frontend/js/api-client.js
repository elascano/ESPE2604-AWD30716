class ApiClient {
  constructor(config, sessionStore) {
    this.config = config;
    this.sessionStore = sessionStore;
  }

  async request(path, options = {}) {
    const headers = { "Content-Type": "application/json" };
    const session = this.sessionStore.get();

    if (options.auth !== false && session?.token) {
      headers.Authorization = `Bearer ${session.token}`;
    }

    const response = await fetch(`${this.config.apiBase}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const payload = await this.parseJson(response);

    if (!response.ok) {
      if (response.status === 401) this.sessionStore.clear();
      throw new Error(payload.message || this.firstError(payload.errors) || "The request could not be completed.");
    }

    return payload;
  }

  async parseJson(response) {
    const text = await response.text();
    if (!text) return {};

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(text);
      } catch {
        throw new Error("The backend returned malformed JSON. Please redeploy Render and try again.");
      }
    }

    const preview = text.trim().replace(/\s+/g, " ").slice(0, 90);
    throw new Error(
      `The backend returned HTML instead of JSON for ${response.url}. ` +
      `Verify Render is deployed with ALCSystem v2 and Supabase has the latest schema. ` +
      `Preview: ${preview}`
    );
  }

  firstError(errors) {
    return errors ? Object.values(errors)[0] : "";
  }
}
