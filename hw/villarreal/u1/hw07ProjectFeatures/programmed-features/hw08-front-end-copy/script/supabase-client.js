window.ALC_SUPABASE_CONFIG = {
  url: "https://luzlnnndzhpilgxacnim.supabase.co",
  anonKey: "sb_publishable_gc2ja7VEUyHdZppJ-lHfZQ_Bnu3Pwbz"
};

window.alcSupabase = {
  isReady() {
    const config = window.ALC_SUPABASE_CONFIG;

    return config.url &&
      config.anonKey &&
      !config.url.includes("YOUR_SUPABASE_URL") &&
      !config.anonKey.includes("YOUR_SUPABASE_ANON_KEY");
  },

  request(table, options = {}) {
    if (!this.isReady()) {
      return Promise.resolve(null);
    }

    const config = window.ALC_SUPABASE_CONFIG;
    const query = options.query || "";
    const endpoint = `${config.url.replace(/\/$/, "")}/rest/v1/${table}${query}`;

    return fetch(endpoint, {
      method: options.method || "GET",
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text || "Supabase request failed.");
        });
      }

      return response.json();
    });
  },

  insert(table, body) {
    return this.request(table, {
      method: "POST",
      body
    });
  }
};
