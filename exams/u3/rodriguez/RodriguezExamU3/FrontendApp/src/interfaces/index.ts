export interface IProduct {
  id?: number | string;
  _id?: string;
  name: string;
  price: number;
  expiration_day: number;
  expiration_month: number;
  expiration_year: number;
  iva_amount?: number;
  days_left?: number;
}

export interface IDataService {
  fetchAll(): Promise<IProduct[]>;
  fetchById(identifier: string | number): Promise<IProduct>;
  persist(payload: Record<string, any>): Promise<IProduct>;
  modify(identifier: string | number, payload: Record<string, any>): Promise<IProduct>;
  remove(identifier: string | number): Promise<void>;
}

export interface IReactiveStreamService {
  publish(collection: IProduct[]): void;
  observe(): any;
  filterByAttribute(attribute: string, query: string): IProduct[];
  transformToStatistics(): Record<string, number>;
}

export interface IBlockingConfigurationLoader {
  verifySchemaSynchronously(configFilePath: string): boolean;
  readSchemaSynchronously(configFilePath: string): Record<string, any>;
}

export interface INonBlockingAuditService {
  logEventAsynchronously(eventType: string, details: Record<string, any>): Promise<boolean>;
  exportSnapshotAsynchronously(destinationPath: string, dataset: Record<string, any>[]): Promise<string>;
}
