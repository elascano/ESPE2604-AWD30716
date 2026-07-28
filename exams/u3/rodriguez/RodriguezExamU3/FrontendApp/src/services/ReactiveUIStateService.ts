import { BehaviorSubject, Observable } from "rxjs";
import { IReactiveStreamService, IProduct } from "../interfaces";

export class ReactiveUIStateService implements IReactiveStreamService {
  private stateSubject: BehaviorSubject<IProduct[]>;
  public state$: Observable<IProduct[]>;

  constructor() {
    this.stateSubject = new BehaviorSubject<IProduct[]>([]);
    this.state$ = this.stateSubject.asObservable();
  }

  public publish(collection: IProduct[]): void {
    this.stateSubject.next(collection);
  }

  public observe(): Observable<IProduct[]> {
    return this.state$;
  }

  public filterByAttribute(attribute: string, query: string): IProduct[] {
    const currentState = this.stateSubject.getValue();
    if (!query) return currentState;
    const lowerQuery = query.toLowerCase();
    
    return currentState.filter((item: Record<string, any>) => {
      const value = item[attribute];
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(lowerQuery);
    });
  }

  public transformToStatistics(): Record<string, number> {
    const currentState = this.stateSubject.getValue();
    const totalRecords = currentState.length;
    
    let activeProducts = 0;
    let expiredProducts = 0;
    let totalPriceSum = 0;
    
    currentState.forEach(item => {
      if (item.days_left && item.days_left <= 0) {
        expiredProducts++;
      } else {
        activeProducts++;
      }
      totalPriceSum += Number(item.price) || 0;
    });
    
    const averagePriceValue = totalRecords > 0 ? totalPriceSum / totalRecords : 0;
    
    return {
      totalRecords,
      activeProducts,
      expiredProducts,
      averagePriceValue
    };
  }
}
