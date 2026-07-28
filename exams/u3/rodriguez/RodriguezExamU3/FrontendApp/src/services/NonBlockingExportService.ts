import * as fs from "fs/promises";
import * as path from "path";
import { INonBlockingAuditService } from "../interfaces";

export class NonBlockingExportService implements INonBlockingAuditService {
  private readonly exportDirectory: string;

  constructor() {
    this.exportDirectory = path.join(__dirname, "../../exports");
  }

  private async initializeDirectoryAsynchronously(): Promise<void> {
    await fs.mkdir(this.exportDirectory, { recursive: true });
  }

  public async logEventAsynchronously(eventType: string, details: Record<string, any>): Promise<boolean> {
    try {
      await this.initializeDirectoryAsynchronously();
      const filename = `audit-${Date.now()}.log`;
      const fullPath = path.join(this.exportDirectory, filename);
      const content = JSON.stringify({ eventType, timestamp: new Date().toISOString(), details }, null, 2);
      await fs.writeFile(fullPath, content, "utf-8");
      return true;
    } catch (error) {
      return false;
    }
  }

  public async exportSnapshotAsynchronously(destinationFilename: string, dataset: Record<string, any>[]): Promise<string> {
    await this.initializeDirectoryAsynchronously();
    const targetPath = path.join(this.exportDirectory, destinationFilename);
    const exportContent = JSON.stringify({ exportedAt: new Date().toISOString(), totalRecords: dataset.length, records: dataset }, null, 2);
    await fs.writeFile(targetPath, exportContent, "utf-8");
    return targetPath;
  }
}
