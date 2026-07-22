import CircuitBreaker from 'opossum';

/**
 * CrudClient — Cliente HTTP centralizado para comunicar el Servicio A con el Servicio B.
 * Incluye Circuit Breaker (opossum) para resiliencia: si el Servicio B no responde,
 * el circuito se abre y se evita una cascada de fallos.
 */
export class CrudClient {
  private baseUrl: string;
  private apiKey: string | undefined;
  private breaker: CircuitBreaker;

  constructor() {
    this.baseUrl = process.env.SERVICE_CRUD_URL || 'http://localhost:3000';
    this.apiKey = process.env.INTERNAL_API_KEY;

    // Circuit Breaker: protege Servicio A si Servicio B cae
    this.breaker = new CircuitBreaker(this.executeRequest.bind(this), {
      timeout: 3000,                // falla si Servicio B tarda más de 3s
      errorThresholdPercentage: 50, // abre el circuito si el 50% de peticiones fallan
      resetTimeout: 10000           // prueba reconexión cada 10s
    });

    this.breaker.fallback(() => {
      throw new Error('CRUD_SERVICE_UNAVAILABLE');
    });

    this.breaker.on('open', () => console.warn('[CrudClient] Circuit OPEN — Servicio B no disponible'));
    this.breaker.on('halfOpen', () => console.info('[CrudClient] Circuit HALF-OPEN — probando reconexión'));
    this.breaker.on('close', () => console.info('[CrudClient] Circuit CLOSED — Servicio B recuperado'));
  }

  private async executeRequest(method: string, path: string, body?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': this.apiKey || ''
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`Servicio B respondió con ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async get(path: string): Promise<any> {
    return this.breaker.fire('GET', path);
  }

  async post(path: string, body: any): Promise<any> {
    return this.breaker.fire('POST', path, body);
  }

  async put(path: string, body: any): Promise<any> {
    return this.breaker.fire('PUT', path, body);
  }

  async delete(path: string): Promise<any> {
    return this.breaker.fire('DELETE', path);
  }
}

// Singleton compartido por todos los controllers
export const crudClient = new CrudClient();
