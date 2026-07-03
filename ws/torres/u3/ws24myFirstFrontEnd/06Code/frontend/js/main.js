class AmericanLatinApp {
  constructor() {
    this.config = new AppConfig();
    this.sessionStore = new SessionStore(window.sessionStorage, this.config.sessionKey);
    this.apiClient = new ApiClient(this.config, this.sessionStore);
    this.branchStore = new BranchStore(this.apiClient);
    this.publicPages = new PublicPagesController(this.apiClient, this.sessionStore, this.branchStore);
    this.dashboard = new DashboardController(this.config, this.apiClient, this.sessionStore, this.branchStore);
  }

  async start() {
    await this.branchStore.load();
    this.branchStore.fillSelects();
    this.branchStore.fillStyleSelects();
    this.branchStore.fillLevelSelects();
    this.publicPages.init();
    await this.dashboard.init();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new AmericanLatinApp().start();
});
