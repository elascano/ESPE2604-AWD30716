import axios, { AxiosInstance } from "axios";
import { IDataService, IProduct } from "../interfaces";

export class AsyncRestApiService implements IDataService {
  private readonly httpClient: AxiosInstance;
  private readonly resourceEndpoint: string;

  constructor() {
    const businessUrl = process.env.BUSINESS_API_URL || "http://localhost:3014";
    this.resourceEndpoint = "/products-api/product";

    this.httpClient = axios.create({
      baseURL: businessUrl,
      timeout: 10000,
      headers: { "Content-Type": "application/json" }
    });
  }

  async fetchAll(): Promise<IProduct[]> {
    const response = await this.httpClient.get<IProduct[]>(this.resourceEndpoint);
    return response.data;
  }

  async fetchById(identifier: string | number): Promise<IProduct> {
    const response = await this.httpClient.get<IProduct>(`${this.resourceEndpoint}/${identifier}`);
    return response.data;
  }

  async persist(payload: Record<string, any>): Promise<IProduct> {
    const response = await this.httpClient.post<IProduct>(this.resourceEndpoint, payload);
    return response.data;
  }

  async modify(identifier: string | number, payload: Record<string, any>): Promise<IProduct> {
    const response = await this.httpClient.put<IProduct>(`${this.resourceEndpoint}/${identifier}`, payload);
    return response.data;
  }

  async remove(identifier: string | number): Promise<void> {
    await this.httpClient.delete(`${this.resourceEndpoint}/${identifier}`);
  }
}
