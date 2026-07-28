import * as dotenv from "dotenv";
import * as path from "path";
import express, { Express } from "express";
import cors from "cors";

import { AsyncRestApiService } from "./services/AsyncRestApiService";
import { ReactiveUIStateService } from "./services/ReactiveUIStateService";
import { BlockingConfigurationService } from "./services/BlockingConfigurationService";
import { NonBlockingExportService } from "./services/NonBlockingExportService";
import { ApplicationController } from "./controllers/ApplicationController";

dotenv.config();

export class FrontendApplicationServer {
  private readonly app: Express;
  private readonly port: number;
  private readonly controller: ApplicationController;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3010;

    const businessApiUrl = process.env.BUSINESS_API_URL || "http://localhost:3014";
    const businessApiPrefix = process.env.BUSINESS_API_PREFIX || "/api";
    const defaultRoutePath = process.env.DEFAULT_ROUTE_PATH || "/dashboard";

    const dataService = new AsyncRestApiService();
    const reactiveService = new ReactiveUIStateService();
    const blockingService = new BlockingConfigurationService();
    const auditService = new NonBlockingExportService();

    this.controller = new ApplicationController(dataService, reactiveService, auditService, blockingService);
    this.configureApplication();
  }

  private configureApplication(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());

    const viewsPath = path.join(__dirname, "../views");
    const publicPath = path.join(__dirname, "../public");
    const configFilePath = path.join(__dirname, "./config/EntityUIConfig.js");

    this.app.set("view engine", "ejs");
    this.app.set("views", viewsPath);
    this.app.set("configFilePath", configFilePath);
    this.app.use(express.static(publicPath));
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.app.get("/", (req, res) => this.controller.renderDashboard(req, res));
    this.app.post("/create", (req, res) => this.controller.handleCreation(req, res));
    this.app.get("/edit/:id", (req, res) => this.controller.renderEditForm(req, res));
    this.app.post("/update/:id", (req, res) => this.controller.handleModification(req, res));
    this.app.get("/delete/:id", (req, res) => this.controller.handleRemoval(req, res));
    this.app.post("/delete/:id", (req, res) => this.controller.handleRemoval(req, res));
    this.app.get("/export", (req, res) => this.controller.triggerDatasetExport(req, res));
    this.app.get("/api/status", (req, res) => this.controller.inspectSystemDiagnostics(req, res));
  }

  public launch(): void {
    this.app.listen(this.port, () => {
      process.stdout.write(`Generic Frontend Application operating on port ${this.port}\n`);
    });
  }
}

const application = new FrontendApplicationServer();
application.launch();
