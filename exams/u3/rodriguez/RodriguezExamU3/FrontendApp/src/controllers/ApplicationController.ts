import { Request, Response } from "express";
import { 
  IDataService, 
  IReactiveStreamService,
  INonBlockingAuditService,
  IBlockingConfigurationLoader
} from "../interfaces";

export class ApplicationController {
  private readonly dataService: IDataService;
  private readonly reactiveService: IReactiveStreamService;
  private readonly auditService: INonBlockingAuditService;
  private readonly configLoader: IBlockingConfigurationLoader;

  constructor(
    dataService: IDataService,
    reactiveService: IReactiveStreamService,
    auditService: INonBlockingAuditService,
    configLoader: IBlockingConfigurationLoader
  ) {
    this.dataService = dataService;
    this.reactiveService = reactiveService;
    this.auditService = auditService;
    this.configLoader = configLoader;
  }

  public renderDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const records = await this.dataService.fetchAll();
      this.reactiveService.publish(records);

      const filterAttribute = req.query.attribute as string || "";
      const filterQuery = req.query.query as string || "";
      let filteredRecords = records;
      
      if (filterAttribute && filterQuery) {
        filteredRecords = this.reactiveService.filterByAttribute(filterAttribute, filterQuery);
      }

      const statistics = this.reactiveService.transformToStatistics();

      res.render("dashboard", {
        records: filteredRecords,
        statistics,
        filterAttribute,
        filterQuery,
        errorMessage: null,
        successMessage: null
      });
    } catch (error: any) {
      this.renderDashboardWithError(res, "Failed to load dashboard data: " + error.message);
    }
  }

  public handleCreation = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.dataService.persist(req.body);
      
      this.auditService.logEventAsynchronously("CREATE_RECORD", req.body)
        .catch(err => console.error("Non-blocking audit failed:", err));

      res.redirect("/");
    } catch (error: any) {
      this.renderDashboardWithError(res, "Failed to create record: " + error.message);
    }
  }

  public renderEditForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
      const record = await this.dataService.fetchById(idParam);
      res.render("edit", { record, errorMessage: null });
    } catch (error: any) {
      res.redirect("/?error=Record+not+found");
    }
  }

  public handleModification = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
      await this.dataService.modify(idParam, req.body);

      this.auditService.logEventAsynchronously("UPDATE_RECORD", { id: idParam, ...req.body })
        .catch(err => console.error("Non-blocking audit failed:", err));

      res.redirect("/");
    } catch (error: any) {
      try {
        const idParam = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
        const record = await this.dataService.fetchById(idParam);
        res.render("edit", { record, errorMessage: "Failed to update: " + error.message });
      } catch (e) {
        res.redirect("/");
      }
    }
  }

  public handleRemoval = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
      await this.dataService.remove(idParam);

      this.auditService.logEventAsynchronously("DELETE_RECORD", { id: idParam })
        .catch(err => console.error("Non-blocking audit failed:", err));

      res.redirect("/");
    } catch (error: any) {
      this.renderDashboardWithError(res, "Failed to delete record: " + error.message);
    }
  }

  public triggerDatasetExport = async (req: Request, res: Response): Promise<void> => {
    try {
      const records = await this.dataService.fetchAll();
      const exportPath = "./public/exports/data-snapshot.json";
      await this.auditService.exportSnapshotAsynchronously(exportPath, records);
      res.redirect("/?success=Export+completed+in+background");
    } catch (error: any) {
      this.renderDashboardWithError(res, "Export failed: " + error.message);
    }
  }

  public inspectSystemDiagnostics = async (req: Request, res: Response): Promise<void> => {
    try {
      // Mocking schema validation since we hardcoded the product
      const isValid = this.configLoader.verifySchemaSynchronously(req.app.get("configFilePath") || "");
      res.json({
        status: "operational",
        mode: "hardcoded_product_architecture",
        blockingValidationResult: isValid,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  private async renderDashboardWithError(res: Response, errorMessage: string): Promise<void> {
    const records = await this.dataService.fetchAll().catch(() => []);
    this.reactiveService.publish(records);
    const statistics = this.reactiveService.transformToStatistics();
    
    res.render("dashboard", {
      records,
      statistics,
      filterAttribute: "",
      filterQuery: "",
      errorMessage,
      successMessage: null
    });
  }
}
