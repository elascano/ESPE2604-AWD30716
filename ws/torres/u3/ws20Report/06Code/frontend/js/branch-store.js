class BranchStore {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.branches = [];
    this.styles = [];
    this.levels = [];
  }

  async load() {
    const [branchesPayload, stylesPayload, levelsPayload] = await Promise.all([
      this.safeFetch("/api/branches", [
        { id: 1, name: "Matrix" },
        { id: 2, name: "North" },
        { id: 3, name: "Quitumbe" },
        { id: 4, name: "Conocoto" },
        { id: 5, name: "Tumbaco" }
      ]),
      this.safeFetch("/api/styles", [
        { id: 1, name: "Reggaeton" },
        { id: 2, name: "Urban" },
        { id: 3, name: "Hip hop" },
        { id: 4, name: "Afro" },
        { id: 5, name: "House" },
        { id: 6, name: "Salsa" },
        { id: 7, name: "Bachata" },
        { id: 8, name: "Stage training" }
      ]),
      this.safeFetch("/api/levels", [
        { id: 1, name: "B1" },
        { id: 2, name: "B2" }
      ])
    ]);
    this.branches = branchesPayload.data || [];
    this.styles = stylesPayload.data || [];
    this.levels = levelsPayload.data || [];
  }

  async safeFetch(url, fallback) {
    try {
      return await this.apiClient.request(url, { auth: false });
    } catch {
      return { data: fallback };
    }
  }

  fillSelects() {
    document.querySelectorAll("[data-branch-select], #enrollBranch, #teacherKioskBranch").forEach((select) => {
      this.populateSelect(select, this.branches);
    });
  }

  fillStyleSelects() {
    document.querySelectorAll("[data-style-select], #enrollStyle").forEach((select) => {
      this.populateSelect(select, this.styles);
    });
  }

  fillLevelSelects() {
    document.querySelectorAll("[data-level-select], #enrollLevel").forEach((select) => {
      this.populateSelect(select, this.levels);
    });
  }

  populateSelect(select, items) {
    const current = select.value;
    select.innerHTML = items.map((item) => (
      `<option value="${item.id}">${Dom.escape(item.name)}</option>`
    )).join("");
    if (current) select.value = current;
  }

  name(branchId) {
    const branch = this.branches.find((item) => Number(item.id) === Number(branchId));
    return branch ? branch.name : "Pending";
  }
}
