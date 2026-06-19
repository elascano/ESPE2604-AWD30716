class SessionStore {
  constructor(storage, key) {
    this.storage = storage;
    this.key = key;
  }

  get() {
    const saved = this.storage.getItem(this.key);
    if (!saved) return null;

    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }

  set(session) {
    this.storage.setItem(this.key, JSON.stringify(session));
  }

  clear() {
    this.storage.removeItem(this.key);
  }
}
