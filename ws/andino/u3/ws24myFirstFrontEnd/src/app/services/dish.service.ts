import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dish } from '../models/dish.model';

export interface DishState {
  dishes: Dish[];
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class DishService {
  private readonly apiUrl = 'http://3.20.57.154:3000/ops/menu/dishes';
  private readonly state = signal<DishState>({
    dishes: [],
    loading: false,
    error: null,
  });

  readonly dishes = this.state.asReadonly();

  constructor(private readonly http: HttpClient) {}

  fetchDishes(): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
    this.http.get<Dish[]>(this.apiUrl).subscribe({
      next: (dishes) =>
        this.state.update(() => ({ dishes, loading: false, error: null })),
      error: (err) => {
        const message = err instanceof Error ? err.message : 'Failed to fetch dishes';
        this.state.update((s) => ({ ...s, loading: false, error: message }));
      },
    });
  }
}
