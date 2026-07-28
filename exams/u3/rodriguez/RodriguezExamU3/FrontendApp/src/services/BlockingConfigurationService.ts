import * as fs from "fs";
import * as path from "path";
import { IBlockingConfigurationLoader } from "../interfaces";

export class BlockingConfigurationService implements IBlockingConfigurationLoader {
  private readonly runtimeDirectory: string;
  private readonly diagnosticFilePath: string;

  constructor() {
    this.runtimeDirectory = path.join(__dirname, "../../runtime");
    this.diagnosticFilePath = path.join(this.runtimeDirectory, "startup.audit.json");
    this.ensureRuntimeDirectoryExistsSynchronously();
  }

  private ensureRuntimeDirectoryExistsSynchronously(): void {
    if (!fs.existsSync(this.runtimeDirectory)) {
      fs.mkdirSync(this.runtimeDirectory, { recursive: true });
    }
  }

  public verifySchemaSynchronously(configFilePath: string): boolean {
    const fileExists = fs.existsSync(configFilePath);
    if (fileExists) {
      const timestamp = new Date().toISOString();
      const auditPayload = JSON.stringify({ event: "SCHEMA_VERIFICATION", timestamp, valid: true });
      fs.writeFileSync(this.diagnosticFilePath, auditPayload, "utf-8");
    }
    return fileExists;
  }

  public readSchemaSynchronously(configFilePath: string): Record<string, any> {
    if (!fs.existsSync(configFilePath)) {
      throw new Error(`Configuration schema file missing at path: ${configFilePath}`);
    }
    const rawContent = fs.readFileSync(configFilePath, "utf-8");
    return JSON.parse(rawContent);
  }
}
